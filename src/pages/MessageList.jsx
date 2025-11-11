import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ConversationActions } from '@/components/messages/ConversationActions';
import { formatDate } from '@/lib/utils';
import { mockAPIService } from '@/services/mockAPIService';
import { mockStorageService } from '@/services/mockStorageService';
import { mockAuthService } from '@/services/mockAuthService';
import { useMock } from '@/config/environment';
import { useUnreadCount } from '@/contexts/UnreadContext';
import * as queries from '@/graphql/queries';
import * as mutations from '@/graphql/mutations';
import * as subscriptions from '@/graphql/subscriptions';

export function MessageList() {
  const navigate = useNavigate();
  const { myUserId } = useParams();
  const { refreshUnreadCount } = useUnreadCount();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [appUser, setAppUser] = useState(null);

  useEffect(() => {
    loadCurrentUser();
    loadConversations();
  }, [myUserId]);

  useEffect(() => {
    filterConversations();
  }, [conversations, searchQuery]);

  // Reload conversations when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadConversations(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [myUserId]);

  // Subscribe to user profile updates (AWS only)
  useEffect(() => {
    if (useMock || !conversations.length) return;

    let subscription;
    const setupSubscription = async () => {
      try {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        
        subscription = client.graphql({
          query: subscriptions.onUpdateUser
        }).subscribe({
          next: ({ data }) => {
            const updatedUser = data.onUpdateUser;
            
            setConversations(prev => prev.map(conv => {
              const otherUserId = conv.biker_id === myUserId ? conv.photographer_id : conv.biker_id;
              if (otherUserId === updatedUser.id && updatedUser.profile_image) {
                (async () => {
                  try {
                    const { getUrl } = await import('aws-amplify/storage');
                    const urlResult = await getUrl({ path: updatedUser.profile_image });
                    setConversations(current => current.map(c => 
                      c.id === conv.id ? { ...c, profileImageUrl: urlResult.url.href } : c
                    ));
                  } catch (error) {
                    console.error('Error loading updated profile image:', error);
                  }
                })();
              }
              return conv;
            }));
          },
          error: (error) => console.error('Subscription error:', error)
        });
      } catch (error) {
        console.error('Setup subscription error:', error);
      }
    };

    setupSubscription();
    return () => subscription?.unsubscribe();
  }, [conversations, myUserId]);

  const loadCurrentUser = async () => {
    try {
      let currentUser;
      if (useMock) {
        currentUser = await mockAuthService.getCurrentUser();
      } else {
        const { getCurrentUser } = await import('aws-amplify/auth');
        currentUser = await getCurrentUser();
      }

      if (currentUser) {
        const userId = currentUser.userId || currentUser.sub;
        let userData;
        if (useMock) {
          userData = await mockAPIService.mockGetUser(userId);
        } else {
          const { generateClient } = await import('aws-amplify/api');
          const client = generateClient();
          const result = await client.graphql({
            query: queries.getUser,
            variables: { id: userId }
          });
          userData = result.data.getUser;
        }
        setAppUser(userData);
      }
    } catch (error) {
      console.error('Load current user error:', error);
    }
  };

  const loadConversations = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      let conversationsList;
      if (useMock) {
        const result = await mockAPIService.mockListConversations(myUserId);
        conversationsList = result.items;
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        
        const bikerConvs = await client.graphql({
          query: queries.conversationsByBiker,
          variables: { biker_id: myUserId }
        });
        
        const photographerConvs = await client.graphql({
          query: queries.conversationsByPhotographer,
          variables: { photographer_id: myUserId }
        });
        
        conversationsList = [
          ...(bikerConvs.data.conversationsByBiker?.items || []),
          ...(photographerConvs.data.conversationsByPhotographer?.items || [])
        ];
      }

      // Load profile images and check for unread messages
      const conversationsWithImages = [];
      
      for (const conversation of conversationsList) {
        const otherUserId = conversation.biker_id === myUserId 
          ? conversation.photographer_id 
          : conversation.biker_id;
        
        let userData;
        let profileImageUrl = null;
        
        try {
          if (useMock) {
            userData = await mockAPIService.mockGetUser(otherUserId);
            if (userData?.profile_image) {
              profileImageUrl = await mockStorageService.getImageUrl(userData.profile_image);
            }
          } else {
            const { generateClient } = await import('aws-amplify/api');
            const client = generateClient();
            const result = await client.graphql({
              query: queries.getUser,
              variables: { id: otherUserId }
            });
            userData = result.data.getUser;
            
            if (userData?.profile_image) {
              const { getUrl } = await import('aws-amplify/storage');
              const urlResult = await getUrl({ path: userData.profile_image });
              profileImageUrl = urlResult.url.href;
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }

        // Check for unread messages
        let hasUnread = false;
        try {
          let messages = [];
          if (useMock) {
            const result = await mockAPIService.mockListMessages(conversation.id);
            messages = result.items || [];
          } else {
            const { generateClient } = await import('aws-amplify/api');
            const client = generateClient();
            const result = await client.graphql({
              query: queries.messagesByConversation,
              variables: { conversationID: conversation.id }
            });
            messages = result.data.messagesByConversation.items || [];
          }
          
          // Check if there are any unread messages from the other user
          hasUnread = messages.some(m => 
            m.sender_id !== myUserId && !m.is_read
          );
        } catch (error) {
          console.error('Error checking unread messages:', error);
        }

        conversationsWithImages.push({
          ...conversation,
          otherUser: userData,
          profileImageUrl,
          hasUnread
        });
      }

      setConversations(prev => {
        // 既存の会話のprofileImageUrlを保持
        return conversationsWithImages.map(newConv => {
          const existingConv = prev.find(c => c.id === newConv.id);
          if (existingConv && existingConv.profileImageUrl && !newConv.profileImageUrl) {
            return { ...newConv, profileImageUrl: existingConv.profileImageUrl };
          }
          return newConv;
        });
      });
    } catch (error) {
      console.error('Load conversations error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterConversations = () => {
    if (!searchQuery) {
      setFilteredConversations(conversations);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = conversations.filter(conv => {
      const otherName = conv.biker_id === myUserId 
        ? conv.photographer_name 
        : conv.biker_name;
      const lastMessage = conv.last_message || '';
      
      return otherName.toLowerCase().includes(query) || 
             lastMessage.toLowerCase().includes(query);
    });

    setFilteredConversations(filtered);
  };

  const handleConversationClick = (conversation) => {
    const otherUserId = conversation.biker_id === myUserId 
      ? conversation.photographer_id 
      : conversation.biker_id;
    
    navigate(`/messages/${myUserId}/${otherUserId}`);
  };

  const handleComplete = async (conversation) => {
    try {
      // 会話データに「誰が完了したか」を記録
      const otherUserId = conversation.biker_id === myUserId 
        ? conversation.photographer_id 
        : conversation.biker_id;
      
      // completed_by フィールドを追加/更新
      if (useMock) {
        const data = JSON.parse(localStorage.getItem('mockAPIData') || '{}');
        const convIndex = data.conversations.findIndex(c => c.id === conversation.id);
        if (convIndex !== -1) {
          if (!data.conversations[convIndex].completed_by) {
            data.conversations[convIndex].completed_by = [];
          }
          if (!data.conversations[convIndex].completed_by.includes(myUserId)) {
            data.conversations[convIndex].completed_by.push(myUserId);
          }
          localStorage.setItem('mockAPIData', JSON.stringify(data));
        }
      } else {
        // AWS implementation
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        const completedBy = conversation.completed_by || [];
        if (!completedBy.includes(myUserId)) {
          completedBy.push(myUserId);
        }
        await client.graphql({
          query: mutations.updateConversation,
          variables: { 
            input: { 
              id: conversation.id,
              completed_by: completedBy
            } 
          }
        });
      }
      
      // レビュー画面に遷移
      navigate('/review-complete', { 
        state: { 
          conversation,
          otherUserId,
          myUserId,
          returnTo: `/messages/${myUserId}`
        } 
      });
    } catch (error) {
      console.error('Complete conversation error:', error);
    }
  };

  const handleCancel = async (conversation) => {
    try {
      // 会話を削除
      if (useMock) {
        // Mock環境での削除処理
        const data = JSON.parse(localStorage.getItem('mockAPIData') || '{}');
        data.conversations = data.conversations.filter(c => c.id !== conversation.id);
        data.messages = data.messages.filter(m => m.conversationID !== conversation.id);
        localStorage.setItem('mockAPIData', JSON.stringify(data));
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        await client.graphql({
          query: mutations.deleteConversation,
          variables: { input: { id: conversation.id } }
        });
      }

      // 会話リストを再読み込み
      await loadConversations();
    } catch (error) {
      console.error('Cancel conversation error:', error);
    }
  };

  // 自分が完了済みの会話と、メッセージがまだない会話をフィルタリング
  const filteredConversationsToShow = filteredConversations.filter(conv => {
    // completed_by に自分のIDが含まれている場合は非表示
    if (conv.completed_by && conv.completed_by.includes(myUserId)) {
      return false;
    }
    // last_messageが空の場合は非表示（最初のメッセージが送信されるまで表示しない）
    if (!conv.last_message || conv.last_message.trim() === '') {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">メッセージ</h1>
            <p className="text-muted-foreground">
              フォトグラファーとのやり取り
            </p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="会話を検索..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredConversationsToShow.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {filteredConversationsToShow.length}件の会話があります
              </div>
              <div className="space-y-3">
              {filteredConversationsToShow.map((conversation, index) => {
                const otherName = conversation.biker_id === myUserId 
                  ? conversation.photographer_name 
                  : conversation.biker_name;
                
                return (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div 
                          className="flex items-start gap-4 cursor-pointer mb-3"
                          onClick={() => handleConversationClick(conversation)}
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={conversation.profileImageUrl} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {otherName?.[0] || '?'}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold truncate">
                                {otherName}
                              </h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {formatDate(conversation.last_message_at)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {conversation.last_message || 'メッセージはありません'}
                            </p>
                          </div>

                          {conversation.hasUnread && (
                            <Badge variant="destructive" className="ml-2 font-semibold">
                              NEW
                            </Badge>
                          )}
                        </div>

                        <ConversationActions
                          conversation={conversation}
                          onComplete={handleComplete}
                          onCancel={handleCancel}
                          currentUserId={myUserId}
                          appUser={appUser}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? '検索結果が見つかりませんでした' 
                    : 'まだメッセージがありません'}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

