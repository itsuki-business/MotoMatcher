import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Image as ImageIcon, Paperclip, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MessageBubble } from '@/components/messages/MessageBubble';
import { ReviewDialog } from '@/components/messages/ReviewDialog';
import { mockAPIService } from '@/services/mockAPIService';
import { mockStorageService } from '@/services/mockStorageService';
import { useMock } from '@/config/environment';
import { useUnreadCount } from '@/contexts/UnreadContext';
import * as queries from '@/graphql/queries';
import * as mutations from '@/graphql/mutations';
import * as subscriptions from '@/graphql/subscriptions';

export function UserMessage() {
  const { myUserId, otherUserId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { refreshUnreadCount } = useUnreadCount();
  
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [otherUserImage, setOtherUserImage] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [myUserId, otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscribe to new messages in real-time
  useEffect(() => {
    if (!conversation) return;

    let subscription;
    let pollInterval;
    
    const setupSubscription = async () => {
      try {
        if (useMock) {
          // For mock environment, poll for new messages every 2 seconds
          pollInterval = setInterval(async () => {
            try {
              const messagesResult = await mockAPIService.mockListMessages(conversation.id);
              const newMessages = messagesResult.items || [];
              
              setMessages(prev => {
                // Find messages that are new
                const prevIds = new Set(prev.map(m => m.id));
                const toAdd = newMessages.filter(m => !prevIds.has(m.id));
                
                if (toAdd.length === 0) return prev;
                
                // Mark new messages from other user as read
                const hasNewFromOther = toAdd.some(msg => msg.sender_id !== myUserId && !msg.is_read);
                toAdd.forEach(msg => {
                  if (msg.sender_id !== myUserId && !msg.is_read) {
                    mockAPIService.mockMarkMessageAsRead(msg.id).catch(error => {
                      console.error('Error marking message as read:', error);
                    });
                  }
                });
                
                if (hasNewFromOther) {
                  // Refresh unread count after marking as read
                  setTimeout(() => refreshUnreadCount(), 500);
                }
                
                return [...prev, ...toAdd].sort((a, b) => 
                  new Date(a.createdAt) - new Date(b.createdAt)
                );
              });
            } catch (error) {
              console.error('Poll messages error:', error);
            }
          }, 2000);
        } else {
          // For AWS, use GraphQL subscription
          const { generateClient } = await import('aws-amplify/api');
          const client = generateClient();
          
          subscription = client.graphql({
            query: subscriptions.onCreateMessage,
            variables: { conversationID: conversation.id }
          }).subscribe({
            next: ({ data }) => {
              const newMessage = data.onCreateMessage;
              
              // Only add message if it's not from current user (to avoid duplicates)
              if (newMessage.sender_id !== myUserId) {
                setMessages(prev => {
                  // Check if message already exists
                  const exists = prev.some(m => m.id === newMessage.id);
                  if (exists) return prev;
                  return [...prev, newMessage];
                });
                
                // Mark as read immediately since user is viewing the conversation
                client.graphql({
                  query: mutations.updateMessage,
                  variables: { 
                    input: { 
                      id: newMessage.id,
                      is_read: true
                    } 
                  }
                }).then(() => {
                  // Refresh unread count after marking as read
                  refreshUnreadCount();
                }).catch(error => {
                  console.error('Error marking message as read:', error);
                });
              }
            },
            error: (error) => {
              console.error('Subscription error:', error);
            }
          });
        }
      } catch (error) {
        console.error('Setup subscription error:', error);
      }
    };

    setupSubscription();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [conversation, myUserId, useMock]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadData = async () => {
    try {
      setLoading(true);

      // Get or create conversation
      let conv;
      if (useMock) {
        conv = await mockAPIService.mockGetOrCreateConversation(myUserId, otherUserId);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        
        // Try to find existing conversation
        const bikerConvs = await client.graphql({
          query: queries.conversationsByBiker,
          variables: { biker_id: myUserId }
        });
        
        const photographerConvs = await client.graphql({
          query: queries.conversationsByPhotographer,
          variables: { photographer_id: myUserId }
        });
        
        const allConvs = [
          ...(bikerConvs.data.conversationsByBiker?.items || []),
          ...(photographerConvs.data.conversationsByPhotographer?.items || [])
        ];
        
        conv = allConvs.find(c => 
          (c.biker_id === myUserId && c.photographer_id === otherUserId) ||
          (c.biker_id === otherUserId && c.photographer_id === myUserId)
        );
        
        // Create new conversation if not found
        if (!conv) {
          const otherUserData = await client.graphql({
            query: queries.getUser,
            variables: { id: otherUserId }
          });
          
          const myUserData = await client.graphql({
            query: queries.getUser,
            variables: { id: myUserId }
          });
          
          // Determine roles based on user_type
          const myUser = myUserData.data.getUser;
          const otherUser = otherUserData.data.getUser;
          
          let bikerId, photographerId, bikerName, photographerName;
          
          if (myUser.user_type === 'photographer') {
            photographerId = myUserId;
            photographerName = myUser.nickname || myUser.email;
            bikerId = otherUserId;
            bikerName = otherUser.nickname || otherUser.email;
          } else if (otherUser.user_type === 'photographer') {
            bikerId = myUserId;
            bikerName = myUser.nickname || myUser.email;
            photographerId = otherUserId;
            photographerName = otherUser.nickname || otherUser.email;
          } else {
            // Both are clients, use myUserId as biker
            bikerId = myUserId;
            bikerName = myUser.nickname || myUser.email;
            photographerId = otherUserId;
            photographerName = otherUser.nickname || otherUser.email;
          }
          
          const result = await client.graphql({
            query: mutations.createConversation,
            variables: {
              input: {
                biker_id: bikerId,
                photographer_id: photographerId,
                biker_name: bikerName,
                photographer_name: photographerName,
                last_message: '',
                last_message_at: new Date().toISOString(),
                status: 'active'
              }
            }
          });
          conv = result.data.createConversation;
        }
      }
      setConversation(conv);

      // Load messages
      let messagesList = [];
      if (useMock) {
        const messagesResult = await mockAPIService.mockListMessages(conv.id);
        messagesList = messagesResult.items;
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        const messagesResult = await client.graphql({
          query: queries.listMessages,
          variables: { conversationID: conv.id }
        });
        messagesList = messagesResult.data.listMessages.items;
      }
      setMessages(messagesList);

      // Mark all unread messages from other user as read
      const unreadMessages = messagesList.filter(m => 
        m.sender_id !== myUserId && !m.is_read
      );
      
      if (unreadMessages.length > 0) {
        for (const message of unreadMessages) {
          try {
            if (useMock) {
              await mockAPIService.mockMarkMessageAsRead(message.id);
            } else {
              const { generateClient } = await import('aws-amplify/api');
              const client = generateClient();
              await client.graphql({
                query: mutations.updateMessage,
                variables: { 
                  input: { 
                    id: message.id,
                    is_read: true
                  } 
                }
              });
            }
          } catch (error) {
            console.error('Error marking message as read:', error);
          }
        }
        
        // Refresh unread count after marking messages as read
        refreshUnreadCount();
      }

      // Load other user info
      let userData;
      if (useMock) {
        userData = await mockAPIService.mockGetUser(otherUserId);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        const result = await client.graphql({
          query: queries.getUser,
          variables: { id: otherUserId }
        });
        userData = result.data.getUser;
      }
      setOtherUser(userData);

      if (userData?.profile_image) {
        if (useMock) {
          const url = await mockStorageService.getImageUrl(userData.profile_image);
          setOtherUserImage(url);
        } else {
          const { getUrl } = await import('aws-amplify/storage');
          const result = await getUrl({ path: userData.profile_image });
          setOtherUserImage(result.url.href);
        }
      }
    } catch (error) {
      console.error('Load messages error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !conversation) return;

    const text = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      const messageInput = {
        conversationID: conversation.id,
        sender_id: myUserId,
        content: text
      };

      if (useMock) {
        const newMessage = await mockAPIService.mockCreateMessage(messageInput);
        setMessages(prev => [...prev, newMessage]);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        const result = await client.graphql({
          query: mutations.createMessage,
          variables: { input: messageInput }
        });
        setMessages(prev => [...prev, result.data.createMessage]);
      }
    } catch (error) {
      console.error('Send message error:', error);
      setMessageText(text); // Restore text on error
    } finally {
      setSending(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !conversation) return;

    setSending(true);

    try {
      let imageKey;
      if (useMock) {
        imageKey = await mockStorageService.uploadImage(file, 'message-media');
      } else {
        const { getCurrentUser } = await import('aws-amplify/auth');
        const currentUser = await getCurrentUser();
        const currentUserId = currentUser.userId || currentUser.sub;
        
        const { uploadData } = await import('aws-amplify/storage');
        const imagePath = `message-media/${Date.now()}_${file.name}`;
        await uploadData({
          path: imagePath,
          data: file,
          options: {
            contentType: file.type,
            accessLevel: 'protected'
          }
        }).result;
        imageKey = imagePath;
      }

      const messageInput = {
        conversationID: conversation.id,
        sender_id: myUserId,
        content: messageText.trim() || null,
        media_key: imageKey,
        media_type: file.type
      };

      if (useMock) {
        const newMessage = await mockAPIService.mockCreateMessage(messageInput);
        setMessages(prev => [...prev, newMessage]);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        const result = await client.graphql({
          query: mutations.createMessage,
          variables: { input: messageInput }
        });
        setMessages(prev => [...prev, result.data.createMessage]);
      }

      setMessageText('');
    } catch (error) {
      console.error('Send image error:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/messages/${myUserId}`)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <Avatar className="w-10 h-10">
          <AvatarImage src={otherUserImage} />
          <AvatarFallback className="bg-blue-100 text-blue-600">
            {otherUser?.nickname?.[0] || '?'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h2 className="font-semibold">{otherUser?.nickname || 'ユーザー'}</h2>
          <p className="text-xs text-muted-foreground">{otherUser?.prefecture}</p>
        </div>

        {otherUser?.user_type === 'photographer' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReviewDialogOpen(true)}
            className="gap-2"
          >
            <Star className="w-4 h-4" />
            レビュー
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === myUserId}
                senderName={message.sender_id === myUserId ? 'あなた' : otherUser?.nickname}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              メッセージを送信して会話を始めましょう
            </p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending}
          >
            <ImageIcon className="w-5 h-5" />
          </Button>

          <Input
            placeholder="メッセージを入力..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            className="flex-1"
          />

          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sending}
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <ReviewDialog
        isOpen={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        revieweeId={otherUserId}
        reviewerId={myUserId}
        conversationId={conversation?.id}
        onSuccess={() => {
          // Refresh or show success message
          console.log('Review submitted');
        }}
      />
    </div>
  );
}

