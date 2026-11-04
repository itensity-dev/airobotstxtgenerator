---
title: "robots.txtの書き方（RFC 9309準拠）｜記述ルールと例"
description: "robots.txtの書き方を例とともに解説します。グループ、User-agent、AllowとDisallow、ワイルドカードの*と$、最長一致、名前を指定したボットがUser-agent: *を無視する理由、ファイルサイズ、ステータスコード、よくある間違い。"
h1: "robots.txtの書き方：RFC 9309に基づく記述ルールと例"
nav: "robots.txtの書き方"
lead: "robots.txtは2022年9月にRFC 9309としてインターネット標準になりました。ルールは短いものの、最長一致、クローラーごとに1グループ、空行の扱いなど、ほとんどの人が意外に感じる点がいくつかあります。以下の例はすべてテスターに貼り付けて試せます。"
related: ["tester", "home", "guide-bad-bots", "bots"]
updated: "2026-11-04"
faq:
  - q: "robots.txtは大文字と小文字を区別しますか？"
    a: "ディレクティブ名（`User-agent`、`Disallow`）とボット名は区別しませんが、パスは区別します。`Disallow: /Private/`では`/private/`はブロックされません。"
  - q: "正規表現は使えますか？"
    a: "使えません。特別な意味を持つのは、`*`（任意の文字列）と、パターン末尾の`$`（URLの末尾）だけです。"
  - q: "Allow行は必要ですか？"
    a: "Disallowしたパスの中で一部を再び許可する場合にだけ必要です。Disallowしていないものはすべて許可されます。"
  - q: "robots.txtはサブドメインにも適用されますか？"
    a: "いいえ。スキーム、ホスト、ポートの組み合わせごとに別のファイルが必要です。`https://example.com/robots.txt`は`https://blog.example.com/`には適用されません。"
---

## ファイル

robots.txtは、ホストのルートに置くUTF-8のプレーンテキストファイルです（`https://example.com/robots.txt`）。クローラーはクロールの前にこれを取得します。各行は`key: value`の形式で、`#`以降はコメントになります。Googleは**500 KiB**まで読み込み、残りは無視します。

## グループ

**グループ**とは、1行以上の`User-agent`行と、それに続くルールのまとまりです。

```
User-agent: GPTBot
User-agent: CCBot
Disallow: /

User-agent: *
Disallow: /admin/
```

- クローラーは、自分の**名前を指定した**グループを使います。照合では大文字と小文字を区別せず、プロダクトトークンだけを使います。`User-agent: GPTBot/1.4`は`GPTBot`として読み取られます。
- 同じクローラーを指定したグループが複数ある場合、それらのルールは**統合**されます。
- `User-agent: *`を使うのは、どのグループにも名前を指定されていないクローラーだけです。
- 専用グループを持つクローラーは、**`*`を完全に無視**します。上の例では`GPTBot`は何も取得できませんが、もしそのグループが`Disallow: /blog/`だけなら`/admin/`を取得できます。`*`のルールはもう適用されないからです。

**空行ではグループは終わりません。** 次のファイルでは、2つのUser-agent行が同じグループに属するため、`GPTBot`にも`*`のルールが適用されます。

```
User-agent: GPTBot

User-agent: *
Disallow: /private/
```

## ルール：AllowとDisallow

`Disallow: /path`は、パスが`/path`で始まるすべてのURLをブロックします（`/path.html`、`/path/`、`/pathology`も含みます）。空の`Disallow:`はすべてを許可します。`Allow`はパスを再び許可します。

複数のルールが一致した場合は**最も長いパターンが優先**され、AllowとDisallowのパターンが同じ長さなら**Allowが優先**されます。行の順番は関係ありません。

```
User-agent: *
Disallow: /shop/
Allow: /shop/catalog/
```

`/shop/cart`はブロックされ、`/shop/catalog/shoes`は許可されます（14文字が6文字に勝つため）。

## ワイルドカード

- `*`は任意の文字列に一致します。`Disallow: /*.pdf`は`.pdf`を含むすべてのURLをブロックします。
- 末尾の`$`はURLの終わりを表します。`Disallow: /*.pdf$`は`/a.pdf`をブロックしますが、`/a.pdf?download=1`はブロックしません。
- 末尾の`*`は意味がありません。`/private*`は`/private`と同じです。
- パターンはパス**とクエリ**に対して照合されます。`Disallow: /*?sort=`は並べ替えた一覧ページをブロックします。

## その他の行

- `Sitemap: https://example.com/sitemap.xml`：完全なURLで書きます。すべてのクローラーに適用され、ファイル内のどこに置いてもかまいません。
- `Crawl-delay`：Googleは無視しますが、Bing、Yandex、Anthropic、Common Crawlは従います。
- robots.txt内の`Noindex`：2019年以降サポートされていません。robotsメタタグを使ってください。
- `Content-Signal`、`Content-Usage`：AIでの利用に関する意向を示すための提案です。[コンテンツシグナル](page:content-signals)をご覧ください。

## ファイルがない・壊れている場合

| /robots.txtへの応答 | Googleの動作 |
|---|---|
| 200 | ルールが適用される |
| 3xx | リダイレクトを最大5回たどり、その後は404として扱う |
| 4xx（429を除く） | 制限なし：すべてクロール可能 |
| 5xx、429 | クロールを一時停止。約30日後はキャッシュを使うか制限なし |
| 到達できない | 5xxと同様に扱う |

## Googleは許容しても、ほかでは通用しない間違い

Googleは`Dissallow`、`User agent`、コロンの欠落（`Disallow /admin`）、BOMを受け付けます。ほかのクローラーは受け付けない場合があるため、Googleのパーサーが読み取れるものでも[テスター](page:tester)は指摘します。また、`User-agent`行より前にあるルール（どのクローラーにも無視されます）、`Disallow`内の完全なURL（一致しません）、先頭のスラッシュがないパスも指摘します。
