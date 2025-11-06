import { createContext, useContext, useState, useEffect } from 'react';
import { mockAPIService } from '@/services/mockAPIService';
import { mockAuthService } from '@/services/mockAuthService';
import { useMock } from '@/config/environment';
import * as queries from '@/graphql/queries';

const UnreadContext = createContext();

export function UnreadProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      // Poll for updates every 5 seconds
      const interval = setInterval(loadUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUser = async () => {
    try {
      let currentUser;
      if (useMock) {
        currentUser = await mockAuthService.getCurrentUser();
      } else {
        const { getCurrentUser } = await import('aws-amplify/auth');
        currentUser = await getCurrentUser();
      }
      setUser(currentUser);
    } catch (error) {
      console.error('Load user error:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      if (!user) return;
      
      const userId = user.userId || user.sub;
      
      // Get all conversations
      let conversations = [];
      if (useMock) {
        const result = await mockAPIService.mockListConversations(userId);
        conversations = result.items || [];
      } else {
        // AWS環境では会話機能がまだ実装されていないためスキップ
        conversations = [];
      }

      // Count unread messages
      let totalUnread = 0;
      for (const conversation of conversations) {
        let messages = [];
        if (useMock) {
          const result = await mockAPIService.mockListMessages(conversation.id);
          messages = result.items || [];
        } else {
          const { generateClient } = await import('aws-amplify/api');
          const client = generateClient();
          try {
            const result = await client.graphql({
              query: queries.messagesByConversation,
              variables: { conversationID: conversation.id }
            });
            messages = result.data.messagesByConversation.items || [];
          } catch (queryError) {
            messages = [];
          }
        }
        
        // Count messages not sent by current user and not read
        const unread = messages.filter(m => 
          m.sender_id !== userId && !m.is_read
        ).length;
        totalUnread += unread;
      }

      setUnreadCount(totalUnread);
    } catch (error) {
      // プロフィール未作成の場合はエラーを無視
      setUnreadCount(0);
    }
  };

  const refreshUnreadCount = () => {
    loadUnreadCount();
  };

  return (
    <UnreadContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </UnreadContext.Provider>
  );
}

export function useUnreadCount() {
  const context = useContext(UnreadContext);
  if (context === undefined) {
    throw new Error('useUnreadCount must be used within an UnreadProvider');
  }
  return context;
}

