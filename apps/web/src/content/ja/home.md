---
title: "AI向けrobots.txt生成ツール｜GPTBot・ClaudeBotをブロック"
description: "無料のAI向けrobots.txt生成ツールです。GPTBot、ClaudeBot、Google-Extended、CCBotによるAI学習は拒否してAI検索には表示する設定や、AIをすべて拒否する設定を作成でき、生成したファイルはRFC 9309に基づいて検証します。"
h1: "AI向けrobots.txt生成ツール"
nav: "robots.txt生成ツール"
lead: "サイトの種類と目的を選ぶだけで、ドキュメントで確認できた{{all}}件のAIクローラーとトークンに対応したrobots.txtを作成します。各行の意味を解説し、コピーする前にRFC 9309準拠のパーサーで結果を検証します。"
steps:
  - "**サイトの種類**を選びます。種類に応じて、最初に設定するパスが決まります（ECサイトなら`/cart/`と`/checkout/`をすべてのクローラーに対して閉じ、ニュースサイトなら`/premium/`をAIボットに対して閉じます）。"
  - "**目的**を選びます。「AI学習は拒否、AI検索には表示」「AIをすべて拒否」「すべて許可」「ボットごとに選択」の4つから選べます。"
  - "**パスの例外**を追加します。たとえば`/blog/`をすべてのAIボットに開放したり、`/members/`をすべてのAIボットに対して閉じたりできます。"
  - "ファイルをコピーまたはダウンロードし、`robots.txt`として各ホストのルートにアップロードします（`https://example.com/robots.txt`）。すでにファイルがある場合は**既存のrobots.txtに追加**を使ってください。AI用のセクションを追記したうえで、既存のルールの動作が変わらないことを確認します。"
  - "公開したファイルを[robots.txtテスター](page:tester)で確認し、robots.txtを無視するクローラーには[サーバー設定](page:server-rules)を追加します。"
capabilities:
  - feature: "AIクローラーの一覧"
    status: "yes"
    note: "{{all}}件のボットとトークンを、運営元の公式ドキュメントと最終確認日つきで収録しています。希望すれば、ai.robots.txtのコミュニティリストからさらに{{community}}件を追加できます。"
  - feature: "用途別のプリセット"
    status: "yes"
    note: "AI学習、AI検索、ユーザー依頼による取得、robots.txt専用トークンを区別して扱います。"
  - feature: "セルフチェック"
    status: "yes"
    note: "Googleのオープンソースパーサーと同じルールで各ファイルを解析し、すべてのボットについて`/`、例外パス、拒否したパスをテストします。"
  - feature: "既存ファイルへの統合"
    status: "yes"
    note: "AI用のセクションを追記して差分を表示し、ファイルにすでに記載されているボットごとに新旧の判定を比較します。"
  - feature: "Content-Signal行"
    status: "partly"
    note: "`*`グループに任意で`Content-Signal`を追加できます。Cloudflareの提案であり、標準ではありません。"
  - feature: "robots.txtを無視するボットの阻止"
    status: "no"
    note: "robots.txtはお願いにすぎません。強制するには[サーバー設定](page:server-rules)またはWAFを使ってください。"
  - feature: "登録、アップロード、入力内容のトラッキング"
    status: "no"
    note: "生成はブラウザー内で行われ、オフラインでも動作します。入力したパスやファイルはどこにも送信されません。"
