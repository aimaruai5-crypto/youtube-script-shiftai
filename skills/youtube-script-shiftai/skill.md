---
name: youtube-script-shiftai
description: ShiftAI チャンネル専用のYouTube台本一気通貫生成スキル。URLや訴求テンプレートがすべて組み込み済み。「〇行目を処理して」「3行目で台本作って」などの指示で必ずこのスキルを使うこと。プロジェクトへのファイルアップロード不要。
---

# youtube-script-shiftai

ShiftAI チャンネル専用・YouTube動画台本の一気通貫生成パイプライン。
**設定はGitHubのconfig.txtから自動取得。ローカルファイル不要。**

---

## STEP 0｜設定ファイルをGitHubから取得してURLを解析する

以下のURLにWebFetchを実行し、`config.txt` の内容を取得する。

```
https://raw.githubusercontent.com/aimaruai5-crypto/youtube-script-shiftai/main/config.txt
```

取得したテキストを行ごとに解析し、`KEY=VALUE` 形式の行から以下の変数を抽出してメモリに保持する：

```
PLANNING_SHEET   → 企画管理スプシURL
PRESENT_SHEET    → プレゼントスプシURL
CHANNEL_CONFIG   → チャンネル設定Doc URL
DESIGN_PROMPT    → 設計書プロンプトDoc URL
SCRIPT_PROMPT    → 台本プロンプトDoc URL
EVAL_PROMPT      → 評価①プロンプトDoc URL
ADDITIONAL_PROMPT_1 → 追加プロンプト①Doc URL
ADDITIONAL_PROMPT_2 → 追加プロンプト②Doc URL
```

`#` で始まる行・空行はスキップする。

✅ 完了報告：「✅ STEP0完了：設定を読み込みました（8件のURL取得）」

---

## STEP 1｜プロンプト・設定をWebFetchで取得

STEP0で取得した各DocURLに対してWebFetchを実行し、テキストを取得してメモリに保持する。

```
channel_config  ← CHANNEL_CONFIG のURL
design_prompt   ← DESIGN_PROMPT のURL
script_prompt   ← SCRIPT_PROMPT のURL
eval_prompt     ← EVAL_PROMPT のURL
additional_1    ← ADDITIONAL_PROMPT_1 のURL
additional_2    ← ADDITIONAL_PROMPT_2 のURL
```

**注意：** WebFetchはドキュメントの全文を要約せずそのまま返すよう指示すること。

✅ 完了報告：「✅ STEP1完了：プロンプト・設定を読み込みました」

---

## STEP 2｜スプレッドシートから企画情報を取得

STEP0で取得した `PLANNING_SHEET` のURLをChromeで開き、指定行のデータを読み取る。

**手順：**
1. `navigate` でスプシを開く
2. 名前ボックス（左上のセル参照欄）をクリック → `Ctrl+A` → 列+行番号を入力（例：`B162`）→ Enter
3. 数式バーの内容を読む
4. 重要セルを順に確認：テーマ案（B列）→企画理由（I列）→文字起こしURL（J列）

**取得する列：**
`テーマ案` / `シチュエーション` / `用途` / `要素` / `企画理由` / `文字起こしURL` / `AIによって何が変わるか/どの嫌を潰すか` / `伸びている類似テーマ` / `動画の内容` / `メモ`

**文字起こしURLが空の場合：**
企画理由のテキストからYouTube URLを抽出してユーザーに確認し、承認を得てから次に進む。

✅ 完了報告：「✅ STEP2完了：企画情報を取得しました（テーマ：〇〇）」

---

## STEP 3｜文字起こしをChromeで取得してスプシに書き出す

**文字起こし取得（Chrome自動操作）：**

以下の方法Aから順番に試みる。成功したら次の方法には進まない。

---

**⚠️ 重要：YouTube URL の I/l 文字混同チェック**
スプシのJ列から読み取ったYouTube URLは、フォントによって大文字 `I`（アイ）と小文字 `l`（エル）が区別できない場合がある。
`navigate` する前に video ID をズームスクリーンショットで確認するか、`ytInitialPlayerResponse` で `status:ERROR` が返る場合は video ID の先頭文字を入れ替えて再試行する。

**前提確認：YouTubeログイン状態チェック**

まず `javascript_tool` で以下を実行してログイン状態を確認する：
```javascript
document.cookie.includes('LOGIN_INFO') || !!document.querySelector('button[aria-label*="アカウント"]')
```
`false` が返った場合 → ChromeでYouTubeにログインしていない可能性が高い。その場合は方法B・Cへ先にスキップすることを検討する。

