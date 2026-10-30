# 依存監査と公開デモへの影響

確認日：2026年10月30日（日本時間）。対象はmainの`8efe331fb16c8e83c38a016d2be0f07b6dafa436`です。

Viteを7.1.7から7.3.7へ更新し、開発依存を含む`npm audit`の検出を0件にしました。アプリのソースと架空データは変更していません。

## 監査の再現

Node.js 24.22.1、npm 11.9.0で、変更前のlockfileを使って`npm ci`と`npm audit --json`を実行しました。lockfileが変わっていないことも確認しました。

| 条件 | moderate | high | 合計 |
| --- | ---: | ---: | ---: |
| PR #1の記録 | 1 | 1 | 2 |
| 今回の変更前・全依存 | 0 | 1 | 1 |
| 今回の変更前・本番依存のみ | 0 | 0 | 0 |
| 今回の変更後・全依存（テスト用Playwrightを含む） | 0 | 0 | 0 |

今回のhigh 1件は、直接の開発依存であるViteの集計です。内訳は11件のアドバイザリで、個別の重大度にはmoderateも含まれます。パッケージ数とアドバイザリ数は異なります。
PR #1には当時の監査JSONがなく、当時のmoderate対象パッケージは特定できません。今回の結果との差の原因も確定していません。以前の2件を同じ内訳で再現したとは扱いません。

生の結果は[変更前](security/audit-before.json)、[本番依存のみ](security/audit-production-before.json)、[変更後](security/audit-after.json)に保存しています。いずれも監査実行時の情報です。

## Vite 7.1.7で報告された内容

重大度と影響バージョンはnpm auditの値です。たとえばGHSA-v2wj-q39q-566rはnpmではhighですが、Vite公式のアドバイザリではmoderateと記載されています。

| アドバイザリ | npmの重大度 | 内容 | 影響範囲 |
| --- | --- | --- | --- |
| [GHSA-93m4-6634-74q7](https://github.com/advisories/GHSA-93m4-6634-74q7) | moderate | vite allows server.fs.deny bypass via backslash on Windows | `>=7.1.0 <=7.1.10` |
| [GHSA-4w7w-66w2-5vf9](https://github.com/advisories/GHSA-4w7w-66w2-5vf9) | moderate | Vite Vulnerable to Path Traversal in Optimized Deps `.map` Handling | `>=7.0.0 <=7.3.1` |
| [GHSA-v2wj-q39q-566r](https://github.com/advisories/GHSA-v2wj-q39q-566r) | high | Vite: `server.fs.deny` bypassed with queries | `>=7.1.0 <=7.3.1` |
| [GHSA-p9ff-h696-f583](https://github.com/advisories/GHSA-p9ff-h696-f583) | high | Vite Vulnerable to Arbitrary File Read via Vite Dev Server WebSocket | `>=7.0.0 <=7.3.1` |
| [GHSA-v6wh-96g9-6wx3](https://github.com/advisories/GHSA-v6wh-96g9-6wx3) | moderate | launch-editor: NTLMv2 hash disclosure via UNC path handling on Windows | `>=7.0.0 <=7.3.4` |
| [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv) | moderate | launch-editor: escapeCmdArgs() omits % escaping on Windows | `>=7.0.0 <=7.3.6` |
| [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw) | moderate | launch-editor: Editor CLI flag misinterpretation causing arbitrary command execution for some editors | `>=7.0.0 <=7.3.6` |
| [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm) | high | launch-editor: `fs.existsSync()` existence check can be bypassed on Windows | `>=7.0.0 <=7.3.6` |
| [GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw) | low | Vite: Cross origin script execution through Vite custom middleware | `>=7.0.0 <=7.3.6` |
| [GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22) | moderate | Vite: Files outside `server.fs.allow` could be served when project paths match system paths on non-Windows machine | `>=7.0.0 <=7.3.6` |
| [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) | moderate | vite: `server.fs.deny` bypass on Windows alternate paths | `>=7.0.0 <=7.3.4` |

## 悪用可能性の評価

Vite公式の[WebSocket経由の任意ファイル読み取り](https://github.com/vitejs/vite/security/advisories/GHSA-p9ff-h696-f583)は、開発サーバーに接続でき、WebSocketが有効であることが条件です。[クエリによるdeny回避](https://github.com/vitejs/vite/security/advisories/GHSA-v2wj-q39q-566r)と[最適化依存の.map読み取り](https://github.com/vitejs/vite/security/advisories/GHSA-4w7w-66w2-5vf9)も開発サーバーのファイル配信処理に関係します。
Windowsのパス処理やlaunch-editorに関する警告には、ファイル漏えい、認証ハッシュ漏えい、コマンド実行につながるものがあります。個々の成立条件をWindows実機で再現した検証は行っていません。

| 実行形態 | このリポジトリで確認した条件 | 評価 |
| --- | --- | --- |
| distの静的配信 | Reactクライアントのみ。SSR・外部API接続なし。Viteの開発サーバーは配布物に不要 | 上記の開発サーバー経由の攻撃経路は存在しない |
| npm run dev | 127.0.0.1にバインド。host/CORS/fs制限を緩和する設定なし | 通常の外部ネットワークから直接到達する条件を満たさない。ただしトンネルやプロキシ、起動オプションで公開すれば評価が変わる |
| CI | npm ciとビルドが中心。今回のテスト用previewも127.0.0.1限定 | 開発サーバーを外部公開する構成ではない |
| 実際の公開ホスト | repoのhomepageなし、GitHub Pagesは無効。外部ホストのURL・設定は未確認 | 実環境がdist配信かどうか、第三者による過去の悪用の有無は判断できない |

架空データであっても、開発端末にある別ファイルまで安全になるわけではありません。更新前のVite開発サーバーを外部公開していた場合は、その環境の露出範囲を別途確認する必要があります。今回の作業では公開サービスの再開・デプロイを行っていません。

## 更新と互換性

Viteは同じメジャー内の更新です。`npm audit fix --force`や依存関係の強制上書きは使っていません。Viteの要求に伴いesbuildも0.25.12から0.28.2へ更新されています。esbuildは0.xのminor変更を含むため、互換性をバージョン番号だけで保証せず、型検査と本番ビルドで確認しました。React・React DOM・Tailwind CSSのバージョンとアプリの実装は維持しています。
ViteのNode要件は`^20.19.0 || >=22.12.0`で、CIと今回のNode 24は範囲内です。

Playwrightを開発依存に追加し、`npm run test:smoke`でビルド済みデモを検査します。CIはmoderate以上の監査警告で失敗し、ビルド後にブラウザ操作を検査します。テスト用サーバーはlocalhost限定、ブラウザからの外部通信は遮断して検出します。全画面・全状態の網羅テストではありません。

## 残る限界

監査0件は既知の依存脆弱性の検出結果であり、安全性全体の保証ではありません。Safari・実機タッチ・スクリーンリーダー・Windows固有の攻撃再現・実ホスティング環境は未検証です。運用版紹介画像にあるクイズ・実地図・スワイプは公開デモに未収録であり、今回のテスト対象にも含めていません。
