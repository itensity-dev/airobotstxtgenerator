---
title: "AI学習は拒否、AI検索には表示｜robots.txtの設定方法"
description: "GPTBot、ClaudeBot、Google-Extendedなどの学習用クローラーをブロックしつつ、ChatGPT検索、Claude、Perplexity、GoogleのAI Overviewsには表示させる方法です。ブロックするボットと許可するボットを、検証済みのrobots.txtとともに紹介します。"
h1: "AI学習は拒否し、AI検索には表示させる方法"
nav: "AI学習は拒否、AI検索には表示"
lead: "現在、多くのAI企業は学習用、検索用、ユーザーの依頼用に別々のボットを運用しています。学習用のクローラーとトークンをブロックし、検索用のボットを許可すれば、次のモデルの学習材料にはならずに、AIの回答でページを引用してもらえます。"
related: ["home", "bots", "tester", "server-rules", "content-signals"]
updated: "2026-11-04"
faq:
  - q: "GPTBotをブロックすると、ChatGPTからサイトが消えますか？"
    a: "いいえ。ChatGPTの検索回答はOAI-SearchBotのインデックスに基づいており、GPTBotとは別物です。GPTBotをブロックしてOAI-SearchBotを許可すれば、引き続き引用されます。"
  - q: "Geminiにコンテンツを使わせないために、Googlebotをブロックする必要はありますか？"
    a: "いいえ。むしろブロックすべきではありません。Google検索から消えてしまうからです。Geminiの学習とグラウンディングから外れるには、`Google-Extended`をDisallowします。AI Overviewsは検索の一部なので、Google-Extendedではなく、`nosnippet`などのスニペット用タグで制御します。"
  - q: "学習用クローラーをブロックすると、すでに学習済みのモデルからコンテンツが削除されますか？"
    a: "いいえ。robots.txtのルールが影響するのは今後のクロールだけです。既存のデータについては、削除やオプトアウトの手続きを別途用意している企業もあります。各社のドキュメントを確認してください。"
  - q: "Common Crawlはどうすればよいですか？"
    a: "CCBotのアーカイブは多くのAI開発者に使われているため、学習を拒否するならCCBotのブロックも含めます。ただし、研究目的で使われる今後のCommon Crawlのスナップショットからもページが外れます。"
---

## AIボットの3つの種類

2024年以降、大手AI企業は用途ごとにクローラーを分けています。その大きな理由は、パブリッシャーがまさにこの選択をできるようにするためです。

| 企業 | 学習 | AI検索（インデックスと引用） | ユーザーの依頼（リアルタイム取得） |
|---|---|---|---|
| OpenAI | `GPTBot` | `OAI-SearchBot` | `ChatGPT-User` |
| Anthropic | `ClaudeBot` | `Claude-SearchBot` | `Claude-User` |
| Perplexity | —（クロールしたコンテンツでは学習しないと説明） | `PerplexityBot` | `Perplexity-User` |
| Google | `Google-Extended`（トークン） | Googlebot（検索、AI Overviews） | `Google-Agent`、`Google-GeminiNotebook` |
| Apple | `Applebot-Extended`（トークン） | Applebot | — |
| Meta | `meta-externalagent` | `meta-webindexer` | `meta-externalfetcher` |
| Mistral | `MistralAI-Training` | `MistralAI-Index` | `MistralAI-User` |
| Amazon | `Amazonbot`（ほかの用途にも使用） | `Amzn-SearchBot` | `Amzn-User` |

**学習用**のクローラーとトークンは、ページがモデルの学習データに入るかどうかを左右します。**検索用**のボットは、AI製品がサイトを見つけて引用できるかどうかを左右し、AI経由の流入はここから生まれます。**ユーザー依頼型**のフェッチャーは、ユーザーに頼まれてページを開くもので、複数の運営元が、これらにはrobots.txtが適用されない場合があると説明しています。

## robots.txtの例

[生成ツール](page:home)で1つ目の目的を選ぶと、ドキュメントで確認できたすべてのボットについて、この方針のファイルが作成されます。中心部分は次のとおりです。

```
# AI training crawlers — blocked
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: CCBot
User-agent: meta-externalagent
User-agent: MistralAI-Training
User-agent: Bytespider
Disallow: /

# AI usage controls (robots.txt tokens, not crawlers) — blocked
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: __usage_ai-training
Disallow: /

# Everyone else, including OAI-SearchBot, Claude-SearchBot, PerplexityBot
User-agent: *
Disallow: /admin/
```

検索用のボットは名前で指定していません。専用グループがないので、GoogleやBingと同じく`User-agent: *`に従います。これは意図的なものです。検索用のボットに専用グループを与えると（たとえば`/premium/`を閉じるため）、そのボットは`*`グループをまったく読まなくなるので、`*`のルールをすべてそのグループにも繰り返し書く必要があります。AI専用のパスの例外を追加すると、生成ツールがこれを自動で行います。

## 複数の用途を持つクローラー

1つの名前で複数の用途を兼ねるボットもあります。`Amazonbot`はAmazonの製品改善に使われ、学習に使われる可能性もあります。`meta-externalagent`はモデルの学習とコンテンツのインデックスの両方を行い、`CCBot`のアーカイブは研究にもAIの学習にも使われます。生成ツールはこのプリセットでこれらを学習用クローラーとして扱い、方針を厳しめに保ちます。どのボットがこのグループに該当するかも表示するので、カスタムモードで個別に「許可」へ切り替えられます。

汎用クローラーは事情が異なります。`Googlebot`、`Bingbot`、`Applebot`は検索エンジンにデータを提供し、それを通じてAI OverviewsやCopilotなどのAI機能にも使われます。AI学習を止める目的でこれらをブロックしてはいけません。`Google-Extended`と`Applebot-Extended`を使い、Bingについては`noarchive`/`nocache`タグか、Bingが2027年から対応する`__usage_ai-training`グループを使ってください。

## 結果を確認する

1. ファイルを[テスター](page:tester)に貼り付け、クローラーの一覧表を確認します。学習用のボットが**ブロック**、検索用のボットが**許可**になっていれば正しく設定できています。
2. 重要なURLをいくつか、`OAI-SearchBot`と`PerplexityBot`でテストします。
3. Cloudflareを使っている場合は、AI Crawl Controlの設定も確認します。CDNでのブロックは、robots.txtでの許可より優先されます。
4. robots.txtを無視するボットには、[サーバー設定](page:server-rules)を追加します。
