# A11yScope 引き継ぎ書（Handover Document）

**最終更新**: 2026-04-13
**プロジェクトパス**: `C:\Users\g5501\projects\a11yscope\a11yscope`
**GitHub**: `vacationdesign/accessguard`
**本番URL**: https://www.a11yscope.com
**ドメイン管理**: Namecheap（a11yscope.com）
**デプロイ**: Vercel（自動デプロイ: GitHub main ブランチ push）

---

## 1. プロジェクト概要

A11yScope は **Webアクセシビリティ自動スキャン＆コンプライアンスプラットフォーム**。
ユーザーがURLを入力するとWCAG 2.1 AA準拠の自動監査を行い、修正提案を提示する。
SaaSモデル（Free / Pro / Agency）で、有料プランでは週次自動スキャン・サイト監視・PDFレポート機能を提供。

---

## 2. 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Next.js (App Router) | 16.1.6 |
| ランタイム | React | 19.2.3 |
| 言語 | TypeScript | 5 |
| スタイリング | Tailwind CSS | 4 |
| データベース | Supabase (PostgreSQL + RLS) | — |
| 認証 | Supabase Auth (Magic Link) | — |
| 決済 | Stripe (Subscriptions) | SDK 20.3.1, API 2026-01-28.clover |
| メール送信 | Resend | 6.9.2 |
| スキャンエンジン | Puppeteer Core + axe-core | 24.37.5 / 4.11.1 |
| ブラウザバイナリ | @sparticuz/chromium-min | 143.0.4 |
| PDF生成 | jsPDF | 4.2.0 |
| アナリティクス | Vercel Analytics | 1.6.1 |
| デプロイ | Vercel (Serverless) | — |

---

## 3. 環境変数

### 本番環境（Vercel Dashboard で管理）

```
# Base URL
NEXT_PUBLIC_BASE_URL=https://www.a11yscope.com

# Supabase — ブラウザクライアント
NEXT_PUBLIC_SUPABASE_URL=https://hxsiqqyimzeyomesmkeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=（Vercelダッシュボードで確認）

# Supabase — サーバー側管理クライアント（RLSバイパス）
SUPABASE_URL=https://hxsiqqyimzeyomesmkeh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=（Vercelダッシュボードで確認）

# Stripe（本番キー）
STRIPE_SECRET_KEY=sk_live_...（Vercelダッシュボードで確認）
STRIPE_WEBHOOK_SECRET=whsec_...（Vercelダッシュボードで確認）
STRIPE_PRO_PRICE_ID=price_...（Vercelダッシュボードで確認）
STRIPE_AGENCY_PRICE_ID=price_...（Vercelダッシュボードで確認）

# Resend（メール送信）
RESEND_API_KEY=（Vercelダッシュボードで確認）

# Cron認証
CRON_SECRET=（Vercelダッシュボードで確認）

# 管理者メール
ADMIN_EMAIL=g550139@gmail.com
```

### ローカル開発環境
`.env.local` にテストキーを設定（本番キーとは異なる）。`.env.example` をテンプレートとして使用。

---

## 4. 外部サービスアカウント

| サービス | アカウント | 用途 | 管理画面 |
|---------|-----------|------|---------|
| **Vercel** | g550139@gmail.com | デプロイ・環境変数・Cron | https://vercel.com/vacationdesigns-projects/accessguard |
| **Supabase** | g550139@gmail.com | DB・認証・RLS | https://supabase.com/dashboard (hxsiqqyimzeyomesmkeh) |
| **Stripe** | g550139@gmail.com | 決済・サブスク管理 | https://dashboard.stripe.com |
| **Resend** | g550139@gmail.com | トランザクションメール | https://resend.com |
| **Namecheap** | accessguard | ドメイン管理（a11yscope.com） | https://ap.www.namecheap.com |
| **Google Search Console** | g550139@gmail.com | SEO | https://search.google.com/search-console |
| **Vercel Analytics** | （Vercelに統合） | アクセス解析 | Vercelダッシュボード内 |

---

## 5. データベーススキーマ

