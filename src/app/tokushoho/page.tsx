import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Disclosure - A11yScope",
  description: "Legal disclosure under the Act on Specified Commercial Transactions (特定商取引法に基づく表記)",
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
            <span className="font-bold text-lg">A11yScope</span>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Legal Disclosure
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Disclosure under the Act on Specified Commercial Transactions (特定商取引法に基づく表記)
        </p>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  Business Name
                  <br />
                  <span className="text-xs font-normal text-gray-500">事業者名</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  A11yScope (Sole Proprietorship)
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  Representative
                  <br />
                  <span className="text-xs font-normal text-gray-500">代表者</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Ryusei Saito
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  Address
                  <br />
                  <span className="text-xs font-normal text-gray-500">所在地</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Musashino City, Tokyo, Japan<br />
                  <span className="text-gray-500 text-xs">Full address will be disclosed upon request.</span>
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  Contact
                  <br />
                  <span className="text-xs font-normal text-gray-500">連絡先</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Email: support@a11yscope.com
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  Website
                  <br />
                  <span className="text-xs font-normal text-gray-500">販売URL</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <a href="https://www.a11yscope.com" className="text-blue-600 hover:underline">
                    https://www.a11yscope.com
                  </a>
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  Product / Service
                  <br />
                  <span className="text-xs font-normal text-gray-500">商品等の名称</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  A11yScope Web Accessibility Scanning Service (SaaS)
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  Pricing
                  <br />
                  <span className="text-xs font-normal text-gray-500">販売価格</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Pro Plan: $49 USD / month<br />
                  Agency Plan: $149 USD / month<br />
                  <span className="text-gray-500 text-xs">All prices are tax-inclusive.</span>
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  Additional Fees
                  <br />
                  <span className="text-xs font-normal text-gray-500">商品代金以外の必要料金</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  None.<br />
                  <span className="text-gray-500 text-xs">Internet connection costs are borne by the customer.</span>
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  Payment Method
                  <br />
                  <span className="text-xs font-normal text-gray-500">支払方法</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Credit card (Visa, Mastercard, American Express, JCB)<br />
                  <span className="text-gray-500 text-xs">Payment processing is handled by Stripe, Inc.</span>
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  Payment Timing
                  <br />
                  <span className="text-xs font-normal text-gray-500">支払時期</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  First charge at checkout when the subscription begins. Subsequent charges are billed automatically on each monthly renewal date.
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  Service Delivery
                  <br />
                  <span className="text-xs font-normal text-gray-500">サービス提供時期</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Available immediately after payment is completed.
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  Cancellation
                  <br />
                  <span className="text-xs font-normal text-gray-500">キャンセル・解約</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  You may cancel your subscription at any time. After cancellation, you will retain access to the service until the end of the current billing period. No prorated refunds are provided.
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  Refund Policy
                  <br />
                  <span className="text-xs font-normal text-gray-500">返品・返金</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Due to the nature of digital services, refunds are not available once the service has been provided. If you experience a critical issue, please contact us by email and we will address it on a case-by-case basis.
                </td>
              </tr>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 w-1/3 align-top">
                  System Requirements
                  <br />
                  <span className="text-xs font-normal text-gray-500">動作環境</span>
                </th>
                <td className="px-6 py-4 text-sm text-gray-700">
                  A modern web browser with internet access (latest versions of Chrome, Firefox, Safari, or Edge recommended).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-sm text-center">
          &copy; 2026 A11yScope. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
