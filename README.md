# A11yScope

Web アクセシビリティ自動監査 SaaS。URL を登録し、Puppeteer + axe-core で WCAG 2.1 AA 観点のスキャンを実行し、履歴、PDF レポート、週次自動スキャン、Stripe サブスクリプションを提供する。

**本番 URL**: https://www.a11yscope.com  
**最終確認**: 2026-04-13

## 現在の役割

- 単発アクセシビリティスキャン
- サイトクロールと複数ページ監査
- スキャン履歴管理
- PDF レポート生成
- Supabase Magic Link 認証
- Stripe Checkout / Customer Portal / Webhook
- Pro / Agency プラン管理
- Vercel Cron による週次スキャン
- Agency 向けブランド設定、データエクスポート、アカウント削除

## 技術スタック

| 項目 | 内容 |
|---|---|
| Framework | Next.js 16.1.6 App Router |
| Runtime | React 19.2.3 / TypeScript 5 |
| DB / Auth | Supabase SSR 0.8 / supabase-js 2.97 |
| Scanner | puppeteer-core 24, @sparticuz/chromium-min 143, axe-core 4.11 |
| Billing | Stripe 20.3 |
| PDF | jsPDF 4.2 |
| Email | Resend 6.9 |
| Hosting | Vercel |

## 主要ディレクトリ

```text
src/app/api/scan/          # スキャン実行、履歴、クロール
src/app/api/sites/         # 登録サイト管理
src/app/api/checkout/      # Stripe Checkout
src/app/api/portal/        # Stripe Customer Portal
src/app/api/webhook/       # Stripe Webhook
src/app/api/cron/          # 週次自動スキャン
src/app/api/account/       # 削除、エクスポート、ブランド設定
src/content/blog/          # SEO / アクセシビリティ記事
src/lib/                   # Supabase, Stripe, scan helpers
```

## 開発コマンド

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Vercel 設定

`vercel.json` でスキャン系 Serverless Function のメモリと実行時間を拡張している。

| Path | Memory | Max Duration |
|---|---:|---:|
| `src/app/api/scan/route.ts` | 1024 MB | 60 s |
| `src/app/api/scan/crawl/route.ts` | 1024 MB | 300 s |
| `src/app/api/cron/weekly-scan/route.ts` | 1024 MB | 300 s |

Cron は `/api/cron/weekly-scan` を毎週月曜 09:00 UTC に実行する。

## 関連ドキュメント

- `SYSTEM-SPEC.md` — システム仕様
- `HANDOVER.md` — 運用引き継ぎ
- `.claude/seo-monitor.md` — SEO 監視運用メモ

## 注意点

- Chromium バイナリと Vercel Function サイズ、タイムアウトに注意する。
- Supabase service role、Stripe secret、Webhook secret はサーバー側でのみ使用する。
- 既存の未コミット SEO 記事と監視ログがあるため、文書更新時も差分を分離して確認する。