### 5.1 users テーブル
| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid (PK) | 自動生成 |
| email | text (unique) | ユーザーメールアドレス |
| stripe_customer_id | text (nullable) | Stripe顧客ID |
| plan | text | `free` / `pro` / `agency` |
| auth_id | text (nullable) | Supabase Auth UID |
| brand_name | text (nullable) | Agencyプラン用ホワイトラベルブランド名 |
| created_at | timestamptz | 作成日時 |
| updated_at | timestamptz | 更新日時 |

### 5.2 subscriptions テーブル
| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid (PK) | 自動生成 |
| user_id | uuid (FK → users) | ユーザーID |
| stripe_subscription_id | text (unique) | Stripeサブスク ID |
| status | text | `active` / `trialing` / `past_due` / `canceled` |
| plan | text | `pro` / `agency` |
| current_period_start | timestamptz | 現在の請求期間開始 |
| current_period_end | timestamptz | 現在の請求期間終了 |
| trial_start | timestamptz | トライアル開始 |
| trial_end | timestamptz | トライアル終了 |
| cancel_at | timestamptz | キャンセル予定日 |
| canceled_at | timestamptz | キャンセル実行日 |
| created_at | timestamptz | 作成日時 |
| updated_at | timestamptz | 更新日時 |

### 5.3 sites テーブル（監視対象サイト）
| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid (PK) | 自動生成 |
| user_id | uuid (FK → users) | ユーザーID |
| url | text | 監視対象URL（ユーザーごとにunique） |
| name | text (nullable) | サイト名 |
| last_scan_score | int (nullable) | 最新スキャンスコア (0-100) |
| last_scan_at | timestamptz | 最新スキャン日時 |
| created_at | timestamptz | 作成日時 |
| updated_at | timestamptz | 更新日時 |

### 5.4 scan_logs テーブル
| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid (PK) | 自動生成 |
| user_id | uuid (nullable, FK → users) | ユーザーID（未ログインはnull） |
| ip_address | text | リクエスト元IP |
| url | text | スキャン対象URL |
| score | int (nullable) | アクセシビリティスコア (0-100) |
| violations_count | int | 違反数 |
| scan_duration_ms | int | スキャン所要時間 |
| violations | jsonb | axe-core違反データ（詳細） |
| passes | int | パスしたルール数 |
| incomplete | int | 不完全なルール数 |
| site_id | uuid (nullable, FK → sites) | 紐付くサイトID |
| created_at | timestamptz | 作成日時 |

### テーブル間リレーション
```
users (1) ← (N) subscriptions
users (1) ← (N) sites
users (1) ← (N) scan_logs
sites (1) ← (N) scan_logs
```

### アカウント削除時のカスケード順序
1. Stripe サブスクリプションキャンセル
2. scan_logs 削除（user_id）
3. sites 削除（user_id）
4. subscriptions 削除（user_id）
5. users 削除
6. Supabase Auth ユーザー削除

---

## 6. 料金プラン

| 機能 | Free | Pro ($49/月) | Agency ($149/月) |
|------|------|-------------|-----------------|
| 単発スキャン | 5回/時間 | 無制限 | 無制限 |
| サイト監視登録 | 0 | 3 | 10 |
| 週次フルサイトクロール | × | ○（最大20ページ/サイト） | ○（最大50ページ/サイト） |
| PDFレポート | × | ○ | ○（ホワイトラベル対応） |
| メールアラート | × | ○ | ○ |
| スキャン履歴 | × | ○ | ○ |
| 無料トライアル | — | 7日間 | 7日間 |
| 返金保証 | — | 30日間 | 30日間 |

### 設計方針
本サービスは**AIエージェントだけで完結する無人運営サービス**として設計されている。人的オペレーション（優先サポート、チームコラボレーション等）を前提とした機能は提供しない。全機能がセルフサービスで自動化されている。

---

## 7. API エンドポイント一覧

### 7.1 パブリック（認証不要）

| メソッド | パス | 説明 |
|---------|------|------|
| POST | `/api/scan` | アクセシビリティスキャン実行。Free: 5回/時間（IP制限）、有料: 無制限 |
| POST | `/api/checkout` | Stripe Checkout セッション作成。body: `{ plan, email? }` |
| POST | `/api/webhook` | Stripe Webhook 受信 |

