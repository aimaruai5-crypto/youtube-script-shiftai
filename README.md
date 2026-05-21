# youtube-script-shiftai

YouTube動画の台本を一気通貫で自動生成する Claude Code プラグインです。  
企画情報の取得 → 文字起こし → 設計書 → 台本 → 訴求挿入 → 品質評価 → docx出力 までを自動実行します。

> このリポジトリは **ShiftAI チャンネル用**の設定が入っています。  
> 別チャンネルで使う場合は `config.txt` のURLを差し替えるだけで対応できます。

---

## 使い方

### 1. プラグインをインストールする

Claude Code のプラグイン機能でこのリポジトリを追加してください。

```
https://github.com/aimaruai5-crypto/youtube-script-shiftai
```

追加後、Claude Code を再起動するとスキル `/youtube-script-shiftai` が使えるようになります。

### 2. スキルを呼び出す

チャットで処理したい行番号を伝えるだけで自動実行が始まります。

```
162行目を処理して
3行目で台本作って
```

### 3. 自動実行される処理

| ステップ | 内容 |
|---|---|
| STEP 0 | GitHubの `config.txt` からURL設定を自動取得 |
| STEP 1 | 各プロンプト・チャンネル設定をGoogle Docsから取得 |
| STEP 2 | 企画管理スプレッドシートから指定行の企画情報を取得 |
| STEP 3 | YouTube動画から文字起こしを取得 → スプシに書き出し |
| STEP 4 | 設計書（タイトル案・サムネ案・企画意図）を生成 |
| STEP 5 | 台本本文を生成（6000文字程度） |
| STEP 6 | LINE特典スプシからキーワードを選び訴求①②③を挿入 |
| STEP 7 | 評価プロンプトで採点・75点以上になるまで自動修正 |
| STEP 8 | 追加プロンプト①②を順に適用して仕上げ |
| STEP 9 | Word文書（.docx）を出力 |

---

## ファイル構成

```
.
├── README.md                            ← このファイル
├── plugin.json                          ← Claude Code プラグイン定義
├── config.txt                           ← URL設定ファイル（チャンネルごとに差し替える）
└── skills/
    └── youtube-script-shiftai/
        └── skill.md                     ← スキル本体（通常は編集不要）
```

---

## 別チャンネルで使う場合

`config.txt` のURLを自分のチャンネル用に差し替えるだけで別チャンネルに対応できます。  
`skill.md` 本体は変更不要です。

### 手順

**1. このリポジトリをフォークまたは複製する**

```bash
# GitHubでフォークするか、新しいリポジトリを作って中身をコピー
```

**2. `config.txt` を自分のチャンネルのURLに書き換える**

```
# 企画管理スプレッドシート → 自分の企画一覧シートのURLに変更
PLANNING_SHEET=https://docs.google.com/spreadsheets/d/【自分のシートID】/edit

# プレゼント特典管理スプレッドシート → 自分のLINE特典シートのURLに変更
PRESENT_SHEET=https://docs.google.com/spreadsheets/d/【自分のシートID】/edit

# チャンネル設定ドキュメント → 自分のチャンネル設定を書いたGoogle DocのURLに変更
CHANNEL_CONFIG=https://docs.google.com/document/d/e/【自分のDoc】/pub

# 設計書生成プロンプト → 自分チャンネル向けに調整したプロンプトDocのURLに変更
DESIGN_PROMPT=https://docs.google.com/document/d/e/【自分のDoc】/pub

# 台本生成プロンプト → 自分チャンネル向けに調整したプロンプトDocのURLに変更
SCRIPT_PROMPT=https://docs.google.com/document/d/e/【自分のDoc】/pub

# 台本評価プロンプト → 評価基準を自分チャンネル向けに調整したDocのURLに変更
EVAL_PROMPT=https://docs.google.com/document/d/e/【自分のDoc】/pub

# 追加プロンプト①② → 自分チャンネル用に変更（不要なら空欄でもOK）
ADDITIONAL_PROMPT_1=https://docs.google.com/document/d/e/【自分のDoc】/pub
ADDITIONAL_PROMPT_2=https://docs.google.com/document/d/e/【自分のDoc】/pub
```

> **Google DocのURLについて**  
> Google Docは「ファイル → 共有 → ウェブに公開」で発行した `/pub` URLを使ってください。  
> 共有リンク（`/edit` や `/view`）ではスキルが読み取れません。

**3. 変更をGitHubにpushしてプラグインを再インストールする**

自分のリポジトリにpushした後、Claude Code でプラグインのURLを自分のリポジトリに変更して再追加するだけです。

---

## URLを後から変更したい場合

GitHubの `config.txt` を直接編集してコミットするだけです。  
スキル実行時に毎回 `config.txt` を取得するため、**次回の実行から自動的に新しいURLが使われます**。

---

## 動作に必要なもの

- Claude Code（Claude in Chrome拡張機能インストール済み）
- ChromeでGoogleアカウントにログイン済み
- ChromeでYouTubeにログイン済み（文字起こし取得に使用）
