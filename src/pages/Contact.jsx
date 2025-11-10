import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">お問い合わせ</CardTitle>
              <CardDescription className="text-lg mt-2">
                MotoMatcherに関するご質問やご要望がございましたら、お気軽にお問い合わせください
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* メールアドレス */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center">
                <Mail className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">メールでのお問い合わせ</h3>
                <p className="text-muted-foreground mb-4">
                  以下のメールアドレスまでご連絡ください
                </p>
                <a
                  href="mailto:itsuki.buss@gmail.com"
                  className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Mail className="w-6 h-6" />
                  itsuki.buss@gmail.com
                </a>
              </div>

              {/* お問い合わせについて */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">お問い合わせの際のお願い</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">件名を明確に</h4>
                      <p className="text-muted-foreground text-sm">
                        お問い合わせの内容が分かりやすいように、メールの件名を具体的に記載してください。
                        例：「ログインできない」「プロフィール画像のアップロードについて」など
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">詳細な情報を含める</h4>
                      <p className="text-muted-foreground text-sm">
                        問題が発生している場合は、以下の情報を含めていただけるとスムーズに対応できます：
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground text-sm mt-2 ml-4 space-y-1">
                        <li>ご使用のデバイス（PC、スマートフォンなど）</li>
                        <li>ブラウザの種類（Chrome、Safari、Firefoxなど）</li>
                        <li>発生した日時</li>
                        <li>エラーメッセージ（表示された場合）</li>
                        <li>スクリーンショット（可能であれば）</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">返信までの目安</h4>
                      <p className="text-muted-foreground text-sm">
                        お問い合わせいただいた内容には、通常2〜3営業日以内に返信いたします。
                        お急ぎの場合は、メールにその旨を明記してください。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* よくある質問 */}
              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold mb-4">よくある質問</h3>
                <div className="space-y-4">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="font-semibold">アカウントを削除したい</span>
                      <MessageCircle className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-4 text-muted-foreground text-sm">
                      アカウントの削除をご希望の場合は、上記のメールアドレスまでご連絡ください。
                      登録メールアドレスから「アカウント削除希望」の旨をお送りください。
                    </div>
                  </details>

                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="font-semibold">パスワードを忘れてしまった</span>
                      <MessageCircle className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-4 text-muted-foreground text-sm">
                      ログイン画面からパスワードリセットを行ってください。
                      リセットできない場合は、登録メールアドレスからお問い合わせください。
                    </div>
                  </details>

                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="font-semibold">不適切なユーザーを報告したい</span>
                      <MessageCircle className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-4 text-muted-foreground text-sm">
                      不適切な行為を発見された場合は、速やかに上記のメールアドレスまでご報告ください。
                      該当ユーザーのニックネームや問題の詳細を明記してください。
                    </div>
                  </details>

                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="font-semibold">新機能の提案をしたい</span>
                      <MessageCircle className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-4 text-muted-foreground text-sm">
                      MotoMatcherの改善に向けたご提案を歓迎いたします！
                      機能の詳細や目的を含めてメールでお送りください。
                    </div>
                  </details>
                </div>
              </div>

              
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

