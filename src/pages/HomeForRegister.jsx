import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SearchFilters } from '@/components/home/SearchFilters';
import { PhotographerCard } from '@/components/home/PhotographerCard';
import { mockAPIService } from '@/services/mockAPIService';
import { useMock } from '@/config/environment';
import * as queries from '@/graphql/queries';

export function HomeForRegister() {
  const [photographers, setPhotographers] = useState([]);
  const [filteredPhotographers, setFilteredPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    prefecture: '',
    genre: '',
    keyword: '',
    maxRate: ''
  });

  useEffect(() => {
    loadPhotographers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [photographers, filters]);

  const loadPhotographers = async () => {
    try {
      setLoading(true);
      
      if (useMock) {
        const result = await mockAPIService.mockListPhotographers();
        setPhotographers(result.items);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        const result = await client.graphql({
          query: queries.listPhotographers,
          variables: {
            filter: { user_type: { eq: 'photographer' } }
          }
        });
        setPhotographers(result.data.listUsers.items);
      }
    } catch (error) {
      console.error('Load photographers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...photographers];

    // Prefecture filter
    if (filters.prefecture && filters.prefecture !== 'all') {
      filtered = filtered.filter(p => p.prefecture === filters.prefecture);
    }

    // Genre filter
    if (filters.genre && filters.genre !== 'all') {
      filtered = filtered.filter(p => 
        p.genres && p.genres.includes(filters.genre)
      );
    }

    // Keyword filter
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(p => {
        const nickname = (p.nickname || '').toLowerCase();
        const bio = (p.bio || '').toLowerCase();
        const prefecture = (p.prefecture || '').toLowerCase();
        return nickname.includes(keyword) || 
               bio.includes(keyword) || 
               prefecture.includes(keyword);
      });
    }

    // Rate filter - show only photographers with minimum_rate less than or equal to maxRate
    if (filters.maxRate && filters.maxRate !== 'all') {
      const maxRateNum = parseInt(filters.maxRate);
      filtered = filtered.filter(p => {
        // フォトグラファーに最低料金が設定されている場合のみフィルタリング
        // 料金未設定の場合は表示する（料金を気にしない）
        if (!p.minimum_rate) return true;
        return p.minimum_rate <= maxRateNum;
      });
    }

    setFilteredPhotographers(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              フォトグラファーを探す
            </h1>
            <p className="text-blue-100">
              あなたにぴったりのフォトグラファーを見つけましょう
            </p>
          </motion.div>
        </div>
      </div>

      {/* Advertisement Section */}
      <div className="bg-white border-b py-6">
        <div className="container">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {/* Ad Slot 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex-1 min-w-[250px] max-w-[350px] h-[100px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
            >
              <div className="text-center text-gray-500">
                <p className="text-sm font-medium">広告枠 1</p>
                <p className="text-xs">350x100</p>
              </div>
            </motion.div>

            {/* Ad Slot 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex-1 min-w-[250px] max-w-[350px] h-[100px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
            >
              <div className="text-center text-gray-500">
                <p className="text-sm font-medium">広告枠 2</p>
                <p className="text-xs">350x100</p>
              </div>
            </motion.div>

            {/* Ad Slot 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex-1 min-w-[250px] max-w-[350px] h-[100px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
            >
              <div className="text-center text-gray-500">
                <p className="text-sm font-medium">広告枠 3</p>
                <p className="text-xs">350x100</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <SearchFilters onFilterChange={handleFilterChange} />

        <div className="mt-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-muted-foreground">読み込み中...</p>
            </div>
          ) : filteredPhotographers.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {filteredPhotographers.length}件のフォトグラファーが見つかりました
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotographers.map((photographer, index) => (
                  <PhotographerCard
                    key={photographer.id}
                    photographer={photographer}
                    index={index}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>条件に合うフォトグラファーが見つかりませんでした</p>
              <p className="text-sm mt-2">フィルターを変更してお試しください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

