import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Terms() {
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
              <CardTitle className="text-3xl">利用規約</CardTitle>
            </CardHeader>

            <CardContent className="prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">第1条（適用）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  本規約は、BikeMatch（以下「当サービス」といいます）の利用に関する条件を、
                  当サービスを利用するすべてのユーザー（以下「ユーザー」といいます）と
                  当サービス運営者との間で定めるものです。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">第2条（利用登録）</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  当サービスの利用を希望する方は、本規約に同意の上、
                  運営者の定める方法によって利用登録を申請し、
                  運営者がこれを承認することによって、利用登録が完了するものとします。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  運営者は、利用登録の申請者に以下の事由があると判断した場合、
                  利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-2">
                  <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                  <li>本規約に違反したことがある者からの申請である場合</li>
                  <li>その他、運営者が利用登録を相当でないと判断した場合</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">第3条（禁止事項）</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>法令または公序良俗に違反する行為</li>
                  <li>犯罪行為に関連する行為</li>
                  <li>当サービスの内容等、当サービスに含まれる著作権、商標権その他の知的財産権を侵害する行為</li>
                  <li>運営者、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                  <li>当サービスによって得られた情報を商業的に利用する行為</li>
                  <li>当サービスの運営を妨害するおそれのある行為</li>
                  <li>不正アクセスをし、またはこれを試みる行為</li>
                  <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                  <li>不正な目的を持って当サービスを利用する行為</li>
                  <li>当サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
                  <li>他のユーザーに成りすます行為</li>
                  <li>当サービスが許諾しない当サービス上での宣伝、広告、勧誘、または営業行為</li>
                  <li>その他、運営者が不適切と判断する行為</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">第4条（当サービスの提供の停止等）</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  運営者は、以下のいずれかの事由があると判断した場合、
                  ユーザーに事前に通知することなく当サービスの全部または一部の提供を停止または中断することができるものとします。
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>当サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                  <li>地震、落雷、火災、停電または天災などの不可抗力により、当サービスの提供が困難となった場合</li>
                  <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                  <li>その他、運営者が当サービスの提供が困難と判断した場合</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">第5条（利用制限および登録抹消）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  運営者は、ユーザーが以下のいずれかに該当する場合には、
                  事前の通知なく、ユーザーに対して、当サービスの全部もしくは一部の利用を制限し、
                  またはユーザーとしての登録を抹消することができるものとします。
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-2">
                  <li>本規約のいずれかの条項に違反した場合</li>
                  <li>登録事項に虚偽の事実があることが判明した場合</li>
                  <li>料金等の支払債務の不履行があった場合</li>
                  <li>運営者からの連絡に対し、一定期間返答がない場合</li>
                  <li>当サービスについて、最終の利用から一定期間利用がない場合</li>
                  <li>その他、運営者が当サービスの利用を適当でないと判断した場合</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">第6条（免責事項）</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  運営者は、当サービスに関して、ユーザーと他のユーザー、組織等との間において生じた取引、
                  連絡または紛争等について一切責任を負いません。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  当サービスに関して、ユーザーと第三者との間で問題が生じた場合、
                  ユーザーは自己の責任と費用においてこれを解決するものとし、
                  運営者はこれに一切関与しません。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">第7条（サービス内容の変更等）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  運営者は、ユーザーに通知することなく、当サービスの内容を変更しまたは
                  当サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">第8条（利用規約の変更）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  運営者は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
                  変更後の本規約は、当サービス上に掲示された時点から効力を生じるものとします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">第9条（個人情報の取扱い）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  運営者は、当サービスの利用によって取得する個人情報については、
                  運営者の定めるプライバシーポリシーに従い適切に取り扱うものとします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">第10条（準拠法・裁判管轄）</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  本規約の解釈にあたっては、日本法を準拠法とします。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  当サービスに関して紛争が生じた場合には、運営者の本店所在地を管轄する裁判所を専属的合意管轄とします。
                </p>
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

