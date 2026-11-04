---
title: "noaiメタタグとX-Robots-Tag｜AIに本当に効く設定は？"
description: "ページのAI利用を制御するメタタグとHTTPヘッダーはどれか。noaiとnoimageaiは非標準で、nosnippet、data-nosnippet、noarchive、X-Robots-Tagの効果は企業ごとに異なります。対応状況を正直にまとめた一覧表です。"
h1: "AI向けメタタグとX-Robots-Tag：本当に効く設定"
nav: "AI向けメタタグ"
lead: "AIを制御するページ単位の仕組みは、つぎはぎの状態です。1社だけが尊重するタグ、小規模なプラットフォームだけが尊重するタグ、どこも尊重しないタグがあります。このページでは、各タグが現在どう機能するかを出典つきでまとめています。"
steps:
  - "そもそもページ単位の制御が必要かを判断します。ほとんどの場合、robots.txtのパス単位のルールで足ります。"
  - "表を見て、重視する企業が実際に尊重しているタグを選びます。"
  - "HTMLでは`<meta name=\"robots\" content=\"…\">`として追加し、PDF、画像などのファイルには`X-Robots-Tag` HTTPヘッダーとして追加します。"
  - "ページのソースとレスポンスヘッダーを見て確認します。[テスター](page:tester)がチェックするのはrobots.txtで、メタタグはチェックしません。"
capabilities:
  - feature: "タグごとの正直な対応状況"
    status: "yes"
    note: "各行に、そのタグへの対応をドキュメントで明記している企業を記載しています。"
  - feature: "どこでも通じる「AI禁止」タグ"
    status: "no"
    note: "存在しません。`noai`は広く使われていますが、Google、OpenAI、Anthropic、Microsoft、Appleはいずれもドキュメントに記載していません。"
faq:
  - q: "`<meta name=\"robots\" content=\"noai\">`は効果がありますか？"
    a: "採用しているプラットフォーム（一部のアート系コミュニティなど）でのみ有効です。どの標準にも含まれておらず、大手AI企業もドキュメントに記載していません。害はありませんが、robots.txtの代わりにはなりません。"
  - q: "GoogleのAI Overviewsにページを表示させないには？"
    a: "Google検索のAI機能は、通常のスニペット制御に従います。`nosnippet`（スニペットを一切表示しない）、`max-snippet:0`、特定の要素への`data-nosnippet`で、表示される内容を制限できます。robots.txtのGoogle-ExtendedはAI Overviewsに影響しません。"
  - q: "Copilotによるページの利用を制限するには？"
    a: "Bingのドキュメントによると、`nocache`を指定するとCopilotはURL、タイトル、スニペットだけを表示し、`noarchive`を指定するとページがCopilotの回答と学習から除外されます。Bingは2027年に向けて、AI学習とグラウンディングに関する新しい設定も発表しています。"
  - q: "X-Robots-Tagを使うと何ができますか？"
    a: "robotsメタタグと同じディレクティブを、HTTPヘッダーとして送れます。PDFや画像のようにHTMLのheadを持たないファイルを制御する唯一の方法です。例：`X-Robots-Tag: noarchive, nosnippet`。"
related: ["content-signals", "tdmrep", "home", "guide-training-search"]
updated: "2026-11-04"
---

## タグとヘッダーの一覧

| タグまたはヘッダー | 効果 | 対応をドキュメントで明記している企業 |
|---|---|---|
| `noai`、`noimageai` | 意図：「AIに使用しない」／「画像をAIに使用しない」 | Google、OpenAI、Anthropic、Microsoft、Appleはドキュメントに記載なし。一部のプラットフォームが採用。非標準。 |
| `nosnippet` | 検索結果にテキストのスニペットやプレビューを表示しない。AI OverviewsとAIモードでも、スニペットの情報源から除外される | Google、Bing |
| `max-snippet:N` | スニペットの長さを制限。`0`は`nosnippet`と同じ | Google、Bing |
| `data-nosnippet`（HTML属性） | ページの一部を、Google検索のスニペットとAI機能から除外する | Google |
| `noarchive` | キャッシュを残さない。Bing：Copilotの回答と学習から除外。Amazon：モデルの学習に使用しない | Bing、Amazon |
| `nocache` | Bing：CopilotはURL、タイトル、スニペットのみ使用できる | Bing |
| `noindex` | ページを検索から完全に削除する。そのため、そのインデックスに基づくAI検索機能からも外れる | 主要な検索エンジンすべて |
| `X-Robots-Tag: …` | 上記のいずれかをHTTPヘッダーで指定。あらゆるファイル形式に対応 | Google、Bing |
| `tdm-reservation: 1` | テキスト・データマイニングの権利を留保（EU）。[TDMRep](page:tdmrep)を参照 | TDMRepの採用者 |
| `Content-Usage: train-ai=n` | IETF aiprefドラフトの意向をHTTPヘッダーで示す。[コンテンツシグナル](page:content-signals)を参照 | ドラフト段階。対応は確立していない |

検索には表示しつつ、Copilotの回答と学習からは除外したいページの例：

```html
<meta name="robots" content="noarchive">
<meta name="bingbot" content="nocache">
```

nginxで、PDFを置いたフォルダーにヘッダーを付ける例：

```nginx
location /reports/ {
    add_header X-Robots-Tag "noarchive, nosnippet" always;
}
```
