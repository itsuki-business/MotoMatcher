import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/home/HeroSection';
import { PhotographerCard } from '@/components/home/PhotographerCard';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { ResetPasswordModal } from '@/components/auth/ResetPasswordModal';
import { mockAPIService } from '@/services/mockAPIService';
import { useMock } from '@/config/environment';
import * as queries from '@/graphql/queries';

export function HomeForNonRegister() {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);

  useEffect(() => {
    loadPhotographers();
  }, []);

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

  const handleLoginSuccess = () => {
    window.location.href = '/home-for-register';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        onLoginClick={() => setLoginModalOpen(true)}
        onRegisterClick={() => setRegisterModalOpen(true)}
        isAuthenticated={false}
      />

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

      <div className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">人気のフォトグラファー</h2>
            <p className="text-muted-foreground">
              バイク撮影のプロフェッショナルをご紹介
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-muted-foreground">読み込み中...</p>
            </div>
          ) : photographers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photographers.slice(0, 6).map((photographer, index) => (
                <PhotographerCard
                  key={photographer.id}
                  photographer={photographer}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>フォトグラファーが見つかりませんでした</p>
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              すべてのフォトグラファーを見るには登録が必要です
            </p>
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="text-blue-600 hover:underline font-semibold"
            >
              今すぐ無料で登録 →
            </button>
          </div>
        </motion.div>
      </div>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onForgotPassword={() => setResetPasswordModalOpen(true)}
      />

      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />

      <ResetPasswordModal
        isOpen={resetPasswordModalOpen}
        onClose={() => setResetPasswordModalOpen(false)}
      />
    </div>
  );
}