### 7.2 認証必須（ダッシュボード）

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/scan/history` | スキャン履歴取得。`?limit=N` |
| GET | `/api/sites` | 登録サイト一覧取得 |
| POST | `/api/sites` | サイト追加。body: `{ url, name? }` |
| DELETE | `/api/sites` | サイト削除。body: `{ siteId }` |
| POST | `/api/portal` | Stripe Customer Portal セッション作成 |
| POST | `/api/account/delete` | アカウント完全削除（Stripe連携含む） |
| GET | `/api/account/export` | ユーザーデータJSON エクスポート（IP除外） |
| PUT | `/api/account/brand` | ブランド名更新（Agencyプラン専用、最大100文字） |
| POST | `/api/auth/signout` | サインアウト |

### 7.3 認証コールバック

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/auth/callback` | Magic Link コールバック（code交換） |
| GET | `/auth/confirm` | Magic Link 確認（token_hash検証） |

### 7.4 オンデマンドクロール

| メソッド | パス | 説明 |
|---------|------|------|
| POST | `/api/scan/crawl` | フルサイトクロール（Pro/Agency専用）。プラン別ページ上限: Pro=20, Agency=50。maxDuration=300 |

### 7.5 Cron（Vercel Cron）

| メソッド | パス | スケジュール | 説明 |
|---------|------|------------|------|
| GET | `/api/cron/weekly-scan` | 毎週月曜 9:00 UTC | 有料ユーザーの全登録サイトをフルサイトクロール → 週次サマリーメール送信 |

---

## 8. Stripe Webhook イベント処理

| イベント | 処理内容 |
|---------|---------|
| `checkout.session.completed` | ユーザー作成/取得 → サブスク作成 → plan更新 → ウェルカムメール → 管理者通知 |
| `customer.subscription.updated` | サブスク期間・ステータス更新、plan変更時はuser.plan も更新 |
| `customer.subscription.deleted` | サブスクを canceled に → user.plan を free にダウングレード → 管理者通知 |
| `invoice.payment_succeeded` | サブスクの請求期間日付を更新 |
| `invoice.payment_failed` | サブスクステータスを past_due に → 管理者通知 |

**Webhook URL**: `https://www.a11yscope.com/api/webhook`
**冪等性**: `checkout.session.completed` は既存サブスクIDと照合し重複処理を防止

---

## 9. メールシステム

### 送信設定
- **送信元**: `A11yScope <noreply@a11yscope.com>`（Resend ドメイン認証済み）
- **管理者通知先**: `support@a11yscope.com`
- **DNS**: Namecheap BasicDNS で DKIM + SPF + DMARC 設定済み

### 受信設定
- **support@a11yscope.com** → `g550139@gmail.com` に転送（Namecheap Email Forwarding、2026-03-20設定）

### メールテンプレート

| テンプレート | トリガー | 送信先 |
|-------------|---------|--------|
| ウェルカムメール | checkout.session.completed | ユーザー |
| 週次サマリー | Cron（毎週月曜） | ユーザー |
| 管理者通知（新規契約） | checkout.session.completed | 管理者 |
| 管理者通知（解約） | customer.subscription.deleted | 管理者 |
| 管理者通知（決済失敗） | invoice.payment_failed | 管理者 |
| 管理者通知（決済成功） | invoice.payment_succeeded | 管理者 |

---

## 10. 認証フロー

```
1. ユーザーが /login でメールアドレス入力
2. Supabase Auth が Magic Link メール送信
3. ユーザーがリンクをクリック
4. /auth/callback（code方式）または /auth/confirm（token_hash方式）でセッション確立
5. linkAuthToUser() が auth_id と users テーブルを紐付け
   - 既存ユーザー: auth_id を更新
   - 新規ユーザー: free プランで作成
6. /dashboard にリダイレクト
```

### ミドルウェア保護（src/middleware.ts）
- `/dashboard/*` → 要認証（未認証は `/login?next=...` にリダイレクト）
- `/admin/*` → 要認証 + ADMIN_EMAIL 一致
- `/login` → 認証済みなら `/dashboard` にリダイレクト

