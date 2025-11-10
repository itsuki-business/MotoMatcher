import { motion } from 'framer-motion';
import { UserPlus, Camera, Search, MessageCircle, Star, Image, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function HowToUse() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">使い方ガイド</CardTitle>
              <CardDescription className="text-lg mt-2">
                MotoMatcherの基本的な使い方をご紹介します
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* ユーザー向けガイド */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-600">
                  バイクオーナー向けガイド
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <UserPlus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">1. アカウント登録</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        まずは無料でアカウントを作成しましょう。メールアドレスとパスワードを入力するだけで簡単に登録できます。
                        初回登録時にはプロフィール設定画面が表示されますので、ニックネーム、都道府県、お持ちのバイクメーカー・モデルなどを入力してください。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Search className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">2. フォトグラファーを探す</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        ホーム画面では、登録しているフォトグラファーを一覧で確認できます。
                        都道府県、得意ジャンル、キーワードで検索して、あなたにぴったりのフォトグラファーを見つけましょう。
                        各フォトグラファーのカードには、プロフィール画像、得意ジャンル、評価などが表示されます。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">3. メッセージを送る</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        気になるフォトグラファーが見つかったら、詳細ページから「メッセージを送る」ボタンをクリックして連絡を取りましょう。
                        撮影希望日、撮影場所、希望する撮影スタイルなどを伝えて、詳細を相談してください。
                        料金や納期についても事前に確認しておくとスムーズです。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">4. レビューを投稿する</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        撮影が完了したら、ぜひレビューを投稿してください。
                        5段階評価とコメントで、フォトグラファーの対応や撮影の質を評価することができます。
                        あなたのレビューは、他のユーザーがフォトグラファーを選ぶ際の参考になります。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-6 text-green-600">
                  フォトグラファー向けガイド
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <UserPlus className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">1. フォトグラファーとして登録</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        アカウント作成時に「フォトグラファー」を選択してください。
                        プロフィール設定では、ニックネーム、都道府県、得意な撮影ジャンル、自己紹介などを入力しましょう。
                        魅力的なプロフィールは、バイクオーナーからの問い合わせ増加につながります。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Image className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">2. ポートフォリオを登録</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        メニューから「ポートフォリオ」を選択して、あなたの作品を登録しましょう。
                        バイク撮影の実績や得意なスタイルが伝わる写真を複数枚アップロードすることをおすすめします。
                        各作品にはタイトルや説明を添えることができます。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <LinkIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">3. 外部ポートフォリオをリンク</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Instagram、Twitter、個人サイトなど、外部のポートフォリオをお持ちの場合は、プロフィールページとポートフォリオページでURLを設定できます。
                        複数のSNSやサイトのURLを追加して、より多くの作品を見てもらいましょう。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">4. メッセージに対応する</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        バイクオーナーからメッセージが届いたら、できるだけ早く返信しましょう。
                        撮影の詳細、料金、日程などを丁寧に説明して、信頼関係を築くことが大切です。
                        プロフェッショナルな対応が、良いレビューにつながります。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Camera className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">5. プロフィールを充実させる</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        定期的にポートフォリオを更新し、最新の作品を追加しましょう。
                        自己紹介文では、あなたの撮影に対する想いやこだわり、経験などを具体的に記載すると、バイクオーナーに選ばれやすくなります。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">💡 MotoMatcherをもっと活用するコツ</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>プロフィール画像は、顔がはっきり見える明るい写真を使用しましょう</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>メッセージのやり取りは丁寧かつ迅速に。レスポンスの速さは信頼につながります</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>フォトグラファーは定期的にポートフォリオを更新して、最新の作品をアピールしましょう</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>撮影後はお互いにレビューを投稿して、コミュニティを盛り上げましょう</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>困ったことがあれば、お問い合わせページからお気軽にご連絡ください</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

