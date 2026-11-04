---
title: "AIRobotsTxtChecker｜当サイトのrobots.txt確認ボット"
description: "当サイトのrobots.txtテスターが使うUser-Agent「AIRobotsTxtChecker」について、取得するもの（/robots.txtのみ）、頻度、接続元、ブロックする方法を説明します。"
h1: "当サイトのチェッカーボット：AIRobotsTxtChecker"
nav: "チェッカーボット"
lead: "robots.txtテスターのライブチェックが使われると、当サイトのサーバーがこのUser-Agentで、対象サイトの/robots.txtを1回だけ取得します。それ以外のものを取得することはありません。"
related: ["tester", "privacy", "about"]
updated: "2026-11-04"
---

## User-Agent

```
Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)
```

## 動作

- ユーザーが入力したホストの`/robots.txt`**だけ**を取得します。ページ、画像、サイトマップは取得しません。
- 1回のチェックにつきリクエストは1回です。結果は10分間キャッシュされるため、その間に同じホストを繰り返しチェックしても、新たなリクエストは発生しません。
- リダイレクトは最大5回までたどり、待ち時間は最大5秒、読み込むのは最大512 KiBです。
- 接続先は、ポート80と443の公開IPアドレスだけです。
- クローラーではありません。リンクをたどることも、キャッシュ以外にファイルを保存することも、ほかの目的に使うこともありません。

## robots.txtに従いますか？

robots.txtを読みはしますが、robots.txtの対象となるようなクロールは一切行いません。Googleのrobots.txtフェッチャーと同じく、robots.txtファイル自体の取得には、そのrobots.txtのルールを適用しません。

## ブロックする方法

当サイト経由でrobots.txtをチェックされたくない場合は、User-Agent `AIRobotsTxtChecker`に対して`403`を返してください。たとえばnginxでは次のように書きます。

```nginx
if ($http_user_agent ~* "AIRobotsTxtChecker") { return 403; }
```

お問い合わせ・不正利用の報告：{{contact}}