---

## 11. スキャンエンジン

### 単一ページスキャン（scanUrl）
1. Puppeteer Core + @sparticuz/chromium-min でヘッドレスブラウザ起動
2. 対象URLにナビゲート（30秒タイムアウト）
3. axe-core を注入して WCAG 2.1 AA ルールで監査実行
4. 結果を整形: violations, passes, incomplete, score (0-100)

### フルサイトクロール（crawlAndScan）
1. シードURLからブラウザで同一オリジンのリンクを自動発見（`discoverLinks()`）
2. 発見したページを順次スキャン（`scanPage()` — ブラウザインスタンスを再利用）
3. デッドラインベースで打ち切り（Vercel 300sタイムアウト対策）
4. 集計スコア・全ページ結果を返却
5. 週次Cronでは全サイトの合計時間を280sとし、サイト数で均等配分

### SSRF防御
- プライベートIP（10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16）ブロック
- localhost, IPv6ループバック、link-local ブロック
- AWS/GCPメタデータエンドポイントブロック
- ホスト名を解決してIPを事前検証

### レート制限
- Free: 5回/時間（IP単位）
- Pro/Agency: 無制限
- カウント失敗時は安全側に倒す（Infinity返却 → スキャン拒否）

---

## 12. ページ構成

### パブリック
| パス | 説明 |
|------|------|
| `/` | ランディングページ（ヒーロー, 機能紹介, 料金, FAQ, CTA） |
| `/login` | メール Magic Link ログイン |
| `/blog` | ブログ一覧 |
| `/blog/[slug]` | ブログ記事（Markdownベース, 25+記事） |
| `/faq` | よくある質問 |
| `/privacy` | プライバシーポリシー |
| `/terms` | 利用規約 |
| `/tokushoho` | 特定商取引法に基づく表記 |
| `/checkout/success` | 決済完了ページ |
| `/checkout/cancel` | 決済キャンセルページ |

### ダッシュボード（要認証）
| パス | 説明 |
|------|------|
| `/dashboard` | 概要（統計, 最近のスキャン, トライアルバナー） |
| `/dashboard/scan` | スキャン実行 |
| `/dashboard/sites` | サイト登録・管理 |
| `/dashboard/history` | スキャン履歴一覧 |
| `/dashboard/history/[scanId]` | スキャン詳細（違反一覧, PDFダウンロード） |
| `/dashboard/billing` | プラン管理・Stripe Customer Portal |
| `/dashboard/settings` | アカウント設定・データエクスポート・アカウント削除 |

### 管理者（要ADMIN_EMAIL認証）
| パス | 説明 |
|------|------|
| `/admin` | 管理ダッシュボード（ユーザー数, MRR, スキャン数, 最近のアクティビティ） |
| `/admin/users` | 全ユーザー一覧（スキャン回数付き） |

---

## 13. セキュリティ

### HTTPヘッダー（next.config.ts）
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
  connect-src 'self' https://api.stripe.com https://*.supabase.co;
  frame-src https://js.stripe.com;
