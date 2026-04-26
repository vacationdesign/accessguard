# A11yScope — SYSTEM-SPEC

> 最終更新: 2026-04-13

## 概要

Web アクセシビリティ自動監査 SaaS。WCAG 2.1 AA 準拠チェックを自動実行し、PDF レポート生成、週次自動スキャン、Stripe 定期課金を提供する。

**本番 URL**: https://www.a11yscope.com

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | Next.js 16.1.6 |
| UI | React 19.2.3 + Tailwind CSS 4 |
| DB / 認証 | Supabase (supabase-js 2.97, SSR 0.8) |
| 決済 | Stripe 20.3 |
| スキャンエンジン | Puppeteer Core 24 + @sparticuz/chromium-min 143 + axe-core 4.11 |
| PDF 生成 | jsPDF 4.2 |
| ID 生成 | uuid 13 |
| メール | Resend 6.9 |
| アナリティクス | @vercel/analytics |
| Lint | ESLint (eslint-config-next) |
| 言語 | TypeScript 5 |

## ファイル構成

```
a11yscope/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── scan/           # スキャン実行・履歴・クロール
│   │   │   ├── sites/          # サイト登録
│   │   │   ├── checkout/       # Stripe Checkout
│   │   │   ├── portal/         # Stripe Customer Portal
│   │   │   ├── webhook/        # Stripe Webhook
│   │   │   ├── cron/           # 週次自動スキャン
│   │   │   ├── account/        # アカウント削除・エクスポート・ブランド設定
│   │   │   └── auth/
│   │   │       └── signout/    # サインアウト
│   │   ├── auth/
│   │   │   ├── callback/       # Supabase 認証コールバック
│   │   │   └── confirm/        # メール確認
│   │   └── (pages)/            # ダッシュボード等
│   ├── lib/                    # Supabase / Stripe ユーティリティ
│   └── components/
└── public/
```

## DB / データ

**Supabase PostgreSQL テーブル:**

| テーブル | 概要 |
|----------|------|
| `users` | ユーザー情報 |
| `subscriptions` | Stripe サブスクリプション連携 |
| `sites` | 登録サイト |
| `scan_logs` | スキャン結果ログ |

## API / 機能

| エンドポイント | メソッド | 機能 |
|---------------|----------|------|
| `/api/scan` | POST | WCAG 2.1 AA 監査実行 |
| `/api/scan/history` | GET | スキャン履歴取得 |
| `/api/scan/crawl` | POST | サイトクロール |
| `/api/sites` | POST | サイト登録 |
| `/api/checkout` | POST | Stripe Checkout セッション作成 |
| `/api/portal` | GET | Stripe Customer Portal |
| `/api/webhook` | POST | Stripe Webhook 処理 |
| `/api/cron/weekly-scan` | POST | 週次自動スキャン（Cron） |
| `/api/account/delete` | DELETE | アカウント削除 |
| `/api/account/export` | POST | データエクスポート |
| `/api/account/brand` | PUT | ブランド設定（Agency） |
| `/api/auth/signout` | POST | サインアウト |
| `/auth/callback` | GET | Supabase 認証コールバック |
| `/auth/confirm` | GET | メール確認 |

**料金プラン:**

| プラン | 制限 | 機能 |
|--------|------|------|
| Free | 5回/時 | 基本スキャン |
| Pro | 無制限 | 週次自動スキャン |
| Agency | 無制限 | ブランドカスタム PDF |

## 外部連携

| サービス | 用途 |
|----------|------|
| Supabase | DB + Magic Link 認証 |
| Stripe | 定期課金 (Pro / Agency) |
| Resend | メール通知 |
| Vercel | ホスティング + Cron |

## 環境変数

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `NEXT_PUBLIC_BASE_URL` | Yes | サイト公開 URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase プロジェクト URL（クライアント） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase 匿名キー（クライアント） |
| `SUPABASE_URL` | Yes | Supabase プロジェクト URL（サーバー） |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase サービスロールキー |
| `STRIPE_SECRET_KEY` | Yes | Stripe シークレットキー |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe Webhook シークレット |
| `STRIPE_PRO_PRICE_ID` | Yes | Pro プラン Price ID |
| `STRIPE_AGENCY_PRICE_ID` | Yes | Agency プラン Price ID |
| `RESEND_API_KEY` | Yes | Resend API キー |
| `CRON_SECRET` | Yes | Cron エンドポイント認証 |
| `ADMIN_EMAIL` | Yes | 管理者メールアドレス |

## デプロイ

- **プラットフォーム**: Vercel
- **URL**: https://www.a11yscope.com
- **ビルド**: `npm run build`
- **Cron**: Vercel Cron Jobs で週次スキャン実行

## 既知の制約

- **Vercel 60秒タイムアウト**: 大規模サイトのスキャンは分割が必要
- **Chromium バイナリ**: @sparticuz/chromium-min が Vercel Serverless 環境で動作（サイズ制限に注意）
- **Free プラン制限**: 5回/時（レートリミット）
- **axe-core**: JavaScript レンダリング後のDOMを検査するため、SSR のみのページでは結果が異なる場合あり
