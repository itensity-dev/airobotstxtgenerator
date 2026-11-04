---
title: "AIクローラーを.htaccessでブロックする設定例（Apache）"
description: "Apacheのmod_rewriteで、GPTBot、ClaudeBot、CCBot、BytespiderなどのAIクローラーをブロックする.htaccessのルールです。AIボットには403を返し、robots.txtにはアクセスできるままにします。コピーしてそのまま使えます。"
h1: "Apacheの.htaccessでAIボットをブロックする"
nav: "Apache .htaccess"
lead: "`.htaccess`に`mod_rewrite`の3行を書くだけで、User-AgentでAIクローラーを判定して403で拒否し、`/robots.txt`は対象外にできます。メインの設定ファイルを編集できない共用サーバー（レンタルサーバー）でも使えます。"
steps:
  - "ブロックするボットを選び、ルールをコピーします。"
  - "ドキュメントルートの`.htaccess`を開き（なければ作成します）、WordPressやフレームワーク独自のリライトルールより前の、ファイルの先頭近くにブロックを貼り付けます。"
  - "保存します。Apacheはリクエストのたびに`.htaccess`を読み込むので、再起動は不要です。"
  - "`curl -I -A \"ClaudeBot\" https://example.com/`（403になるはず）と`curl -I https://example.com/robots.txt`（200になるはず）でテストします。"
capabilities:
  - feature: "共用サーバー（レンタルサーバー）"
    status: "yes"
    note: "必要なのは`AllowOverride FileInfo`（ほぼすべてのサーバーで有効）と`mod_rewrite`だけです。"
  - feature: ".htaccessではなくサーバー設定に記述"
    status: "yes"
    note: "同じ行は`<VirtualHost>`や`<Directory>`の中でも機能し、そのほうが高速です。"
  - feature: "LiteSpeedとOpenLiteSpeed"
    status: "yes"
    note: "LiteSpeedは`.htaccess`内のApacheのリライトルールを読み込みます。"
  - feature: "nginxのみのホスティング"
    status: "no"
    note: "nginxは`.htaccess`を無視します。[nginxのルール](page:server-nginx)を使ってください。"
faq:
  - q: ".htaccessのどこにブロックを置けばよいですか？"
    a: "ほかのリライトルールより前です。WordPressのブロックは`RewriteRule . /index.php [L]`で終わるため、後ろに置くと先にそちらがリクエストを処理してしまいます。"
  - q: "[F,L]はどういう意味ですか？"
    a: "`F`は403 Forbiddenを返し、`L`はそれ以降のルールの処理を止めます。`[G,L]`にすると、代わりに410 Goneを返します。"
  - q: "mod_rewriteの代わりにSetEnvIfを使えますか？"
    a: "使えます。`SetEnvIfNoCase User-Agent \"GPTBot\" ai_bot`のあとに`<RequireAll> Require all granted Require not env ai_bot </RequireAll>`と書けばmod_rewriteなしで動作しますが、ボットごとに`SetEnvIfNoCase`行が1つずつ必要で、`/robots.txt`の例外も別途設定しなければなりません。"
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## ルールのしくみ

`RewriteCond %{REQUEST_URI} !^/robots\.txt$`でrobots.txtファイルを対象外にします。`RewriteCond %{HTTP_USER_AGENT} (GPTBot|ClaudeBot|…) [NC]`は、User-Agentのどこかに列挙した名前のいずれかが含まれていれば、大文字・小文字を区別せずに一致します。そして`RewriteRule ^ - [F,L]`が、URLを書き換えずにリクエストを拒否します。ルールが適用されるには、すべての条件が真である必要があります。

WordPressでは、キャッシュ系プラグインがPHPの実行前にページを返すことがありますが、それでも`.htaccess`の処理より後なので、キャッシュされたページにもブロックが適用されます。