**方法A：DOM操作でトランスクリプトを取得してexecCommandでコピー**

1. `navigate` でYouTube動画URLを開く（`https://www.youtube.com/watch?v={VIDEO_ID}` 形式に統一）
2. `wait` 4秒（ページ読み込み待ち）
3. `screenshot` でページ状態を確認。`status:ERROR` なら video ID の I/l 混同を疑い修正する
4. `scroll` で説明欄まで下スクロール（scroll_amount: 3）し、`wait` 2秒待つ
5. JavaScript で文字起こしボタンをクリックしてパネルを開く：
   ```javascript
   const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.trim() === '文字起こしを表示');
   if (btn) btn.click();
   ```
6. `wait` 3秒後、`ytd-transcript-segment-renderer` セグメントが存在するか確認
7. セグメントが存在する場合、以下のJavaScriptでセグメントテキストを取得し、**クリックイベント内の `execCommand('copy')` でクリップボードにコピーする**：
   ```javascript
   (() => {
     const segs = document.querySelectorAll('ytd-transcript-segment-renderer');
     const full = [...segs].map(s => (s.querySelector('.segment-text,[class*="segment-text"]') || s).textContent?.trim()).filter(Boolean).join(' ');
     window._kText = full.substring(0, 50000);
     window._lText = full.substring(50000);
     const btn = document.createElement('button');
     btn.textContent = '📋 K用コピー(' + window._kText.length + '文字)';
     btn.style.cssText = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:999999;font-size:18px;padding:15px 30px;background:red;color:white;border:none;cursor:pointer;border-radius:8px';
     btn.addEventListener('click', () => {
       const ta = document.createElement('textarea');
       ta.value = window._kText;
       ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
       document.body.appendChild(ta); ta.focus(); ta.select();
       const ok = document.execCommand('copy');
       document.body.removeChild(ta);
       btn.textContent = ok ? '✅ コピー完了' : '❌ 失敗';
       btn.style.background = ok ? 'green' : 'orange';
     });
     document.body.appendChild(btn);
     return `segs:${segs.length} K:${window._kText.length} L:${window._lText.length}`;
   })()
   ```
8. `computer left_click` でボタン（画面中央上部に表示）をクリック → ボタンが緑「✅ コピー完了」に変わったことを確認
9. **すぐに** スプシに `navigate` し、K165をトリプルクリック選択 → `key ctrl+v` で貼り付け → Enter確定
10. L165用も同様に（`window._lText` を使って同じボタンを設置してクリック → スプシに貼り付け）

**⚠️ 注意：** `navigator.clipboard.writeText()` はYouTubeページでタイムアウトするため使用しない。必ず `execCommand('copy')` をクリックイベント内で実行すること。

---

**方法B：JavaScriptでYouTube内部の字幕URLを取得してアクセス**

方法Aで取得できなかった場合、`javascript_tool` で以下を実行：

```javascript
const data = window.ytInitialPlayerResponse;
const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
if (!tracks || tracks.length === 0) return 'NO_CAPTIONS';
const ja = tracks.find(t => t.languageCode === 'ja') || tracks[0];
return ja.baseUrl + '&fmt=json3';
```

URLが返ってきた場合 → `navigate` でそのURLを開く → `get_page_text` でJSONテキストを取得 → `events[].segs[].utf8` フィールドのテキストを結合して文字起こし文字列を構成する。

---

**方法C（最終手段）：ユーザーへの手動依頼**

方法A・B どちらも失敗した場合のみ：
「YouTubeの動画ページで「文字起こしを表示」ボタンを押し、表示されたテキストをチャットに貼り付けてください。」とユーザーに依頼し、貼り付けを確認してから次へ進む。

---

**スプシへの書き出し（取得成功後）：**
1. `navigate` でスプシを開く（`PLANNING_SHEET` URL）
2. 名前ボックスをトリプルクリックして選択し `K{行番号}` と入力 → Enter でセル移動
3. `form_input` で文字起こしテキストを直接入力する
4. `key` でEnterを送信して確定する

**文字数判定：**
- ≤5万文字 → K列（文字起こし）に全文
- >5万文字 → K列に先頭5万文字、L列（文字起こし2）に続き

**form_inputが失敗した場合：**
文字起こし全文をチャットに表示してユーザーに手動貼り付けを依頼し、確認後に次へ進む。

✅ 完了報告：「✅ STEP3完了：文字起こし XX文字をK{行番号}に書き出しました」

---

## STEP 4｜設計書を生成する

STEP1で取得した `design_prompt` をプロンプトとして使用。
以下のデータを注入して設計書を生成する：
- テーマ案・企画理由・AIによって何が変わるか・文字起こし全文
- 伸びている類似テーマ・動画の内容・シチュエーション・用途・要素

