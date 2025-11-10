import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">プライバシーポリシー</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                最終更新日：2025年1月1日
              </p>
            </CardHeader>

            <CardContent className="prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. はじめに</h2>
                <p className="text-muted-foreground leading-relaxed">
                  MotoMatcher（以下「当サービス」といいます）は、ユーザーの皆様の個人情報を適切に保護することを重要な責務と考えています。
                  本プライバシーポリシーは、当サービスがどのように個人情報を収集、使用、保護するかについて説明するものです。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. 収集する情報</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  当サービスは、以下の情報を収集する場合があります：
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">2.1 ユーザー提供情報</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>アカウント登録時の情報（メールアドレス、氏名、ニックネーム）</li>
                      <li>プロフィール情報（都道府県、バイク情報、撮影ジャンル、自己紹介）</li>
                      <li>プロフィール画像およびポートフォリオ画像</li>
                      <li>メッセージの内容</li>
                      <li>レビューおよび評価</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">2.2 自動収集情報</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>IPアドレス</li>
                      <li>ブラウザの種類とバージョン</li>
                      <li>デバイス情報</li>
                      <li>アクセス日時</li>
                      <li>利用状況に関する情報</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. 情報の利用目的</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  収集した情報は、以下の目的で利用します：
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>当サービスの提供、維持、改善</li>
                  <li>ユーザー認証およびアカウント管理</li>
                  <li>ユーザー間のマッチングおよびコミュニケーションの促進</li>
                  <li>お問い合わせへの対応</li>
                  <li>利用規約違反行為への対応</li>
                  <li>サービスに関する重要なお知らせの送信</li>
                  <li>統計データの作成および分析</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. 情報の共有</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  当サービスは、以下の場合を除き、ユーザーの個人情報を第三者と共有することはありません：
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>ユーザーの同意がある場合</li>
                  <li>法令に基づく場合</li>
                  <li>人の生命、身体または財産の保護のために必要がある場合</li>
                  <li>サービス提供に必要な範囲で業務委託先に開示する場合</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. 公開情報</h2>
                <p className="text-muted-foreground leading-relaxed">
                  以下の情報は、当サービス内で他のユーザーに公開されます：
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>ニックネーム</li>
                  <li>プロフィール画像</li>
                  <li>都道府県</li>
                  <li>ユーザータイプ（ライダー/フォトグラファー）</li>
                  <li>自己紹介</li>
                  <li>ポートフォリオ（フォトグラファーのみ）</li>
                  <li>レビューおよび評価</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. 情報の保護</h2>
                <p className="text-muted-foreground leading-relaxed">
                  当サービスは、ユーザーの個人情報を適切に保護するため、以下の対策を講じています：
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>SSL/TLS暗号化通信の使用</li>
                  <li>AWS Cognitoによる認証管理</li>
                  <li>アクセス制御およびログ管理</li>
                  <li>定期的なセキュリティ監査</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Cookie（クッキー）の使用</h2>
                <p className="text-muted-foreground leading-relaxed">
                  当サービスは、ユーザー体験の向上およびサービスの分析のため、Cookieを使用する場合があります。
                  ユーザーは、ブラウザの設定によりCookieの使用を拒否することができますが、
                  その場合、一部の機能が利用できない可能性があります。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. ユーザーの権利</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ユーザーは、自身の個人情報について、以下の権利を有します：
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>アクセス権：自身の個人情報を確認する権利</li>
                  <li>訂正権：不正確な個人情報を訂正する権利</li>
                  <li>削除権：個人情報の削除を要求する権利</li>
                  <li>利用停止権：個人情報の利用停止を要求する権利</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  これらの権利を行使する場合は、お問い合わせフォームよりご連絡ください。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. 未成年者の個人情報</h2>
                <p className="text-muted-foreground leading-relaxed">
                  当サービスは、18歳未満の方のご利用を想定しておりません。
                  18歳未満の方が当サービスを利用する場合は、保護者の同意が必要です。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. プライバシーポリシーの変更</h2>
                <p className="text-muted-foreground leading-relaxed">
                  当サービスは、法令の変更や事業内容の変更等により、本プライバシーポリシーを変更することがあります。
                  変更後のプライバシーポリシーは、当サービス上に掲載した時点から効力を生じるものとします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">11. お問い合わせ</h2>
                <p className="text-muted-foreground leading-relaxed">
                  本プライバシーポリシーに関するお問い合わせは、以下までご連絡ください：
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="font-semibold mb-2">MotoMatcher 運営事務局</p>
                  <p className="text-muted-foreground">
                    メールアドレス: <a href="mailto:itsuki.buss@gmail.com" className="text-blue-600 hover:underline">itsuki.buss@gmail.com</a>
                  </p>
                </div>
              </section>

              <div className="text-right text-muted-foreground mt-12">
                <p>以上</p>
                <p className="mt-2">制定日：2025年1月1日</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

