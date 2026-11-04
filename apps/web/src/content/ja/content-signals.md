---
title: "Content-Signal・Content-Usage生成ツール｜AI利用の意思表示"
description: "robots.txtとHTTPヘッダー用に、Content-Signal行（Cloudflare：search、ai-input、ai-train）とContent-Usage行（IETF aiprefドラフト：train-ai、ai-use、search）を作成します。各社の対応状況も正直に記載しています。"
h1: "Content-Signal・Content-Usage生成ツール"
nav: "コンテンツシグナル"
lead: "取得されたコンテンツをどう利用してよいか（検索、AIの回答への入力、学習）を、これまでに提案されている2つの構文で表明します。Cloudflareの`Content-Signal`と、IETF aiprefドラフトの`Content-Usage`です。"
steps:
  - "用途ごとに意向を選びます：`search`、`ai-input`（ページをもとに作られる回答）、`ai-train`。意向を示さない用途は未設定のままにします。"
  - "robots.txt用のブロックをコピーします。Content-Signal行は`User-agent`グループの中（通常は`User-agent: *`）に置きます。"
  - "必要に応じて、IETFドラフトの`Content-Usage`行またはHTTPヘッダーもコピーします。"
  - "これらの行は意向を示すものにすぎません。クローラーを確実に遠ざけたい場合は、`Disallow`ルールでブロックしてください。"
capabilities:
  - feature: "CloudflareのContent Signals構文"
    status: "yes"
    note: "`Content-Signal: search=yes, ai-input=yes, ai-train=no`をグループ内に配置し、Cloudflareが推奨する説明コメントも付けます。"
  - feature: "IETF aipref構文"
    status: "yes"
    note: "draft-ietf-aipref-attachに沿った`Content-Usage: train-ai=n`（任意でパスを指定できるrobots.txtのルール）と、`Content-Usage` HTTPヘッダー。"
  - feature: "効果の保証"
    status: "no"
    note: "どちらの構文も標準ではありません。GoogleはContent-Signalが自社のクローラーに影響しないと表明しており、OpenAI、Anthropic、Perplexityはドキュメントで言及していません。"
faq:
  - q: "Content-Signalとは何ですか？"
    a: "Cloudflareが2025年9月にContent Signals Policyとして公開したrobots.txtの拡張です。`search`、`ai-input`、`ai-train`の3つの用途について、それぞれ`yes`または`no`を指定します。Cloudflareは、数百万のドメインの管理型robots.txtに`search=yes, ai-train=no`を追加しています。"
  - q: "Content-Usageとは何ですか？"
    a: "IETFのAI Preferencesワーキンググループ（aipref）が策定している構文です。`train-ai`、`ai-use`、`search`のカテゴリーからなる語彙に`y`または`n`を指定し、robots.txtのルールまたはHTTPヘッダーで付与します。ドラフトはまだ策定中で、RFCにはなっていません。"
  - q: "両方使うべきですか？"
    a: "両者は競合せず、どちらもまだ広くは尊重されていません。Cloudflareを使っていれば、管理型robots.txtにすでにContent-Signalが入っています。Content-Usageの追加は1行で済み、標準になる可能性が最も高い路線に沿っています。"
  - q: "`__usage_ai-training`とは何ですか？"
    a: "2026年10月に提案された別の仕組みです。robots.txtのグループ（`User-agent: __usage_ai-training`と`Disallow: /`）で、複数のAI企業が学習拒否として扱うと表明しています。Content-Signalと違い、通常のAllowとDisallowのルールを使います。詳しくは[ボット一覧の項目](bot:usage-ai-training)をご覧ください。"
related: ["home", "tdmrep", "meta-tags", "guide-eu-ai-act", "bots"]
updated: "2026-11-04"
---

## robots.txtにおけるAI向け意思表示の3世代

1. **クローラー名**（2023年〜）：`GPTBot`、`ClaudeBot`、`Google-Extended`…と、1社ずつブロックします。robots.txtに従うボットには確実に効きますが、すべての名前を把握しておく必要があります。
2. **用途ベースのシグナル**（2025年〜）：`Content-Signal`と`Content-Usage`は、クローラーではなく用途を記述します。グループに付与し、いずれにせよ取得されるコンテンツ（たとえば汎用の検索クローラーによるもの）をどう扱ってよいかを示します。
3. **共通のオプトアウトグループ**（2026年〜）：`__usage_ai-training`はクローラーと同じように指定しますが、複数の企業が同時に解釈します。

いずれかが標準になるまでは、3つすべてを使うのが最も安全です。把握しているクローラーにはベンダー名を、対応している企業には共通グループを、それ以外には用途ベースの行を使います。[生成ツール](page:home)は最初の2つに対応しており、このページで3つ目を追加できます。