**出力形式：**
```
[タイトル]

■ サムネ案
[内容]

■ タイトル案
[内容]

■ 視聴者を期待させる仕掛け
[競合分析をもとにした差別化戦略]

━━━━━━━━━━━━━━━━━━━━━━━━

企画意図
[企画立案の根拠・参考動画の分析]

参考動画
(a) [視聴回数]回視聴 / [タイトル] / [URL]

文字数：XXXX
```

✅ 完了報告：「✅ STEP4完了：設計書を生成しました」

---

## STEP 5｜台本本文を生成する（訴求なし）

STEP1で取得した `script_prompt` をテンプレートとして使用。
設計書と channel_config の内容を入力として台本を生成する。

**この時点では訴求（CTA）は挿入しない。**
**文字数ルール：台本本文（訴求除く）は6000文字程度（5500〜6500文字）で生成する。**

台本の構造（モジュール形式）：
```
【モジュール：導入】
ブロック1｜問題提起と到達点の提示
[本文]

【モジュール：全体像】
ブロック2｜[タイトル]
[本文]

【モジュール：実演】
ブロック3〜N｜[タイトル]
[本文]

【モジュール：総括】
[本文]
```

生成後に文字数をカウントして表示する。範囲外の場合は調整してから次へ進む。

✅ 完了報告：「✅ STEP5完了：台本本文を生成しました（XXXX文字）」

---

## STEP 6｜訴求を挿入する

STEP0で取得した `PRESENT_SHEET` のURLをChromeで開き、動画テーマに合う**キーワードを1つ**選ぶ。

**プレゼントスプシの構造理解（重要）：**
- A列「特典ジャンル」・B列「特典名」・C列「リンク」・D列「キーワード」の構成
- D列のキーワードは**複数行をまたいでセル結合**されており、1キーワードに対して複数の特典（通常4件）が対応している
- 視聴者がLINEに「キーワード」を送ると、そのキーワードに紐づく**全特典が自動配信**される

**選定ルール（厳守）：**
1. 動画テーマに最も合う**キーワード1つ**をD列から選ぶ
2. そのキーワードに対応するB列の特典を**過不足なく**4件（または実際に紐づく件数）すべて使う
3. **異なるキーワードの特典を混在させない**（LINEの自動配信設定と一致しなくなるため）
4. `{{PRESENT_1_NAME}}〜{{PRESENT_4_NAME}}` にはそのキーワードに紐づく特典名を順に入れる
5. `{{KEYWORD}}` にはD列のキーワード文字列を、`{{KEYWORD_CHARS}}` にはその文字数を入れる
6. `{{PRESENT_SINGLE}}` には4件の中で最もテーマに近い代表特典1件の名前を入れる

**キーワード選定の判断基準：**
- 動画の主要トピック（使用AIツール・スキル・業種）と最も関連するジャンルのキーワードを選ぶ
- 複数候補がある場合は、視聴者が「これほしい！」と思う魅力度の高い特典群のキーワードを優先する

以下の訴求テンプレートの `{{PLACEHOLDER}}` を埋めて訴求①②③を完成させる。

**挿入位置：**
- 訴求①：導入モジュール後（本編直前）
- 訴求②：実演モジュール途中（クライマックス直前）
- 訴求③：総括モジュール後（エンディング前）

各訴求は前後の台本の流れに合わせて書き出し・結びを自然に微調整する。骨格・オファー内容・URLは変更しない。

---

**【訴求①テンプレート】**

YouTubeだけでは紹介しきれないAI活用の情報を、概要欄の一番上にある公式LINEを友だち登録していただくと受け取ることができます。

さらに、AIを活用した月10万円以上の収益化方法や、（素材②）資料作成を2時間から15分に短縮する社内の業務効率化AIノウハウなどが学べるAI活用無料勉強会に、オンラインで参加できます。

また、この勉強会に参加すると、明日からすぐに使える「{{PRESENT_SINGLE}}」をはじめとしたAIスキルが身につく、AI活用の豪華特典が無料で受け取れますので、概要欄の一番上にあるLINEをぜひ友だち登録してみてください。

---

**【訴求②テンプレート】**

{{CTA2_BRIDGE}}

でも、いざ実際に使うとき「あれ、自分の仕事の場合、どうやって指示を出せばいいんだっけ？」「なんて言えばAIが完璧に動いてくれるの？」と、最初の1行目で手が止まってしまう方がすごく多いんです。

