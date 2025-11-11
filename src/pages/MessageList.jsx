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
import { useUnreadCount } from '@/contexts/UnreadContext';
import * as queries from '@/graphql/queries';
import * as mutations from '@/graphql/mutations';
import * as subscriptions from '@/graphql/subscriptions';

// Mock imports (useMock = true の場合のみ)
import { mockAPIService } from '@/services/mockAPIService';
import { mockStorageService } from '@/services/mockStorageService';
import { useMock } from '@/config/environment';

export function MessageList() {
  const navigate = useNavigate();
  const { myUserId } = useParams();
  const { refreshUnreadCount } = useUnreadCount();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [appUser, setAppUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadCurrentUser = async () => {
    try {
      if (useMock) {
        // Mock環境のユーザー取得ロジックは現状ないためスキップ
        // 必要に応じて mockAuthService.getCurrentUser() と mockAPIService.mockGetUser() を呼ぶ
      } else {
        const { getCurrentUser } = await import('aws-amplify/auth');
        const currentUser = await getCurrentUser();

        if (currentUser) {
          const userId = currentUser.userId || currentUser.sub;
          const { generateClient } = await import('aws-amplify/api');
          const client = generateClient();
          const result = await client.graphql({
            query: queries.getUser,
            variables: { id: userId }
          });
          setAppUser(result.data.getUser);
        }
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
      
      let conversationsList = [];
      const conversationsWithData = [];
      const client = useMock ? null : (await import('aws-amplify/api')).generateClient();

      if (useMock) {
        const result = await mockAPIService.mockListConversations(myUserId);
        conversationsList = result.items || [];
      } else {
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

      for (const conversation of conversationsList) {
        const otherUserId = conversation.biker_id === myUserId 
          ? conversation.photographer_id 
          : conversation.biker_id;
        
        let userData;
        let profileImageUrl = null;
        let unreadCount = 0;

        try {
          if (useMock) {
            userData = await mockAPIService.mockGetUser(otherUserId);
            if (userData?.profile_image) {
              profileImageUrl = await mockStorageService.getImageUrl(userData.profile_image);
            }
            const messagesResult = await mockAPIService.mockListMessages(conversation.id);
            const messages = messagesResult.items || [];
            unreadCount = messages.filter(m => m.sender_id !== myUserId && !m.is_read).length;
          } else {
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

            const messagesResult = await client.graphql({
              query: queries.messagesByConversation,
              variables: { conversationID: conversation.id }
            });
            const messages = messagesResult.data.messagesByConversation.items || [];
            
            unreadCount = messages.filter(m => 
              m.sender_id !== myUserId && !m.is_read
            ).length;
          }
        } catch (error) {
          console.error('Error loading conversation details:', error);
        }

        conversationsWithData.push({
          ...conversation,
          otherUser: userData,
          profileImageUrl,
          unreadCount
        });
      }

      // --- ▼ 修正箇所 スタート ▼ ---
      // 会話を最終メッセージ時刻でソート
      conversationsWithData.sort((a, b) => 
        new Date(b.last_message_at) - new Date(a.last_message_at)
      );
      // --- ▲ 修正箇所 エンド ▲ ---

      setConversations(conversationsWithData);
    } catch (error) {
      console.error('Load conversations error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserId, refreshKey]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredConversations(conversations);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = conversations.filter(conv => {
        const otherName = conv.biker_id === myUserId 
          ? conv.photographer_name 
          : conv.biker_name;
        const lastMessage = conv.last_message || '';
        
        return (otherName && otherName.toLowerCase().includes(query)) || 
               lastMessage.toLowerCase().includes(query);
      });
      setFilteredConversations(filtered);
    }
  }, [conversations, searchQuery, myUserId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadConversations(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserId]);


  // --- ▼ 修正箇所 スタート (サブスクリプションのロジック全体) ▼ ---
  useEffect(() => {
    if (useMock) {
      // Mock環境ではサブスクリプションの代わりにポーリングなどで対応する
      // (現在は未実装だが、ヘッダーのポーリングで代用される)
      return;
    }

    let createSubscription;
    let updateSubscription;
    
    const setupSubscription = async () => {
      try {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        
        // 1. 新しいメッセージ（未読）を検知するサブスクリプション
        createSubscription = client.graphql({
          query: subscriptions.onCreateMessage
        }).subscribe({
          next: ({ data }) => {
            const newMessage = data.onCreateMessage;
            
            // 自分宛のメッセージか、該当する会話がリストにあるか確認
            if (newMessage.sender_id !== myUserId) {
              setConversations(prev => {
                const targetConvIndex = prev.findIndex(c => c.id === newMessage.conversationID);
                
                if (targetConvIndex > -1) {
                  // 該当の会話の未読数をインクリメントして状態を更新
                  const updatedConvs = [...prev];
                  const targetConv = { ...updatedConvs[targetConvIndex] };
                  targetConv.unreadCount = (targetConv.unreadCount || 0) + 1;
                  targetConv.last_message = newMessage.content || '[画像]';
                  targetConv.last_message_at = newMessage.createdAt;
                  updatedConvs[targetConvIndex] = targetConv;
                  
                  // 未読メッセージが届いたらリストの先頭に持ってくる（ソート）
                  updatedConvs.sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));
                  
                  refreshUnreadCount(); // グローバルな未読数も更新
                  return updatedConvs;
                }
                return prev;
              });
            }
          },
          error: (error) => console.error('onCreateMessage Subscription error:', error)
        });

        // 2. 既読更新を検知するサブスクリプション
        updateSubscription = client.graphql({
          query: subscriptions.onUpdateMessage
        }).subscribe({
          next: async ({ data }) => {
            const updatedMessage = data.onUpdateMessage;
            
            // メッセージが既読になった場合
            if (updatedMessage.is_read) {
              try {
                // 該当の会話の未読数を再計算
                const result = await client.graphql({
                  query: queries.messagesByConversation,
                  variables: { conversationID: updatedMessage.conversationID }
                });
                const messages = result.data.messagesByConversation.items || [];
                
                const unreadCount = messages.filter(m => 
                  m.sender_id !== myUserId && !m.is_read
                ).length;
                
                setConversations(prev => prev.map(conv => 
                  conv.id === updatedMessage.conversationID ? { ...conv, unreadCount } : conv
                ));
                
                refreshUnreadCount(); // グローバルな未読数も更新
              } catch (error) {
                console.error('Error recalculating unread count on update:', error);
              }
            }
          },
          error: (error) => console.error('onUpdateMessage Subscription error:', error)
        });
      } catch (error) {
        console.error('Setup subscription error:', error);
      }
    };

    setupSubscription();
    
    return () => {
      createSubscription?.unsubscribe();
      updateSubscription?.unsubscribe();
    };
  }, [myUserId, refreshUnreadCount, useMock]); // useMock を依存配列に追加
  // --- ▲ 修正箇所 エンド ▲ ---


  const handleConversationClick = async (conversation) => {
    // UIを即時反映
    setConversations(prev => prev.map(conv => 
      conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
    ));
    
    const otherUserId = conversation.biker_id === myUserId 
      ? conversation.photographer_id 
      : conversation.biker_id;
    
    navigate(`/messages/${myUserId}/${otherUserId}`, {
      state: { from: 'messageList', conversationId: conversation.id }
    });
  };

  useEffect(() => {
    window.refreshMessageList = () => {
      setRefreshKey(prev => prev + 1);
    };
    return () => {
      delete window.refreshMessageList;
    };
  }, []);

  const handleComplete = async (conversation) => {
    try {
      const otherUserId = conversation.biker_id === myUserId 
        ? conversation.photographer_id 
        : conversation.biker_id;
      
      const reviewPath = `/messages/${myUserId}/${otherUserId}/review`;
      
      navigate(reviewPath, { 
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
      if (useMock) {
        await mockAPIService.mockDeleteConversation(conversation.id);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        await client.graphql({
          query: mutations.deleteConversation,
          variables: { input: { id: conversation.id } }
        });
      }

      await loadConversations();
    } catch (error) {
      console.error('Cancel conversation error:', error);
    }
  };

  const filteredConversationsToShow = filteredConversations.filter(conv => {
    // Mock環境では completed_by が存在しない可能性があるためチェック
    if (useMock) {
      if (!conv.last_message || conv.last_message.trim() === '') {
        return false;
      }
      return true;
    }
    
    // AWS環境のロジック
    if (conv.completed_by && conv.completed_by.includes(myUserId)) {
      return false;
    }
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

                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2 font-semibold">
                              NEW
                            </Badge>
                          )}
                        </div>

                        {/* アクションボタンはMock環境では表示しない（appUserがロードされないため） */}
                        {!useMock && appUser && (
                          <ConversationActions
                            conversation={conversation}
                            onComplete={handleComplete}
                            onCancel={handleCancel}
                            currentUserId={myUserId}
                            appUser={appUser}
                          />
                        )}
                        {/* Mock環境用の仮表示（必要に応じて） */}
                        {useMock && (
                           <ConversationActions
                            conversation={conversation}
                            onComplete={handleComplete}
                            onCancel={handleCancel}
                            currentUserId={myUserId}
                            appUser={{ user_type: 'client' }} // Mock時は仮のappUserを渡す
                          />
                        )}
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