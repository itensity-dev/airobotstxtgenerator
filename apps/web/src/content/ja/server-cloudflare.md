---
title: "CloudflareのWAFカスタムルールでAIボットをブロック"
description: "GPTBot、ClaudeBot、BytespiderなどのAIクローラーをUser-Agentでブロックし、robots.txtは対象外にするCloudflare WAFのカスタムルール式です。CloudflareのAI Crawl Controlとの関係も解説します。"
h1: "CloudflareのWAFルールでAIボットをブロックする"
nav: "Cloudflare WAF"
lead: "CloudflareのWAF用のカスタムルール式です。選んだAIクローラーをUser-Agentでブロックし、`/robots.txt`へのアクセスは維持したまま、Cloudflareの4,096文字の制限内に収まります。"
steps:
  - "ブロックするボットを選び、式をコピーします。"
  - "Cloudflareのダッシュボードでドメインを開き、**Security** → **WAF** → **Custom rules** → **Create rule** → **Edit expression**の順に進んで貼り付けます。"
  - "アクションを**Block**（好みに応じて**Managed Challenge**）に設定し、デプロイします。"
  - "1日たったら**Security → Events**を開き、どのボットがブロックされたかを確認します。"
capabilities:
  - feature: "無料プラン"
    status: "yes"
    note: "`contains`と`lower()`を使うカスタムルールはすべてのプランで利用できます。正規表現の`matches`は有料プランが必要なため、このツールでは使いません。"
  - feature: "式の長さのチェック"
    status: "yes"
    note: "Cloudflareでは1つの式が4,096文字までです。超える場合はツールが警告し、ルールの分割を提案します。"
  - feature: "AI Crawl Controlの代わり"
    status: "no"
    note: "Cloudflare独自のAI Crawl Controlは、検証済みのAIクローラーをカテゴリー単位でブロックし、管理されたブロックをrobots.txtに書き込むこともできます。このルールは、Cloudflareがカバーしていないボットに対応したい場合や、厳密に制御したい場合に使ってください。"
faq:
  - q: "CloudflareはすでにAIクローラーをブロックしていますが、このルールは必要ですか？"
    a: "不要な場合もあります。2025年7月以降、新しいドメインではAIクローラーがデフォルトでブロックされ、2026年からはSearch、Agent、Trainingの個別設定も用意されています。Cloudflareのリストが対象とするのは検証済みのボットです。カスタムルールなら、そのリストにないボットも追加でき、検証の有無に関係なく名前でブロックできます。"
  - q: "robots.txtを対象外にするのはなぜですか？"
    a: "クローラーが引き続きサイトの方針を読めるようにするためです。robots.txtを取得できないクローラーは、自分がDisallowされていることを知ることができません。"
  - q: "Cloudflareがrobots.txtに行を追加しました。これは何ですか？"
    a: "Cloudflareの管理型robots.txt（Bot Preference Sync）です。BEGINとENDのコメントで囲まれたブロックがサイト独自のルールの前に置かれ、AIクローラー向けの`Content-Signal`と`Disallow`の行が含まれています。公開中のファイルを[テスター](page:tester)に貼り付けると、結合後のファイルの動作を確認できます。"
related: ["server-rules", "content-signals", "tester", "guide-bad-bots"]
updated: "2026-11-04"
---

## 式について

各条件は`(lower(http.user_agent) contains "gptbot")`の形をしています。User-Agentを小文字に変換してからボットの名前を探すので、大文字・小文字の違いは問題になりません。条件は`or`で結ばれ、全体が`and not (http.request.uri.path eq "/robots.txt")`と組み合わされます。Cloudflareの検証済みボットの機能も使っている場合は、`and not cf.client.bot`を追加すれば、検証済みボットの扱いをCloudflare自身の設定に任せられます。