そこで、今日からこの内容を使い倒して、AIを専属の超優秀なパートナーとしてフル活用できるように、最強のカンペをご用意しました。

僕の公式LINEに登録して、「{{KEYWORD}}」この{{KEYWORD_CHARS}}文字を送ってください。それだけで、こちらの豪華特典をすべて無料でプレゼントします。

① 「{{PRESENT_1_NAME}}」── {{PRESENT_1_DESC}}
② 「{{PRESENT_2_NAME}}」── {{PRESENT_2_DESC}}
③ 「{{PRESENT_3_NAME}}」── {{PRESENT_3_DESC}}
④ 「{{PRESENT_4_NAME}}」── {{PRESENT_4_DESC}}

ただ1つだけお伝えしておくと、AIツールの進化は本当に早いです。最新情報に合わせて作り込んでいるこの資料も、いつまで無料で公開できるか分かりません。情報が古くなって非公開になる前に、今のうちに受け取っておくことを強くおすすめします。

AIに任せて、自分はカフェでゆっくりしたり、定時でサクッと帰りたい。そんな働き方を実現したい方は、今すぐ概要欄の一番上のリンクから登録して「{{KEYWORD}}」とメッセージを送ってください。

---

**【訴求③テンプレート】**

そして「AIをもっと使いこなしたい！」という方は、公式LINEでさらに詳しい実践ノウハウを発信しています。僕自身も会社員時代、流行りだからというなんとなくの理由でAIを学び始めましたが、今では副業で毎月20万円ほど稼げるようになりました。特別なスキルがあったわけではありません。正しい知識と実践の積み重ねがあれば、誰でも成果を出せると実感しています。登録していただいた方には、本日紹介した「{{PRESENT_SINGLE}}」などの特別なプレゼントもご用意しています。ぜひ概要欄から登録して、毎日の業務に役立ててください。

ということで、最後までご視聴ありがとうございました。このチャンネルでは、AIを活用して日常や仕事をもっと便利にするコツや活用術を発信しています。面白い・役に立ったと思っていただけた方は、ぜひチャンネル登録とグッドボタンもよろしくお願いします。

---

✅ 完了報告：「✅ STEP6完了：訴求①②③を挿入しました」

---

## STEP 7｜品質ループ・評価①（75点になるまで繰り返す）

STEP1で取得した `eval_prompt`（**評価①**）で台本全体（設計書＋台本＋訴求）を採点する。

**評価の出力形式：**
```
## 採点結果
総合スコア：XX点 / 100点

## 項目別スコア
- 冒頭フック：XX点/20点　理由：〇〇
- 構成の流れ：XX点/20点　理由：〇〇
- 情報の具体性：XX点/20点　理由：〇〇
- 訴求の自然さ：XX点/20点　理由：〇〇
- 総括・行動促進：XX点/10点　理由：〇〇
- 文字数・尺：XX点/10点　理由：〇〇

## 修正が必要な箇所（優先順位順）
1. 【箇所：モジュール名/ブロック名】
   問題：〇〇
   修正指示：具体的にどう直すか
```

**ループ処理：**
```
1. 評価①（eval_prompt）で採点する
   → 評価プロンプトへの回答（採点結果・項目別スコア・修正指示）を【毎回必ず全文出力する】
2. スコア < 75点
   → 修正指示を上から順に台本に適用して台本を更新
   → 更新後の台本全文を出力する
   → 更新後の台本に対して評価①を再度適用（同じeval_promptを使う）
   → 1に戻る
3. スコア ≥ 75点
   → 合格した評価回答の全文を出力する（省略しない）
   → 合格した最終台本全文を出力する（省略しない）
   → STEP8へ
4. 上限10回。10回でも未達の場合はユーザーに報告して判断を仰ぐ
```

**出力ルール（重要）：**
- 各ループの評価回答は**省略・要約せず全文出力**する
- 75点以上で合格したループの評価回答も必ず全文出力する
- 「採点結果は以上です」「詳細は省略します」などの省略表現は禁止

**修正時の文字数ルール：**
- 修正後の台本本文（訴求除く）は必ず **5500〜6500文字**（目安6000文字）に収める
- 訴求①②③のブロック・URL・オファー内容は変更しない

各ループで「🔄 評価①採点中...（目標75点、N回目）」と表示してから評価回答を全文出力する。

✅ 完了報告：「✅ STEP7完了：評価①：XX点で合格（N回で到達）」

---

## STEP 8｜追加プロンプトを順番に適用する

STEP1で取得した `additional_1`（追加プロンプト①）→ `additional_2`（追加プロンプト②）の順に台本へ適用する。

