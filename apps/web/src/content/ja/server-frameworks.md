---
title: "Express・Next.js・Django・PHPでAIボットをブロック"
description: "Express、Next.js（proxy.ts）、Django、PHP/WordPressで、GPTBot、ClaudeBotなどのAIクローラーをUser-Agentでブロックするミドルウェアです。robots.txtにはアクセスできるままにします。コピーしてそのまま使えます。"
h1: "アプリケーションでAIボットをブロックする"
nav: "フレームワーク"
lead: "Webサーバーの設定を変更できない場合は、アプリケーション側でAIクローラーをブロックします。Express、Next.js、Django、素のPHPやWordPress向けのミドルウェアを、ボット一覧から生成します。"
steps:
  - "フレームワークとブロックするボットを選び、コードをコピーします。"
  - "Express：ルートより前にミドルウェアを登録します。Next.js：プロジェクトのルートに`proxy.ts`として保存します（Next.js 16より前は`middleware.ts`）。Django：クラスを`MIDDLEWARE`に追加します。PHP：`index.php`の一番先頭でファイルを読み込むか、`wp-content/mu-plugins/`に配置します。"
  - "デプロイし、`curl -I -A \"GPTBot\" https://example.com/`でテストします。"
capabilities:
  - feature: "サーバーへのアクセス不要"
    status: "yes"
    note: "コードしか管理できないプラットフォーム（Vercel、Render、PHPの共用サーバー）でも動作します。"
  - feature: "CDNが配信する静的ファイル"
    status: "partly"
    note: "CDNや静的ファイルサーバーが応答するリクエストはミドルウェアに届きません。そちらでもブロックしてください。"
  - feature: "パフォーマンス"
    status: "yes"
    note: "リクエストごとに、コンパイル済みの正規表現を1つ使うだけです。"
faq:
  - q: "ミドルウェアはサーバーのルールと同じくらい効果がありますか？"
    a: "拒否するリクエストは同じですが、タイミングが遅くなります。アプリケーションがすでにリクエストの処理を始めているからです。サーバーやCDNのルールのほうが低コストです。サーバーを変更できない場合には、ミドルウェアが適しています。"
  - q: "Next.jsのproxyは静的アセットに対しても実行されますか？"
    a: "デフォルトではすべてのルートで実行されます。呼び出し回数を節約したい場合は、`_next/static`と画像を除外する`config.matcher`を追加してください。"
related: ["server-rules", "server-nginx", "server-cloudflare", "bots"]
updated: "2026-11-04"
---

## ミドルウェアの判定方法

どのスニペットも、選んだボットのUser-Agent名から大文字・小文字を区別しない正規表現を1つ作り、`/robots.txt`のパスを対象外にして、一致したリクエストには選んだステータスと短いプレーンテキストのメッセージを返します。アプリケーションのそれ以外の部分は何も変わりません。
