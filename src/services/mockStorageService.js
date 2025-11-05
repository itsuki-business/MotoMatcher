// Mock Storageサービス
// Amazon S3の動作を模倣
// 画像をBase64エンコードしてlocalStorageに保存

const MOCK_STORAGE_KEY = 'mockStorageData';

// ストレージデータ取得
const getStorageData = () => {
  const dataStr = localStorage.getItem(MOCK_STORAGE_KEY);
  if (!dataStr) {
    const initialData = { files: {} };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(dataStr);
};

// ストレージデータ保存
const saveStorageData = (data) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
};

// ファイルをBase64に変換
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ランダムなキー生成
const generateKey = (prefix = 'uploads') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}/${timestamp}_${random}`;
};

export const mockStorageService = {
  // ファイルアップロード
  uploadData: async ({ key, data, options = {} }) => {
    try {
      let base64Data;
      
      if (data instanceof File || data instanceof Blob) {
        base64Data = await fileToBase64(data);
      } else {
        base64Data = data;
      }

      const storageData = getStorageData();
      storageData.files[key] = {
        data: base64Data,
        contentType: options.contentType || data.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString()
      };

      saveStorageData(storageData);

      return {
        key,
        eTag: `mock-etag-${Date.now()}`
      };
    } catch (error) {
      console.error('UploadData error:', error);
      throw error;
    }
  },

  // ファイルダウンロード（URL取得）
  getUrl: async ({ key, options = {} }) => {
    try {
      const storageData = getStorageData();
      const file = storageData.files[key];

      if (!file) {
        throw new Error('ファイルが見つかりません');
      }

      // Base64データをそのまま返す（imgタグのsrcに使用可能）
      return {
        url: {
          href: file.data,
          toString: () => file.data
        }
      };
    } catch (error) {
      console.error('GetUrl error:', error);
      throw error;
    }
  },

  // ファイル削除
  remove: async ({ key }) => {
    try {
      const storageData = getStorageData();
      
      if (!storageData.files[key]) {
        throw new Error('ファイルが見つかりません');
      }

      delete storageData.files[key];
      saveStorageData(storageData);

      return {
        key
      };
    } catch (error) {
      console.error('Remove error:', error);
      throw error;
    }
  },

  // ファイル一覧取得
  list: async ({ prefix = '', options = {} }) => {
    try {
      const storageData = getStorageData();
      const keys = Object.keys(storageData.files).filter(key => 
        key.startsWith(prefix)
      );

      return {
        items: keys.map(key => ({
          key,
          size: storageData.files[key].data.length,
          lastModified: new Date(storageData.files[key].uploadedAt)
        })),
        nextToken: null
      };
    } catch (error) {
      console.error('List error:', error);
      throw error;
    }
  },

  // 画像アップロード用ヘルパー
  uploadImage: async (file, prefix = 'images') => {
    try {
      const key = generateKey(prefix);
      const result = await mockStorageService.uploadData({
        key,
        data: file,
        options: {
          contentType: file.type
        }
      });
      return result.key;
    } catch (error) {
      console.error('UploadImage error:', error);
      throw error;
    }
  },

  // 画像URL取得用ヘルパー
  getImageUrl: async (key) => {
    try {
      if (!key) return null;
      const result = await mockStorageService.getUrl({ key });
      return result.url.href;
    } catch (error) {
      console.error('GetImageUrl error:', error);
      return null;
    }
  }
};

