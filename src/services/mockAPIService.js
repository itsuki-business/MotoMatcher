// Mock APIサービス
// AWS AppSync GraphQL APIの動作を模倣

const MOCK_API_DATA_KEY = 'mockAPIData';

// ランダムID生成
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// データ初期化
const initializeData = () => {
  const data = {
    users: [],
    portfolios: [],
    conversations: [],
    messages: [],
    reviews: []
  };
  localStorage.setItem(MOCK_API_DATA_KEY, JSON.stringify(data));
  return data;
};

// データ取得
const getData = () => {
  const dataStr = localStorage.getItem(MOCK_API_DATA_KEY);
  if (!dataStr) {
    return initializeData();
  }
  return JSON.parse(dataStr);
};

// データ保存
const saveData = (data) => {
  localStorage.setItem(MOCK_API_DATA_KEY, JSON.stringify(data));
};

export const mockAPIService = {
  // ユーザー作成
  mockCreateUser: async (input) => {
    try {
      const data = getData();
      
      // 既存ユーザーチェック
      const existingUser = data.users.find(u => u.id === input.id);
      if (existingUser) {
        throw new Error('ユーザーは既に存在します');
      }

      const newUser = {
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      data.users.push(newUser);
      saveData(data);

      return newUser;
    } catch (error) {
      console.error('CreateUser error:', error);
      throw error;
    }
  },

  // ユーザー取得
  mockGetUser: async (id) => {
    try {
      const data = getData();
      const user = data.users.find(u => u.id === id);
      return user || null;
    } catch (error) {
      console.error('GetUser error:', error);
      throw error;
    }
  },

  // ユーザー更新
  mockUpdateUser: async (input) => {
    try {
      const data = getData();
      const userIndex = data.users.findIndex(u => u.id === input.id);
      
      if (userIndex === -1) {
        throw new Error('ユーザーが見つかりません');
      }

      data.users[userIndex] = {
        ...data.users[userIndex],
        ...input,
        updatedAt: new Date().toISOString()
      };

      saveData(data);
      return data.users[userIndex];
    } catch (error) {
      console.error('UpdateUser error:', error);
      throw error;
    }
  },

  // フォトグラファー一覧取得
  mockListPhotographers: async (filter = {}) => {
    try {
      const data = getData();
      let photographers = data.users.filter(u => u.user_type === 'photographer');

      // フィルタリング
      if (filter.prefecture) {
        photographers = photographers.filter(p => p.prefecture === filter.prefecture);
      }
      if (filter.genres && filter.genres.length > 0) {
        photographers = photographers.filter(p => 
          p.genres && p.genres.some(g => filter.genres.includes(g))
        );
      }

      // 各フォトグラファーのレビュー数と平均評価を計算
      photographers = photographers.map(p => {
        const reviews = data.reviews.filter(r => r.reviewee_id === p.id);
        const avgRating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;
        
        return {
          ...p,
          reviewCount: reviews.length,
          averageRating: avgRating
        };
      });

      return {
        items: photographers,
        nextToken: null
      };
    } catch (error) {
      console.error('ListPhotographers error:', error);
      throw error;
    }
  },

  // ポートフォリオ作成
  mockCreatePortfolio: async (input) => {
    try {
      const data = getData();
      const newPortfolio = {
        id: generateId(),
        ...input,
        createdAt: new Date().toISOString()
      };

      data.portfolios.push(newPortfolio);
      saveData(data);

      return newPortfolio;
    } catch (error) {
      console.error('CreatePortfolio error:', error);
      throw error;
    }
  },

  // ポートフォリオ一覧取得
  mockListPortfolios: async (photographerId) => {
    try {
      const data = getData();
      const portfolios = data.portfolios.filter(p => p.photographer_id === photographerId);
      
      return {
        items: portfolios,
        nextToken: null
      };
    } catch (error) {
      console.error('ListPortfolios error:', error);
      throw error;
    }
  },

  // ポートフォリオ削除
  mockDeletePortfolio: async (id) => {
    try {
      const data = getData();
      data.portfolios = data.portfolios.filter(p => p.id !== id);
      saveData(data);
      
      return { id };
    } catch (error) {
      console.error('DeletePortfolio error:', error);
      throw error;
    }
  },

  // 会話作成または取得
  mockGetOrCreateConversation: async (bikerId, photographerId) => {
    try {
      const data = getData();
      
      // 既存の会話を検索
      let conversation = data.conversations.find(c => 
        (c.biker_id === bikerId && c.photographer_id === photographerId) ||
        (c.biker_id === photographerId && c.photographer_id === bikerId)
      );

      if (conversation) {
        return conversation;
      }

      // 新しい会話を作成
      const biker = data.users.find(u => u.id === bikerId);
      const photographer = data.users.find(u => u.id === photographerId);

      conversation = {
        id: generateId(),
        biker_id: bikerId,
        photographer_id: photographerId,
        biker_name: biker?.nickname || biker?.email || 'Unknown',
        photographer_name: photographer?.nickname || photographer?.email || 'Unknown',
        last_message: '',
        last_message_at: new Date().toISOString(),
        status: 'active',
        createdAt: new Date().toISOString()
      };

      data.conversations.push(conversation);
      saveData(data);

      return conversation;
    } catch (error) {
      console.error('GetOrCreateConversation error:', error);
      throw error;
    }
  },

  // ユーザーの会話一覧取得
  mockListConversations: async (userId) => {
    try {
      const data = getData();
      const conversations = data.conversations.filter(c => 
        c.biker_id === userId || c.photographer_id === userId
      );

      // 最終メッセージ時刻でソート
      conversations.sort((a, b) => 
        new Date(b.last_message_at) - new Date(a.last_message_at)
      );

      return {
        items: conversations,
        nextToken: null
      };
    } catch (error) {
      console.error('ListConversations error:', error);
      throw error;
    }
  },

  // メッセージ作成
  mockCreateMessage: async (input) => {
    try {
      const data = getData();
      const newMessage = {
        id: generateId(),
        ...input,
        is_read: false,
        createdAt: new Date().toISOString()
      };

      data.messages.push(newMessage);

      // 会話の最終メッセージを更新
      const conversationIndex = data.conversations.findIndex(c => c.id === input.conversationID);
      if (conversationIndex !== -1) {
        data.conversations[conversationIndex].last_message = input.content || '[画像]';
        data.conversations[conversationIndex].last_message_at = newMessage.createdAt;
      }

      saveData(data);
      return newMessage;
    } catch (error) {
      console.error('CreateMessage error:', error);
      throw error;
    }
  },

  // メッセージ一覧取得
  mockListMessages: async (conversationId) => {
    try {
      const data = getData();
      const messages = data.messages.filter(m => m.conversationID === conversationId);
      
      // 作成時刻でソート
      messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      return {
        items: messages,
        nextToken: null
      };
    } catch (error) {
      console.error('ListMessages error:', error);
      throw error;
    }
  },

  // メッセージ既読更新
  mockMarkMessageAsRead: async (messageId) => {
    try {
      const data = getData();
      const messageIndex = data.messages.findIndex(m => m.id === messageId);
      
      if (messageIndex !== -1) {
        data.messages[messageIndex].is_read = true;
        saveData(data);
      }

      return { success: true };
    } catch (error) {
      console.error('MarkMessageAsRead error:', error);
      throw error;
    }
  },

  // レビュー作成
  mockCreateReview: async (input) => {
    try {
      const data = getData();
      const newReview = {
        id: generateId(),
        ...input,
        createdAt: new Date().toISOString()
      };

      data.reviews.push(newReview);
      saveData(data);

      return newReview;
    } catch (error) {
      console.error('CreateReview error:', error);
      throw error;
    }
  },

  // レビュー一覧取得
  mockListReviews: async (revieweeId) => {
    try {
      const data = getData();
      const reviews = data.reviews.filter(r => r.reviewee_id === revieweeId);
      
      // レビュワー情報を追加
      const reviewsWithReviewer = reviews.map(review => {
        const reviewer = data.users.find(u => u.id === review.reviewer_id);
        return {
          ...review,
          reviewer: reviewer ? {
            id: reviewer.id,
            nickname: reviewer.nickname,
            profile_image: reviewer.profile_image
          } : null
        };
      });

      // 作成時刻でソート（新しい順）
      reviewsWithReviewer.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return {
        items: reviewsWithReviewer,
        nextToken: null
      };
    } catch (error) {
      console.error('ListReviews error:', error);
      throw error;
    }
  },

  // 平均評価取得
  mockGetAverageRating: async (userId) => {
    try {
      const data = getData();
      const reviews = data.reviews.filter(r => r.reviewee_id === userId);
      
      if (reviews.length === 0) {
        return {
          averageRating: 0,
          reviewCount: 0
        };
      }

      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      const average = sum / reviews.length;

      return {
        averageRating: Number(average.toFixed(1)),
        reviewCount: reviews.length
      };
    } catch (error) {
      console.error('GetAverageRating error:', error);
      throw error;
    }
  }
};

