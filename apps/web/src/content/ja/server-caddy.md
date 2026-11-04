---
title: "CaddyでAIクローラーをブロックする設定例（Caddyfile）"
description: "User-Agentヘッダーに対する名前付きマッチャーで、GPTBot、ClaudeBotなどのAIクローラーをブロックするCaddyfileのルールです。AIボットには403を返し、robots.txtにはアクセスできるままにします。"
h1: "CaddyでAIクローラーをブロックする"
nav: "Caddy"
lead: "`header_regexp User-Agent`を使った名前付きマッチャーでAIクローラーを選び出し、`/robots.txt`を除外したうえで、`respond`がほかのどのハンドラーよりも先に応答します。"
steps:
  - "ブロックするボットを選び、スニペットをコピーします。"
  - "Caddyfileのサイトブロック内の、`reverse_proxy`、`php_fastcgi`、`file_server`より前に貼り付けます。"
  - "`caddy validate --config /etc/caddy/Caddyfile`を実行してから、`caddy reload --config /etc/caddy/Caddyfile`を実行します。"
  - "`curl -I -A \"GPTBot\" https://example.com/`でテストします。"
capabilities:
  - feature: "大文字・小文字を区別しない正規表現"
    status: "yes"
    note: "パターンの先頭にある`(?i)`で、大文字・小文字を区別しない照合になります。"
  - feature: "ディレクティブの順序"
    status: "yes"
    note: "Caddyはディレクティブを自動で並べ替えます。`respond`は`reverse_proxy`や`file_server`より先に実行されます。"
  - feature: "JSON形式の設定"
    status: "partly"
    note: "スニペットはCaddyfile用です。`caddy adapt`でJSONに変換できます。"
faq:
  - q: "マッチャーを複数のサイトで使い回せますか？"
    a: "できます。スニペット（`(ai_bots) { … }`）にまとめ、各サイトブロックで`import ai_bots`します。"
  - q: "ブロックしたリクエストをログに記録するには？"
    a: "Caddyはレスポンスのステータスを含めてすべてのリクエストを記録します。アクセスログを、ステータス403と該当するUser-Agentで絞り込んでください。"
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## スニペットの動作

`@ai_bots`は名前付きマッチャーです。リクエストが一致するのは、内部の条件がすべて真の場合、つまりUser-Agentヘッダーが式に一致し、かつパスが`/robots.txt`ではない場合だけです。`respond @ai_bots 403`は、それらのリクエストを空の403レスポンスですぐに終了させます。それ以外のリクエストは、通常のハンドラーへ進みます。