```

### CSRF保護
- POST エンドポイントで `Origin` ヘッダーを検証
- 許可オリジン: `a11yscope.com`, `www.a11yscope.com`, `localhost:3000`

### データプライバシー
- Supabase RLS（Row-Level Security）有効
- データエクスポートからIPアドレス除外
- メール送信ログからPII除去
- アカウント削除は完全カスケード（Stripe含む）

---

## 14. Vercel設定

### vercel.json
```json
{
  "functions": {
    "src/app/api/scan/route.ts": { "memory": 1024, "maxDuration": 60 },
    "src/app/api/cron/weekly-scan/route.ts": { "memory": 1024, "maxDuration": 300 },
    "src/app/api/scan/crawl/route.ts": { "memory": 1024, "maxDuration": 300 }
  },
  "crons": [
    { "path": "/api/cron/weekly-scan", "schedule": "0 9 * * 1" }
  ]
}
```

### 特記事項
- スキャンAPI: メモリ1024MB, タイムアウト60秒（Puppeteer用）
- 週次Cron: メモリ1024MB, タイムアウト300秒（複数サイト順次クロール）
- クロールAPI: メモリ1024MB, タイムアウト300秒（オンデマンドフルサイトクロール）

---

## 15. DNS・ドメイン設定（Namecheap BasicDNS）

| レコード種別 | ホスト | 値 | 用途 |
|-------------|--------|-----|------|
| A | @ | 216.198.79.1 | Namecheap パーキング（※Vercelへの切替推奨） |
| CNAME | www | 0063a501ccb7a971.vercel-dns-017.com. | Vercel デプロイ |
| TXT | _dmarc | v=DMARC1; p=none; | DMARC |
| TXT | resend._domainkey | p=MIGfMA0GCSq... | Resend DKIM |
| TXT | send | v=spf1 include:amazonses.com ~all | Resend SPF |

### メール設定
- **Mail Settings**: Email Forwarding（Namecheap）
- **転送ルール**: `support@a11yscope.com` → `g550139@gmail.com`
- **送信**: Resend経由（noreply@a11yscope.com）

---

## 16. ブログシステム

- **格納場所**: `src/content/blog/` （Markdownファイル, 25+記事）
- **パース**: `src/lib/blog.ts`（frontmatter + 本文抽出, 読了時間計算）
- **フロントマター**: title, description, date, author, tags
- **ルーティング**: `/blog/[slug]`（slug = ファイル名 - .md）
- **OG画像**: 動的生成（`opengraph-image.tsx`）
- **パストラバーサル防御**: slugのバリデーション実装済み

---

## 17. PDF レポート（src/lib/pdf-report.ts）

- jsPDF でクライアントサイド生成
- ブランドヘッダー（A11yScope ブルー）
- スコアゲージ（赤/黄/緑のグラデーション）
- 統計ボックス（ルール数, 要素数, 影響度別カウント）
- 違反一覧（影響度バッジ, 説明, 対象要素, 修正提案）
- ページフッター（ページ番号）
- 複数ページ自動対応
- **ホワイトラベル対応**（Agencyプラン）: `generatePdfReport(result, brandName?)` — brandName指定時はヘッダー・フッター・ファイル名の「A11yScope」をカスタムブランド名に置換。ユーザーはダッシュボード設定画面で自分のブランド名を設定可能

---

## 18. コンポーネント一覧

| コンポーネント | ファイル | 説明 |
|---------------|---------|------|
| ScanForm | `src/components/ScanForm.tsx` | URL入力 + スキャン実行フォーム |
| ScanReport | `src/components/ScanReport.tsx` | スキャン結果表示（スコア, 違反, CTA） |
| ScoreGauge | `src/components/ScoreGauge.tsx` | 円形スコア表示 |
| ViolationCard | `src/components/ViolationCard.tsx` | 違反カード（影響度, 修正提案） |
| DashboardShell | `src/components/dashboard/DashboardShell.tsx` | ダッシュボードレイアウト |
| Sidebar | `src/components/dashboard/Sidebar.tsx` | ダッシュボードサイドバー |
| AdminShell | `src/components/admin/AdminShell.tsx` | 管理画面レイアウト |
| AdminSidebar | `src/components/admin/AdminSidebar.tsx` | 管理画面サイドバー |
| CookieBanner | `src/components/CookieBanner.tsx` | Cookie同意バナー（localStorage） |
| LegalFooter | `src/components/LegalFooter.tsx` | 法的ページ共通フッター |
| JsonLd | `src/components/JsonLd.tsx` | 構造化データ（JSON-LD） |
| ProductHuntBadge | `src/components/ProductHuntBadge.tsx` | Product Huntバッジ |
| AccountActions | `src/app/dashboard/settings/AccountActions.tsx` | データエクスポート・アカウント削除 |
| BrandNameForm | `src/app/dashboard/settings/AccountActions.tsx` | Agencyプラン向けブランド名設定フォーム |
| ScanDetailClient | `src/app/dashboard/history/[scanId]/ScanDetailClient.tsx` | スキャン詳細表示（違反一覧, PDFダウンロード, ホワイトラベル対応） |
| CheckoutButton | `src/app/dashboard/billing/CheckoutButton.tsx` | プラン購入ボタン |
| ManageSubscriptionButton | `src/app/dashboard/billing/ManageSubscriptionButton.tsx` | サブスク管理（Stripe Portal） |

---

## 19. ファイル構造

```
src/
├── app/
│   ├── layout.tsx              # ルートレイアウト（Analytics, CookieBanner）
│   ├── page.tsx                # ランディングページ
│   ├── sitemap.ts              # サイトマップ自動生成
│   ├── robots.ts               # robots.txt
│   ├── login/page.tsx          # ログインページ
│   ├── privacy/page.tsx        # プライバシーポリシー
│   ├── terms/page.tsx          # 利用規約
│   ├── tokushoho/page.tsx      # 特定商取引法表記
│   ├── faq/page.tsx            # FAQ
│   ├── blog/
│   │   ├── page.tsx            # ブログ一覧
│   │   └── [slug]/
│   │       ├── page.tsx        # ブログ記事
│   │       └── opengraph-image.tsx
│   ├── checkout/
│   │   ├── success/page.tsx    # 決済完了
│   │   └── cancel/page.tsx     # 決済キャンセル
│   ├── auth/
│   │   ├── callback/route.ts   # Magic Link コールバック
│   │   └── confirm/route.ts    # Magic Link 確認
│   ├── api/
│   │   ├── scan/
│   │   │   ├── route.ts        # スキャンAPI
│   │   │   ├── crawl/route.ts  # フルサイトクロールAPI（Pro/Agency）
│   │   │   └── history/route.ts # スキャン履歴API
│   │   ├── sites/route.ts      # サイト管理API
│   │   ├── checkout/route.ts   # Checkout セッション作成
│   │   ├── webhook/route.ts    # Stripe Webhook
│   │   ├── portal/route.ts     # Stripe Customer Portal
│   │   ├── account/
│   │   │   ├── delete/route.ts # アカウント削除
│   │   │   ├── export/route.ts # データエクスポート
│   │   │   └── brand/route.ts  # ブランド名更新（Agency）
│   │   ├── auth/
│   │   │   └── signout/route.ts # サインアウト
│   │   └── cron/
│   │       └── weekly-scan/route.ts # 週次スキャンCron
│   ├── dashboard/
│   │   ├── layout.tsx          # ダッシュボードレイアウト
│   │   ├── page.tsx            # ダッシュボード概要
│   │   ├── scan/page.tsx       # スキャン実行
│   │   ├── sites/page.tsx      # サイト管理
│   │   ├── history/
│   │   │   ├── page.tsx        # 履歴一覧
│   │   │   └── [scanId]/page.tsx # スキャン詳細
│   │   ├── billing/page.tsx    # プラン管理
│   │   └── settings/
│   │       ├── page.tsx        # 設定
│   │       └── AccountActions.tsx
│   └── admin/
│       ├── layout.tsx          # 管理者レイアウト
│       ├── page.tsx            # 管理ダッシュボード
│       └── users/page.tsx      # ユーザー一覧
├── components/                 # 共通コンポーネント（上記一覧参照）
├── lib/
│   ├── db.ts                   # DB操作（users, subscriptions, sites, scan_logs）
│   ├── auth.ts                 # 認証ヘルパー（getCurrentUser, linkAuthToUser）
│   ├── stripe.ts               # Stripe初期化 + プラン定義
│   ├── email.ts                # Resendメール送信（3テンプレート）
│   ├── scanner.ts              # axe-core スキャンエンジン
│   ├── admin.ts                # 管理者向けクエリ（統計, ユーザー一覧）
│   ├── pdf-report.ts           # PDFレポート生成
│   ├── blog.ts                 # ブログ記事パーサー
│   ├── supabase.ts             # サーバー側Supabaseクライアント（Service Role）
│   ├── supabase-browser.ts     # ブラウザ側Supabaseクライアント
│   └── supabase-server.ts      # SSR用Supabaseクライアント（Cookie管理）
├── content/blog/               # Markdownブログ記事（25+ファイル）
└── middleware.ts               # ルート保護（認証・管理者チェック）

