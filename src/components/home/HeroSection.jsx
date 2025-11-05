import { motion } from 'framer-motion';
import { Camera, Users, Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection({ onLoginClick, onRegisterClick, isAuthenticated }) {
  const features = [
    {
      icon: Camera,
      title: 'プロのフォトグラファー',
      description: 'バイク撮影に特化したプロフェッショナルを探せます'
    },
    {
      icon: Users,
      title: '簡単マッチング',
      description: '条件に合ったフォトグラファーをすぐに見つけられます'
    },
    {
      icon: Star,
      title: 'レビュー・評価',
      description: '実際の利用者の評価を参考にできます'
    },
    {
      icon: MessageCircle,
      title: 'メッセージ機能',
      description: '直接やり取りして撮影の詳細を決められます'
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container relative z-10 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            バイク × フォトグラファー
            <br />
            <span className="text-blue-200">マッチングプラットフォーム</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100">
            愛車との思い出を、プロの技術で最高の一枚に
          </p>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6"
                onClick={onRegisterClick}
              >
                無料で始める
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-white/10 border-white text-white hover:bg-white/20"
                onClick={onLoginClick}
              >
                ログイン
              </Button>
            </div>
          )}
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-blue-100">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