faq:
  - q: "AI学習は拒否しつつ、ChatGPT・Claude・Perplexityの検索には表示されるようにするには？"
    a: "学習用のクローラーとトークン（`GPTBot`、`ClaudeBot`、`Google-Extended`、`Applebot-Extended`、`CCBot`、`meta-externalagent`など）をブロックし、検索用のボット（`OAI-SearchBot`、`Claude-SearchBot`、`PerplexityBot`）は許可したままにします。生成ツールの1つ目の目的がこの設定です。詳しくはガイド「[AI学習は拒否、AI検索には表示](page:guide-training-search)」をご覧ください。"
  - q: "Google-Extendedをブロックすると、Google検索やAI Overviewsからサイトが消えますか？"
    a: "いいえ。`Google-Extended`はクローラーではなくrobots.txtのトークンで、コンテンツをGeminiの学習やグラウンディングに使ってよいかを制御します。Google検索（AI OverviewsやAIモードを含む）が使うのは`Googlebot`です。"
  - q: "生成されたファイルで、同じルールが繰り返されるのはなぜですか？"
    a: "専用のグループで名前を指定されたクローラーは、`User-agent: *`グループを完全に無視します。AIボットに専用グループが必要な場合（たとえば`/premium/`をAIボットに対して閉じる場合）、生成ツールは`*`のルールをそのグループにもコピーし、ルールが抜け落ちないようにします。"
  - q: "すべてのAI企業がこのファイルに従いますか？"
    a: "大手の運営元の多くは、自社のクローラーがrobots.txtに従うと表明しています。ただし、ユーザーの依頼で動くフェッチャー（`ChatGPT-User`、`Perplexity-User`、`Google-Agent`）は従わない場合があり、何も表明していないクローラーもあります。ボット一覧では、各運営元の表明を出典へのリンクつきで掲載しています。"
  - q: "robots.txtはどこに置けばよいですか？"
    a: "対象にしたいすべてのホストとプロトコルのルートに置きます。`https://example.com/robots.txt`は`https://shop.example.com/`には適用されません。ファイルはUTF-8のプレーンテキストにし、Googleの場合は500 KiB未満に収める必要があります。"
  - q: "入力した内容は保存されますか？"
    a: "いいえ。生成ツールはすべてブラウザー内で動作します。当サイトが記録するのは、ファイルが生成されたことと使用されたプリセットだけで、パスやテキストは記録しません。"
related: ["tester", "bots", "server-rules", "guide-training-search", "llms-txt"]
updated: "2026-11-04"
---

## 生成ツールの判定のしくみ

ボット一覧のすべてのボットには、運営元のドキュメントに基づく**用途**が設定されています。

- **AI学習**：モデルの学習に使われる可能性のあるページを収集します（`GPTBot`、`ClaudeBot`、`CCBot`、`MistralAI-Training`）。
- **robots.txtトークン**：クローラーではなく、汎用クローラーが取得したコンテンツの利用方法を制御する名前です（`Google-Extended`、`Applebot-Extended`、`__usage_ai-training`）。
- **AI検索**：AI製品がページを引用・リンクできるように、ページをインデックスします（`OAI-SearchBot`、`Claude-SearchBot`、`PerplexityBot`）。
- **ユーザー依頼による取得**：ユーザーがアシスタントに頼んだときにページを開きます（`ChatGPT-User`、`Claude-User`、`Perplexity-User`）。
- **汎用クローラー**：`Googlebot`、`Bingbot`、`Applebot`やリンクプレビュー用のフェッチャーは、どのプリセットでもブロックしません。ブロックすると通常の検索結果から消えたり、リンクプレビューが表示されなくなったりするためです。

どの用途を拒否するかは、選んだ目的によって決まります。生成ツールは用途ごとに1つのグループを書き出すのでファイルが読みやすく保たれ、パスの例外は各グループに追加されます。

## 表示する前にファイルを検証する理由

robots.txtには、多くの人が意外に感じるルールがいくつかあります。**最も長く一致するルールが優先**され、**長さが同じならAllowが優先**され、**専用グループを持つクローラーは`User-agent: *`を無視**し、**空行ではグループが区切られません**。生成ツールはファイルを組み立てた後、Googleのオープンソースパーサーと同じアルゴリズムで解析し（Google自身のテストケースと実在する46件のrobots.txtで検証済み）、すべてのボットと関係するすべてのパスについて、選んだ方針どおりの判定になるかを確認します。ファイルの下のスタンプには、実施したチェックの数が表示されます。

## robots.txtにできないこと

robots.txtは[RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html)で定められた、公開の「お願い」です。行儀のよいクローラーは従いますが、従わないクローラーもあり、User-Agentは誰でも偽装できます。確実に拒否するにはサーバーやCDNでブロックし（[サーバー設定](page:server-rules)ページでは、同じボット一覧からnginx、Apache、Caddy、Cloudflareのルールを作成できます）、IPアドレスや逆引きDNSでボットを検証してください。