public/
├── .well-known/
│   └── security.txt             # セキュリティ連絡先（support@a11yscope.com, 2027-03-20期限）

# プロジェクトルート
├── package.json
├── tsconfig.json
├── next.config.ts              # セキュリティヘッダー, Puppeteer設定
├── vercel.json                 # Serverless関数設定, Cron定義
├── .env.example                # 環境変数テンプレート
├── .env.local                  # ローカル環境変数（Git管理外）
└── .claude/
    ├── launch.json             # Claude Code 開発サーバー設定
    ├── seo-monitor.md          # SEO監視タスク仕様
    └── seo-reports/            # SEOレポート（2026-03-08〜）
```

---

## 20. 法令対応

### 実装済み
- **プライバシーポリシー** (`/privacy`): GDPR, CCPA, APPI 対応。データ収集項目、第三者プロセッサー（Supabase, Stripe, Resend, Vercel）、保持期間、ユーザー権利を網羅
- **利用規約** (`/terms`): 14条。サービス説明、アカウント、プラン・課金、利用制限、知的財産、保証免責、責任制限、準拠法（東京地裁）
- **特定商取引法表記** (`/tokushoho`): 事業者名、所在地、連絡先、返金ポリシー（30日保証）
- **Cookie同意バナー**: localStorage ベース、分析目的のみ使用と明示
- **利用規約同意**: ランディングページCTA付近、Stripe Checkout 内（consent_collection）、ログインページに表示
- **アカウント削除**: ダッシュボード設定から2段階確認で実行可能
- **データエクスポート**: JSON形式でダウンロード（IP除外）
- **DPA（データ処理契約）**: プライバシーポリシー内セクション10「Data Processing」に記載。処理目的、データカテゴリ、保持期間、サブプロセッサー一覧、DPA要請方法を明記
- **security.txt**: `/.well-known/security.txt` に配置。連絡先: support@a11yscope.com

### Stripe Checkout 設定
- `locale: "auto"` — 海外ユーザーは自動で英語表示
- `consent_collection: { terms_of_service: "required" }` — 利用規約同意必須
- `custom_text` — Terms/Privacy リンク表示

---

## 21. 既知の課題・注意事項

### Stripe Dashboard で手動変更が必要な項目
- **ビジネス名**: Settings > Business settings > Public details で「accessguard」→「A11yScope」に変更
- **商品名**: Products で「AccessGuardpro」→「A11yScope Pro」/「A11yScope Agency」に変更

### Stripe API バージョン
- `2026-01-28.clover` 使用。`current_period_start` / `current_period_end` がTypeScript型から削除されているため、`as any` でアクセスし `toDate()` ヘルパーでnull安全に変換している

### スキャンの制限事項
- axe-core は WCAG 全項目の 30-40% のみ自動検出可能
- SPA（React/Angular）はJSレンダリング後にスキャンするため精度は高いが完全ではない
- Puppeteer のメモリ制限（1024MB）によりページサイズの大きいサイトはスキャン失敗の可能性あり

### ローカル開発
- Windows環境: `npx` コマンドに spawn EINVAL エラーが出る場合あり
- Claude Preview MCP は Windows 非対応（Chrome MCP で代替）
- ローカルではフル Puppeteer、本番では Puppeteer Core + chromium-min を使用

---

## 22. 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# リント
npm run lint
```

