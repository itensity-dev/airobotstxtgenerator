---
title: "AIクローラー一覧｜User-Agentとrobots.txtでのブロック方法"
description: "{{all}}件のAIクローラー、AIボット、robots.txtトークン（GPTBot、ClaudeBot、PerplexityBot、Google-Extended、Bytespiderなど）の一覧です。運営元、用途、robots.txtへの対応、IPアドレス一覧、出典を掲載しています。"
h1: "AIクローラー一覧"
nav: "ボット一覧"
lead: "ドキュメントで確認できたすべてのAIクローラー、AIボット、robots.txtの制御用トークンを掲載しています。運営元、収集する内容、運営元がrobots.txtに従うと表明しているか、本物かどうかの確認方法を、出典へのリンクと最終確認日つきでまとめました。"
steps:
  - "名前や企業名で検索するか、運営元ごとに一覧を確認します。"
  - "各ボットのページを開くと、User-Agent、robots.txtトークン、IPアドレス一覧、コピーして使えるルールを確認できます。"
  - "用途の列を判断材料にします。学習用クローラーは通常、ブロックしても露出は減りません。AI検索用やユーザー依頼のボットは、引用や訪問者をもたらします。"
  - "[生成ツール](page:home)でファイル全体を作成するか、[テスター](page:tester)で現在のファイルを確認します。"
capabilities:
  - feature: "すべての項目に出典"
    status: "yes"
    note: "厳選した各項目は運営元の公式ドキュメントにリンクしています。ドキュメントがない場合は、その旨を明記しています。"
  - feature: "最終確認日"
    status: "yes"
    note: "ボットごとに、確認方法（ページを直接開いたか、検索インデックス経由で読んだか）とあわせて表示します。"
  - feature: "機械可読なデータ"
    status: "yes"
    note: "一覧全体を[/bots.json](/bots.json)としてCC BY 4.0で公開しています。"
  - feature: "毎週の更新"
    status: "yes"
    note: "毎週の自動ジョブがコミュニティリストをai.robots.txtと比較し、プルリクエストを作成します。厳選した項目は手作業で確認しています。"
  - feature: "リクエストが本物であることの証明"
    status: "partly"
    note: "運営元がIPアドレス範囲、逆引きDNSのホスト名、署名を公開している場合に限ります。User-Agent文字列は誰でも偽装できます。"
faq:
  - q: "どのAIクローラーをブロックすべきですか？"
    a: "目的によります。コンテンツをAIの学習には使わせず、AIの回答には表示されたい場合は、学習用のクローラーとトークン（GPTBot、ClaudeBot、Google-Extended、Applebot-Extended、CCBot、meta-externalagent、Bytespider、MistralAI-Training）をブロックし、検索用のボット（OAI-SearchBot、Claude-SearchBot、PerplexityBot）を許可します。メリットとデメリットは[ガイド](page:guide-training-search)で解説しています。"
  - q: "クローラーとrobots.txtトークンの違いは何ですか？"
    a: "クローラーは独自のUser-Agentでリクエストを送信します。一方、Google-ExtendedやApplebot-Extendedのようなトークンがサイトを訪れることはありません。robots.txtに書く名前で、運営元の通常のクローラーが取得したコンテンツをどう利用してよいかを伝えるものです。トークンはrobots.txtでしか制御できず、サーバー設定では制御できません。"
  - q: "robots.txtを無視するボットがあるのはなぜですか？"
    a: "ユーザーの依頼で動くフェッチャー（ChatGPT-User、Perplexity-User、Google-Agent、meta-externalfetcher）は、運営元がブラウザーと同様に扱っており、robots.txtに従わない場合があります。また、方針をまったく公表していないクローラーもあります。こうしたボットはサーバーやCDNでブロックしてください。"
  - q: "一覧の情報はどのくらい新しいですか？"
    a: "厳選した項目は{{updated}}に運営元のドキュメントと照合しており、各ページにもそれぞれの確認日を表示しています。コミュニティリストは毎週ai.robots.txtと同期しています。"
  - q: "データを利用してもよいですか？"
    a: "はい。一覧は/bots.jsonでJSON形式として、CC BY 4.0のもとで公開しています。airobotstxtgenerator.comのクレジット表記をお願いします。コミュニティ項目はai.robots.txtプロジェクトに由来し、MITライセンスです。"
related: ["home", "tester", "server-rules", "guide-training-search"]
updated: "2026-11-04"
---

## 一覧の作り方

厳選した各項目は、運営元自身のドキュメントを出発点にしています。OpenAI、Anthropic、Google、Apple、Perplexity、Meta、Amazon、Mistral、DuckDuckGo、Microsoft、Common Crawlなどは、自社のクローラーを説明するページを公開しています。これらのページから、robots.txtトークン、ドキュメントに記載されたUser-Agent文字列、用途、robots.txtに関する運営元の表明、公開されているIPアドレス一覧やホスト名、そして確認日を記録しています。運営元が何も公開していない場合（たとえばByteDanceのBytespider）は、第三者による観測に基づく項目であることを明記しています。

**用途**の分類は、運営元やCloudflareが現在使っているカテゴリーに沿っています。「AI学習」「AI検索」（インデックスと引用）「ユーザー依頼による取得」（アシスタントがユーザーのためにページを開く）「robots.txtトークン」の4つです。Googlebot、Bingbot、Applebotのような汎用クローラーも参考として掲載しています。多くのAI機能がこれらに依存しているためです。

メインの表の下にある**コミュニティリスト**は、オープンソースの[ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt)プロジェクトに由来します。範囲は広いものの、個別には検証されていません。なかには運営元自身が否定している名前もあります（Cohereはクローラーを運用していないと説明しており、Braveには独自のUser-Agentがなく、Exaのクローラーの名前はExaSearchBotです）。
