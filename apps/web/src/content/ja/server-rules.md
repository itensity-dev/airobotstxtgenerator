---
title: "AIクローラーをサーバーでブロック｜nginx・Apache・Cloudflare"
description: "User-AgentでAIクローラーに403を返すサーバー設定を作成します。nginx、Apacheの.htaccess、Caddy、Cloudflare WAF、Express、Next.js、Django、PHPに対応し、IPアドレスや逆引きDNSでボットを検証する方法も解説します。"
h1: "AIボットをサーバーでブロックする"
nav: "サーバー設定"
lead: "robots.txtはお願いにすぎませんが、ここで作るルールを使えば、サーバーがUser-AgentでAIクローラーを拒否します。サーバーとブロックするボットを選んでルールをコピーし、本物のボットはIPアドレスや逆引きDNSで検証してください。"
steps:
  - "サーバーまたはフレームワークを選びます：nginx、Apache、Caddy、Cloudflare WAF、Express、Next.js、Django、PHP。"
  - "ブロックするボットを選びます：学習用クローラーのみ、すべてのAIボット、またはボット一覧から自分で選んだもの。"
  - "レスポンスコードを選びます。`403 Forbidden`が最も明確なシグナルです。`404`や`410`を使うと、ブロックしていることを隠せます。"
  - "コメントで指示された場所にルールを貼り付けてサーバーを再読み込みし、`curl -A \"GPTBot\" -I https://your-site/`で確認します。選んだコードが返り、`/robots.txt`には引き続きアクセスできれば成功です。"
capabilities:
  - feature: "robots.txt専用トークンを除外"
    status: "yes"
    note: "Google-Extended、Applebot-Extended、FirecrawlAgent、`__usage_ai-training`はUser-Agentヘッダーに現れないため、効果のないルールを作らないよう除外します。"
  - feature: "検索エンジンやリンクプレビューはブロックしない"
    status: "yes"
    note: "Googlebot、Bingbot、Applebot、facebookexternalhitはプリセットに含めません。無関係なトラフィックをブロックしないよう、コミュニティリストの一般的すぎる名前（Code、Spider、OpenAI …）も除外します。"
  - feature: "/robots.txtへのアクセスを維持"
    status: "yes"
    note: "すべてのルールで`/robots.txt`を対象外にするので、クローラーは引き続きサイトの方針を読めます。"
  - feature: "偽装したボットや名乗らないボットの阻止"
    status: "no"
    note: "User-Agentによる照合で止められるのは、名乗っているボットだけです。ブラウザーのUser-Agentを使うボットには、レート制限、ボット管理、IPアドレスに基づくルールが必要です。"
  - feature: "Cloudflareの式の長さ"
    status: "partly"
    note: "カスタムルールの式は4,096文字までです。選択が長すぎる場合はツールが警告します。"
faq:
  - q: "AIクローラーはrobots.txtとサーバーのどちらでブロックすべきですか？"
    a: "理由がそれぞれ異なるので、両方です。robots.txtは意思を表明するための、文書化された機械可読な方法で、EUのGPAI行動規範（Code of Practice）が参照しているのもrobots.txtです。行儀のよいクローラーはこれに従います。サーバー設定は、robots.txtを無視するクローラーや、ユーザーの代わりにページを取得するクローラーに対して、その意思を強制します。"
  - q: "User-Agentによるブロックは回避できますか？"
    a: "はい、別のUser-Agentを送れば回避できます。そのため運営元はIPアドレス範囲を公開したり、リクエストに署名したりしています。これらを使えば、信頼するボットについて本物のリクエストだけを許可したり、ネットワーク単位でボットをブロックしたりできます。下の表に、公開されているすべてのIPアドレス一覧とホスト名を掲載しています。"
  - q: "403でブロックするとSEOに悪影響がありますか？"
    a: "AI専用のボットだけをブロックするなら影響はありません。Googlebot、Bingbot、Applebotをこの方法でブロックしてはいけません。Google-ExtendedとApplebot-Extendedなら、検索に影響を与えずにAIでの利用を制御できます。"
  - q: "どのレスポンスコードを使うべきですか？"
    a: "`403 Forbidden`は、アクセスを拒否していることを明確に示します。クローラーに有用な情報を何も残さないよう、`404`や`410`を好むサイト運営者もいます。いずれのコードでもコンテンツは配信されません。"
related: ["server-nginx", "server-apache", "server-cloudflare", "bots", "guide-bad-bots"]
updated: "2026-11-04"
---

## ルールの作り方

ルールは、生成ツールと同じ[ボット一覧](page:bots)から作成します。選んだボットごとに、運営元がUser-Agentヘッダーに含まれる文字列として記載している部分（たとえば`GPTBot`や`ClaudeBot`）を取り出し、重複や、より短い名前ですでにカバーされる名前を除いたうえで、サーバー用の大文字・小文字を区別しない照合ルールを書き出します。robots.txt専用のトークンにすぎないボットは、その名前を含むリクエストが存在しないため、注記を付けて除外します。

## 本物のボットか検証する

User-Agent文字列はただのテキストで、「GPTBot」や「Googlebot」を名乗る偽のリクエストはよくあります。運営元は、リクエストが本物であることを証明する方法を3つ用意しています。

- **IPアドレス一覧**：クローラーが使うアドレス範囲を記載したJSONファイルです（OpenAI、Anthropic、Perplexity、Google、Common Crawl、DuckDuckGoなど）。クライアントのIPアドレスを範囲と照合し、一覧は定期的に更新してください。
- **逆引きDNS**：クライアントのIPアドレスからホスト名を調べ、運営元のドメイン（たとえば`googlebot.com`や`applebot.apple.com`）で終わることを確認します。次にそのホスト名を正引きし、同じIPアドレスが返ることを確かめます。
- **署名付きリクエスト（Web Bot Auth）**：リクエストにHTTP Message Signatureが付いており、運営元が公開している鍵で検証できます（Exa、You.com、ChatGPTのエージェント、一部のGoogle-Agentのリクエスト）。

各[ボットのページ](page:bots)には、それぞれの検証方法に対応したNode.jsのコード例を用意しています。