---

## 23. 障害対応履歴

### 2026-03-15〜03-20: Webhook署名検証エラー
- **原因**: `STRIPE_WEBHOOK_SECRET` の値が Stripe Dashboard の署名シークレットと不一致
- **影響**: 3/15以降の全Webhookイベントが400エラー。決済は成功したがDB未登録（1名: nate@nateatkinson.com）
- **対応**: Vercel環境変数を正しい `whsec_...` に更新 → デプロイ → 失敗イベント全件再送
- **追加対応**: ユーザーにお詫びメール送信、重複サブスク削除、トライアル14日間リセット
- **再発防止**: Webhook route に `detail` フィールド追加（エラー原因の特定を容易に）、`toDate()` ヘルパー追加（Invalid time value 対策）

---

## 24. 直近の作業再開ポイント

### 実装済み（2026-03-21）
- **管理ダッシュボード: プラン内訳カード** (`src/app/admin/page.tsx`, `src/lib/admin.ts`):
  - `AdminStats` に `planBreakdown: { free, pro, agency, canceling }` を追加
  - 管理画面のOverviewページにPlan Distributionカードを追加（Free/Pro/Agency人数 + キャンセル予定バッジ）
  - キャンセル予定バッジ: `subscriptions.cancel_at IS NOT NULL` AND status が `active`/`trialing` のサブスク数をオレンジバッジで表示