**処理フロー：**
```
追加プロンプト①を適用：
  1. 「📝 追加プロンプト①を適用中...」と表示
  2. 現在の台本全体に additional_1 を適用して台本を更新
  3. 更新後の台本を表示

追加プロンプト②を適用：
  1. 「📝 追加プロンプト②を適用中...」と表示
  2. 現在の台本全体に additional_2 を適用して台本を更新
  3. 更新後の台本を表示
```

**適用ルール：**
- 各プロンプトは直前ステップの出力（最新の台本）に対して適用する
- 「評価系」の場合：**評価プロンプトへの回答を省略せず全文出力**し、採点75点未満なら指摘を修正してから次へ進む
- 「スタイル変換系」の場合：台本全体を書き換えて更新し、**変換後の台本全文を出力する**
- 訴求①②③のブロック・URL・オファー内容は変更しない
- **台本本文（訴求除く）は修正・変換後も必ず5500〜6500文字（目安6000文字）に収める**
- **「省略します」「詳細は割愛」などの省略表現は禁止。必ず全文出力する**

✅ 完了報告：「✅ STEP8完了：追加プロンプト2件を適用しました」

---

## STEP 9｜docxを出力する

`anthropic-skills:docx` スキルを使い、以下のフォーマットでWordドキュメントを会話内に出力する。

```
タイトル（見出し1・太字）
■ サムネ案 / ■ タイトル案 / ■ 視聴者を期待させる仕掛け
企画意図（見出し2・青色 #1F4E79）
参考動画（URL付き）
文字数（赤色）

━━━━━━━━━━━━━━━━━━━━━━━━

台本（見出し1）
【モジュール：〇〇】（太字）
ブロックN｜...（見出し3）
（本文）
【訴求①②③】（赤色・太字）、訴求本文（赤色）
※撮影指示（オレンジ色 #FF6600）
```

✅ 完了報告：「✅ STEP9完了：docxを出力しました」

---

## 進捗表示

| ステップ | 完了メッセージ |
|---|---|
| STEP0 | ✅ 設定を読み込みました（8件のURL取得） |
| STEP1 | ✅ プロンプト・設定を読み込みました |
| STEP2 | ✅ 企画情報を取得しました（テーマ：〇〇） |
| STEP3 | ✅ 文字起こし XX文字をK{行番号}に書き出しました |
| STEP4 | ✅ 設計書を生成しました |
| STEP5 | ✅ 台本本文を生成しました（XXXX文字） |
| STEP6 | ✅ 訴求①②③を挿入しました |
| STEP7 | ✅ 評価①：XX点で合格（N回で到達） |
| STEP8 | ✅ 追加プロンプト2件を適用しました |
| STEP9 | ✅ docxを出力しました |

---

## 途中再開の方法

```
「〇行目のSTEP〇から再開してください。
 ここまでの状況：
 - テーマ：〇〇
 - 文字起こし：スプシ書き込み済み
 - 設計書：[内容をここに貼る]」
```

---

## エラーハンドリング

| エラー | 対応 |
|---|---|
| config.txt取得失敗 | `https://raw.githubusercontent.com/aimaruai5-crypto/youtube-script-shiftai/main/config.txt` を再取得。リポジトリが非公開の場合はユーザーに確認 |
| WebFetchがドキュメントを要約してしまう | 「要約せず全文そのまま出力して」と再指示 |
| 文字起こしURLが空 | 企画理由からURLを抽出→ユーザーに確認 |
| YouTubeトランスクリプトボタンが見つからない | `scroll` で説明欄を展開 → 「⋮」ボタンを再探索 → 方法Bへフォールバック |
| 方法B（JavaScript）で `NO_CAPTIONS` / `ERROR` が返る | YouTubeにログインしていない or 動画が非公開の可能性 → 方法Cへ |
| Claudeの Chromeが YouTubeにログインしていない | 方法Cへスキップし、ユーザーに手動貼り付けを依頼 |
| 文字起こしが取得できない | 方法A→B→C の順に試し、Cでユーザーに手動貼り付けを依頼 |
| form_inputでスプシ書き込みが失敗 | 文字起こし全文をチャットに表示→ユーザーに手動貼り付けを依頼し確認後に次へ |
| Chrome未接続 | 「Claude in Chromeを起動してください」 |

---

## URLの変更方法

URLを変更したい場合はGitHub上の `config.txt` を直接編集してください。スキル本体（skill.md）の変更は不要です。

```
# 変更手順
1. GitHubリポジトリの config.txt を開く
2. 変更したいキーの値を書き換えて保存・コミット
3. 次回スキル実行時から自動的に新しいURLが使われる
```
