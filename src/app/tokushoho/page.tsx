import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 - AccessGuard",
  description: "特定商取引法に基づく表記（Disclosure under the Act on Specified Commercial Transactions）",
};

export default function TokushohoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-gray-900">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
            <span className="font-bold text-lg">AccessGuard</span>
          </a>
          <a
            href="/"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          特定商取引法に基づく表記
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Disclosure under the Act on Specified Commercial Transactions
        </p>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  事業者名
                  <br />
                  <span className="text-xs font-normal text-gray-500">Business Name</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  AccessGuard（個人事業）
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  代表者
                  <br />
                  <span className="text-xs font-normal text-gray-500">Representative</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  斎藤 龍生
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  所在地
                  <br />
                  <span className="text-xs font-normal text-gray-500">Address</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  〒180-0006<br />
                  東京都武蔵野市中町2-18-10
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  連絡先
                  <br />
                  <span className="text-xs font-normal text-gray-500">Contact</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  メール: g550139@gmail.com<br />
                  <span className="text-gray-500 text-xs">※お問い合わせはメールにてお願いいたします</span>
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  販売URL
                  <br />
                  <span className="text-xs font-normal text-gray-500">Website</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <a href="https://www.accessguard.dev" className="text-blue-600 hover:underline">
                    https://www.accessguard.dev
                  </a>
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  商品等の名称
                  <br />
                  <span className="text-xs font-normal text-gray-500">Product Name</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  AccessGuard ウェブアクセシビリティスキャンサービス（SaaS）
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  販売価格
                  <br />
                  <span className="text-xs font-normal text-gray-500">Pricing</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Pro プラン: 月額 $49 USD<br />
                  Agency プラン: 月額 $149 USD<br />
                  <span className="text-gray-500 text-xs">※価格はすべて税込です。為替レートにより日本円での請求額は変動する場合があります。</span>
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  商品代金以外の必要料金
                  <br />
                  <span className="text-xs font-normal text-gray-500">Additional Fees</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  なし<br />
                  <span className="text-gray-500 text-xs">※インターネット接続料金はお客様のご負担となります</span>
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  支払方法
                  <br />
                  <span className="text-xs font-normal text-gray-500">Payment Method</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  クレジットカード（Visa, Mastercard, American Express, JCB）<br />
                  <span className="text-gray-500 text-xs">※決済処理はStripe, Inc.を通じて行われます</span>
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  支払時期
                  <br />
                  <span className="text-xs font-normal text-gray-500">Payment Timing</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  サブスクリプション開始時（チェックアウト時）に初回課金。以降、毎月自動更新時に課金されます。
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  サービス提供時期
                  <br />
                  <span className="text-xs font-normal text-gray-500">Service Delivery</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  お支払い完了後、即時ご利用いただけます。
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  キャンセル・解約
                  <br />
                  <span className="text-xs font-normal text-gray-500">Cancellation</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  サブスクリプションはいつでも解約可能です。解約後は現在の請求期間の終了まで引き続きサービスをご利用いただけます。日割り返金は行っておりません。
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  返品・返金
                  <br />
                  <span className="text-xs font-normal text-gray-500">Refund Policy</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  デジタルサービスの性質上、サービス提供開始後の返品はお受けしておりません。サービスに重大な不具合がある場合は、個別にご対応いたしますのでメールにてお問い合わせください。
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  動作環境
                  <br />
                  <span className="text-xs font-normal text-gray-500">System Requirements</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  インターネットに接続可能なウェブブラウザ（Chrome, Firefox, Safari, Edge の最新版を推奨）
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-sm text-center">
          &copy; 2026 AccessGuard. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