- **決済完了ページのレイアウト修正** (`src/app/checkout/success/page.tsx`):
  - 原因: `flex items-center justify-center` の中にLegalFooterを入れていたため、フッターがメインコンテンツの横に並んでいた
  - 修正: 外側ラッパーを `flex flex-col` に変更し、メインコンテンツを `flex-1 flex items-center justify-center` に変更
- **SEOブログ内部リンク追加**:
  - `ada-website-compliance-guide-small-businesses.md`: Step 4にオーバーレイウィジェット警告 + `/blog/accessibility-overlay-widgets-do-they-work` へのリンクを追加
  - `wcag-2-2-whats-new.md`: Redundant Data Entryセクションに `/blog/wcag-compliance-checklist-ecommerce-websites` へのリンクを追加

### 実装済み（2026-03-20）
- **フルサイトクロール**: 週次Cronで `crawlAndScan()` による複数ページクロール実装。オンデマンドAPI（`/api/scan/crawl`）も追加
- **ホワイトラベルPDF**: Agencyプラン向け。ダッシュボード設定でブランド名をセルフサービスで変更可能。PDF生成時に自動適用
- **ブランド名DB**: `users.brand_name` カラム追加済み（2026-03-20 ALTER TABLE実行）
- **DPA（データ処理契約）**: プライバシーポリシーにセクション追加
- **security.txt**: `public/.well-known/security.txt` 配置
- **プラン内容整理**: 人的オペレーション前提の機能（Priority support, Team collaboration）を全削除。全機能をセルフサービス・自動化に統一
- **Billing/Pricing統一**: Free/Pro/Agencyの機能一覧をサイト全体で統一（page.tsx, billing, FAQ, terms, blog）

### 未対応
1. **Stripe Dashboard のブランド名変更**（手動）: accessguard → A11yScope
2. **日本語版 Privacy Policy / Terms**（低優先: ユーザーベースは主に海外）
3. **CRON_SECRET のVercel環境変数設定確認**: 週次Cronが動作するために必須。未設定の場合は認証エラーで実行不可
4. **ダッシュボードにクロールUI追加**: オンデマンドクロールAPIは実装済みだが、ダッシュボード上のUIは未実装

### 現在のユーザー状況（2026-03-21時点）
| ユーザー | プラン | ステータス | 備考 |
|---------|--------|-----------|------|
| nate@nateatkinson.com | Pro | トライアル中（〜4/3） | 一度キャンセル後に再登録（新トライアル） |
| （不明）2名目 | Pro | トライアル中（〜4/4） | 新規登録 |
| nratkinson2@eiu.edu | Free | — | |
| earmanious@schools.nyc.gov | Free | — | |
| g550139@gmail.com | Free | 管理者 | |

**Stripeサブスク状況 (2026-03-21時点)**:
- Proトライアル 2件（両方 `cancel_at_period_end: false`）
- トライアル終了後に課金されれば MRR = $98/月（$49 × 2）
- `cancel_at` は null のため「canceling」バッジは現在 0 件表示（正常動作）

### ローカル開発時のpreview確認方法（Windows）
- `preview_start` はWindows非対応のため代替手段を使用
- `npx next dev -p 3001` をBashバックグラウンドで起動
- Chrome MCPの `navigate` + `get_page_text` でHTTP 200確認
- コンソールエラーは `read_console_messages` で確認
- 認証必須ページ（`/admin`, `/dashboard`）はローカル確認困難 → 本番デプロイで最終確認

### 将来的な機能拡張
- ダイナミックスキャンスケジュール（週次以外の頻度設定）
- 競合比較レポート機能
