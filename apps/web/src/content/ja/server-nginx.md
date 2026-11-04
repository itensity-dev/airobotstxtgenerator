---
title: "nginxでAIクローラーをブロックする設定例（map使用）"
description: "$http_user_agentのmapでGPTBot、ClaudeBot、CCBot、BytespiderなどのAIクローラーをブロックするnginxの設定です。AIボットには403を返し、robots.txtにはアクセスできるままにします。コピーしてそのまま使えます。"
h1: "nginxでAIクローラーをブロックする"
nav: "nginx"
lead: "`http`ブロックで`$http_user_agent`に対する`map`を1回定義してAIクローラーを判定し、各`server`ブロックに書いた2行の`if`で403を返します。`/robots.txt`へのアクセスは維持されます。"
steps:
  - "ブロックするボットを選び、設定をコピーします。"
  - "`map`ブロックを`http {}`コンテキストに置きます。たとえば新しいファイル`/etc/nginx/conf.d/ai-bots.conf`を作成します。このディレクトリは、ほとんどのディストリビューションで自動的に読み込まれます。"
  - "`location = /robots.txt`ブロックと`if ($is_ai_bot)`の行を、AIクローラーを拒否したいすべての`server {}`ブロック内に置きます。"
  - "`nginx -t`で構文をチェックしてから、`systemctl reload nginx`を実行します。"
  - "テスト：`curl -I -A \"Mozilla/5.0 (compatible; GPTBot/1.4)\" https://example.com/`が403を返し、`curl -I https://example.com/robots.txt`は引き続き200を返すことを確認します。"
capabilities:
  - feature: "大文字・小文字を区別しない照合"
    status: "yes"
    note: "各行で、nginxの大文字・小文字を区別しない正規表現である`~*`を使います。"
  - feature: "全サイト共通の1つのリスト"
    status: "yes"
    note: "`map`は`http {}`にあるため、どのserverブロックからでも`$is_ai_bot`を使えます。"
  - feature: "ifの安全な使い方"
    status: "yes"
    note: "`return`を伴う`if`は、nginxが`server`内で安全だと明記している使い方の1つです。"
  - feature: "CDNの背後での動作"
    status: "partly"
    note: "nginxが見るのはCDNが転送するUser-Agentで、通常は元のものです。CDNでブロックされたボットはnginxに届きません。"
faq:
  - q: "長いif条件ではなくmapを使うのはなぜですか？"
    a: "nginxは`map`を必要になったときにリクエストごとに1回だけ評価します。1行に1ボットでリストが読みやすく保たれ、変数を複数のserverブロックやログ出力（`access_log ... if=$is_ai_bot`）で再利用できます。"
  - q: "ブロックせずに、AIボットのリクエストをログに記録できますか？"
    a: "できます。`map`は残し、`if`の代わりに別のログを設定します。たとえば`access_log /var/log/nginx/ai-bots.log combined if=$is_ai_bot;`です。"
  - q: "本物のIPアドレスからのアクセスに限ってボットを許可するには？"
    a: "運営元が公開している範囲を`geo`モジュールに設定してUser-Agentのmapと組み合わせ、ほかのアドレスからそのボットを名乗るリクエストを拒否します。範囲は変わるため、スクリプトで更新してください。"
related: ["server-rules", "server-apache", "server-caddy", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## 各部分の配置場所

nginxはコンテキスト単位で設定を読み込みます。`map`ディレクティブは`http {}`の中でしか使えず、`if`と`location`ディレクティブは`server {}`の中に置きます。複数のサイトを管理している場合は、mapを1回だけ定義し、各サイトに3行を追加します。`location = /robots.txt`は、リクエストを書き換えたりプロキシしたりする可能性のあるほかのlocationより前に置いてください。nginxでは完全一致のlocationが常に優先されます。

nginxがアプリケーションの前段のリバースプロキシである場合、このルールはリクエストがアプリケーションに届く前に止めるので、アプリケーションのリソースの節約にもなります。
