---
title: "TDMRep生成ツール｜tdmrep.json作成（EUのTDMオプトアウト）"
description: "TDMRepのファイルを作成します。/.well-known/tdmrep.json、tdm-reservationとtdm-policyのHTTPヘッダー、HTMLメタタグで、EUのDSM指令第4条に基づくテキスト・データマイニングの権利を留保できます。"
h1: "TDMRep生成ツール"
nav: "TDMRep"
lead: "TDM Reservation Protocol（TDMRep）のファイルを作成します。TDMRepは、EUの著作権法に基づくテキスト・データマイニングの権利を留保することを、機械可読な形で表明するためのW3Cコミュニティグループの仕様です。"
steps:
  - "権利を留保するなら`tdm-reservation: 1`を、留保しないことを示すなら`0`を選びます。"
  - "必要に応じて`tdm-policy`のURLを追加します。ライセンスの取得方法を説明する、機械可読なドキュメントです。"
  - "サイトのルートに`/.well-known/tdmrep.json`を公開するか、HTTPヘッダーやHTMLメタタグを追加します（併用もできます）。"
  - "止めたいクローラーに対するrobots.txtのルールは残しておきます。TDMRepは権利を留保するもので、何かをブロックするものではありません。"
capabilities:
  - feature: "サイト全体用のファイル"
    status: "yes"
    note: "`location`、`tdm-reservation`、`tdm-policy`を含む`/.well-known/tdmrep.json`。"
  - feature: "レスポンスごとのヘッダーとメタタグ"
    status: "yes"
    note: "HTTPヘッダーとしての`tdm-reservation`と`tdm-policy`（nginxとApache用のコード）、およびHTMLの`<meta>`タグ。"
  - feature: "法的助言"
    status: "no"
    note: "留保が有効かどうかは、各国の法律と事実関係によって異なります。このページは情報提供であり、法的助言ではありません。"
faq:
  - q: "TDMRepとは何ですか？"
    a: "W3Cコミュニティグループが公開したTDM Reservation Protocol（2024年のFinal Report）です。EUのDSM指令（2019/790）第4条3項が認めるとおり、権利者がコンテンツのテキスト・データマイニングを留保していることを、ファイル、HTTPヘッダー、HTMLで表明する方法を定めています。"
  - q: "robots.txtでAIクローラーをブロックしていても、TDMRepは必要ですか？"
    a: "robots.txtは誰が取得してよいかを示し、TDMRepは誰が取得したかに関係なく、コンテンツで何をしてよいかを示します。EUのGPAI行動規範は、署名者にrobots.txtとその他の適切な機械可読プロトコルに従うことを求めています。両方を公開しておけば、念には念を入れた対策になります。"
  - q: "TDMRepを読むAI企業はどこですか？"
    a: "対応は限られており、ドキュメントに記載されることもまれです。欧州のパブリッシャーや一部のデータ提供者は使っていますが、大手AI開発者の多くがドキュメントに記載しているのはrobots.txtだけです。権利留保を標準化された形で追加表明するものと考えてください。"
related: ["content-signals", "guide-eu-ai-act", "meta-tags", "home"]
updated: "2026-11-04"
---

## TDMRepの位置づけ

EUのDSM指令は、適法にアクセスできるコンテンツのテキスト・データマイニングを認めていますが、オンラインで公開されたコンテンツについて、権利者が「機械可読な手段など、適切な方法で」**明示的に留保**した場合は例外です。robots.txtはそうした手段の1つであり、TDMRepはまさにこの目的のために設計された別の手段です。`tdmrep.json`ファイルはサイト全体または一部（`location`パターン）をカバーでき、ヘッダーはPDFや画像を含むあらゆるファイル形式に使え、メタタグはHTMLしか管理できない場合に使えます。
