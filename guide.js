const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "youtube-script-shiftai 使い方ガイド";

// ── カラーパレット ───────────────────────
const C = {
  navy:   "1E2761",
  navyM:  "2D3B8C",
  red:    "E74C3C",
  blue:   "3498DB",
  white:  "FFFFFF",
  dark:   "1A1A2E",
  bg:     "F8FAFC",
  gray:   "64748B",
  lightG: "E2E8F0",
  green:  "27AE60",
  orange: "F39C12",
  teal:   "16A085",
  ice:    "CADCFC",
};

// ── ヘルパー ─────────────────────────────
function sh(col) {
  return { type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.12 };
}
function titleBar(s, text) {
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.navy }, line: { color: C.navy }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 0.9,
    fill: { color: C.red }, line: { color: C.red }
  });
  s.addText(text, {
    x: 0.35, y: 0, w: 9.3, h: 0.9,
    fontSize: 21, fontFace: "Arial", color: C.white,
    bold: true, valign: "middle", margin: 0
  });
}

// ════════════════════════════════════════
// Slide 1: タイトル
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: C.red }, line: { color: C.red }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.18, y: 3.85, w: 9.82, h: 0.06,
    fill: { color: C.navyM }, line: { color: C.navyM }
  });

  s.addText("youtube-script-shiftai", {
    x: 0.5, y: 0.75, w: 9.2, h: 1.05,
    fontSize: 36, fontFace: "Arial", color: C.white,
    bold: true, align: "left", margin: 0
  });
  s.addText("YouTube 動画台本 一気通貫生成スキル", {
    x: 0.5, y: 1.9, w: 9.0, h: 0.65,
    fontSize: 20, fontFace: "Arial", color: C.ice,
    align: "left", margin: 0
  });
  s.addText("企画情報取得 → 文字起こし → 設計書 → 台本 → 訴求挿入 → 品質評価 → docx 出力", {
    x: 0.5, y: 2.6, w: 9.0, h: 0.45,
    fontSize: 12, fontFace: "Arial", color: "8899BB",
    align: "left", margin: 0
  });

  // タグ
  [
    { text: "ShiftAI チャンネル専用", x: 0.5, col: C.red },
    { text: "Claude Code プラグイン", x: 3.2, col: C.teal },
  ].forEach(tag => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: tag.x, y: 4.3, w: 2.5, h: 0.42,
      fill: { color: tag.col }, line: { color: tag.col }
    });
    s.addText(tag.text, {
      x: tag.x, y: 4.3, w: 2.5, h: 0.42,
      fontSize: 12, fontFace: "Arial", color: C.white,
      bold: true, align: "center", valign: "middle", margin: 0
    });
  });
}

// ════════════════════════════════════════
// Slide 2: できること（3カード）
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  titleBar(s, "このスキルでできること");

  const cards = [
    {
      icon: "⚡", col: C.navy, title: "完全自動化",
      lines: ["行番号を伝えるだけ", "STEP 0〜9 を全自動実行", "docx 出力まで一気通貫"]
    },
    {
      icon: "✅", col: C.green, title: "品質保証ループ",
      lines: ["AI が 100 点満点で採点", "75 点以上になるまで", "自動で修正を繰り返す"]
    },
    {
      icon: "⚙", col: C.red, title: "設定分離設計",
      lines: ["URL は config.txt で管理", "スキル本体を変えずに", "他チャンネルへ流用可能"]
    },
  ];

  cards.forEach((card, i) => {
    const x = 0.35 + i * 3.12;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.1, w: 2.98, h: 4.12,
      fill: { color: C.bg }, shadow: sh()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.1, w: 2.98, h: 0.14,
      fill: { color: card.col }, line: { color: card.col }
    });
    s.addText(card.icon, {
      x, y: 1.35, w: 2.98, h: 0.75,
      fontSize: 36, align: "center", valign: "middle", margin: 0
    });
    s.addText(card.title, {
      x, y: 2.18, w: 2.98, h: 0.52,
      fontSize: 15, fontFace: "Arial", color: C.dark,
      bold: true, align: "center", margin: 0
    });
    card.lines.forEach((line, j) => {
      s.addText(line, {
        x: x + 0.18, y: 2.82 + j * 0.48, w: 2.62, h: 0.44,
        fontSize: 12, fontFace: "Arial", color: C.gray,
        align: "center", margin: 0
      });
    });
  });
}

// ════════════════════════════════════════
// Slide 3: ワークフロー図
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  titleBar(s, "ワークフロー：STEP 0 〜 STEP 9");

  const steps = [
    { n:"0", title:"設定取得",    sub:"config.txt\nGitHubから",    col:"6C757D" },
    { n:"1", title:"プロンプト取得",  sub:"Google Docs\nから読込",  col:"3498DB" },
    { n:"2", title:"企画情報取得",   sub:"スプシの\n指定行を読込",  col:"3498DB" },
    { n:"3", title:"文字起こし取得", sub:"YouTube\n→スプシ書出",   col:"3498DB" },
    { n:"4", title:"設計書生成",    sub:"タイトル案\nサムネ案など",   col:"1E2761" },
    { n:"5", title:"台本生成",     sub:"6000文字\n訴求なし",       col:"1E2761" },
    { n:"6", title:"訴求挿入",     sub:"LINE特典\n①②③挿入",     col:"E74C3C" },
    { n:"7", title:"品質評価",     sub:"75点まで\n自動修正ループ",  col:"E74C3C" },
    { n:"8", title:"追加調整",     sub:"追加プロンプト\n①②適用",   col:"27AE60" },
    { n:"9", title:"docx出力",    sub:"Word文書\n完成・出力",      col:"16A085" },
  ];

  const BW = 1.56, BH = 1.6, GAP = 0.36;
  const START_X = (10 - (5 * BW + 4 * GAP)) / 2; // ≈ 0.34
  const ROW_Y = [1.1, 3.4];
  const rows = [steps.slice(0, 5), steps.slice(5)];

  rows.forEach((row, ri) => {
    const ry = ROW_Y[ri];
    row.forEach((st, ci) => {
      const x = START_X + ci * (BW + GAP);

      s.addShape(pres.shapes.RECTANGLE, {
        x, y: ry, w: BW, h: BH,
        fill: { color: st.col },
        shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.2 }
      });
      // ステップ番号帯
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: ry, w: BW, h: 0.3,
        fill: { color: C.white, transparency: 15 }, line: { color: st.col }
      });
      s.addText("STEP " + st.n, {
        x, y: ry, w: BW, h: 0.3,
        fontSize: 9, fontFace: "Arial", color: st.col,
        bold: true, align: "center", valign: "middle", margin: 0
      });
      // タイトル
      s.addText(st.title, {
        x, y: ry + 0.3, w: BW, h: 0.68,
        fontSize: 11, fontFace: "Arial", color: C.white,
        bold: true, align: "center", valign: "middle", margin: 0
      });
      // サブテキスト
      s.addText(st.sub, {
        x, y: ry + 0.98, w: BW, h: 0.47,
        fontSize: 8, fontFace: "Arial", color: C.ice,
        align: "center", valign: "middle", margin: 0
      });

      // 横矢印
      if (ci < row.length - 1) {
        s.addShape(pres.shapes.LINE, {
          x: x + BW + 0.04, y: ry + BH / 2,
          w: GAP - 0.08, h: 0,
          line: { color: "AABBCC", width: 1.5 }
        });
        s.addText("▶", {
          x: x + BW + GAP - 0.22, y: ry + BH / 2 - 0.14,
          w: 0.22, h: 0.28,
          fontSize: 9, color: "AABBCC", align: "center", margin: 0
        });
      }
    });
  });

  // 折り返し矢印（行1→行2）
  const lastX = START_X + 4 * (BW + GAP) + BW / 2;
  const firstX = START_X + BW / 2;
  const midY = ROW_Y[0] + BH + (ROW_Y[1] - ROW_Y[0] - BH) / 2;
  // ↓右端
  s.addShape(pres.shapes.LINE, {
    x: lastX, y: ROW_Y[0] + BH + 0.04,
    w: 0, h: midY - (ROW_Y[0] + BH) - 0.04,
    line: { color: "AABBCC", width: 1.5, dashType: "sysDot" }
  });
  // ← 横
  s.addShape(pres.shapes.LINE, {
    x: firstX, y: midY,
    w: lastX - firstX, h: 0,
    line: { color: "AABBCC", width: 1.5, dashType: "sysDot" }
  });
  // ↓左端
  s.addShape(pres.shapes.LINE, {
    x: firstX, y: midY,
    w: 0, h: ROW_Y[1] - midY - 0.04,
    line: { color: "AABBCC", width: 1.5, dashType: "sysDot" }
  });
  s.addText("▼", {
    x: firstX - 0.12, y: ROW_Y[1] - 0.25,
    w: 0.25, h: 0.25,
    fontSize: 9, color: "AABBCC", align: "center", margin: 0
  });
}

// ════════════════════════════════════════
// Slide 4: 使い方
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  titleBar(s, "使い方");

  // ステップ1
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 1.05, w: 0.52, h: 0.52,
    fill: { color: C.navy }, line: { color: C.navy }
  });
  s.addText("1", {
    x: 0.3, y: 1.05, w: 0.52, h: 0.52,
    fontSize: 18, color: C.white, bold: true,
    align: "center", valign: "middle", margin: 0
  });
  s.addText("プラグインをインストールする", {
    x: 0.95, y: 1.05, w: 8.7, h: 0.52,
    fontSize: 15, fontFace: "Arial", color: C.dark,
    bold: true, valign: "middle", margin: 0
  });

  // URLブロック
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.9, y: 1.67, w: 8.8, h: 0.5,
    fill: { color: "1E2761" }, line: { color: "1E2761" }
  });
  s.addText("https://github.com/aimaruai5-crypto/youtube-script-shiftai", {
    x: 0.9, y: 1.67, w: 8.8, h: 0.5,
    fontSize: 12, fontFace: "Courier New", color: "7EC8E3",
    valign: "middle", margin: { left: 10, right: 10, top: 0, bottom: 0 }
  });
  s.addText("Claude Code のプラグイン追加画面でこの URL を入力 → 再起動するとスキルが有効になります", {
    x: 0.9, y: 2.22, w: 8.8, h: 0.4,
    fontSize: 11, fontFace: "Arial", color: C.gray, margin: 0
  });

  // ステップ2
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 2.78, w: 0.52, h: 0.52,
    fill: { color: C.red }, line: { color: C.red }
  });
  s.addText("2", {
    x: 0.3, y: 2.78, w: 0.52, h: 0.52,
    fontSize: 18, color: C.white, bold: true,
    align: "center", valign: "middle", margin: 0
  });
  s.addText("処理したい企画の行番号を伝えるだけ", {
    x: 0.95, y: 2.78, w: 8.7, h: 0.52,
    fontSize: 15, fontFace: "Arial", color: C.dark,
    bold: true, valign: "middle", margin: 0
  });

  // チャット吹き出し風
  const msgs = [
    { text: "162行目を処理して", user: true },
    { text: "✅ STEP0完了：設定を読み込みました（8件のURL取得）", user: false },
    { text: "✅ STEP1完了：プロンプト・設定を読み込みました", user: false },
    { text: "✅ STEP2完了：企画情報を取得しました（テーマ：AI活用術）", user: false },
  ];
  msgs.forEach((msg, i) => {
    const isUser = msg.user;
    const x = isUser ? 5.8 : 0.9;
    const w = isUser ? 3.8 : 5.2;
    const bg = isUser ? C.navy : C.bg;
    const tc = isUser ? C.white : C.dark;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.38 + i * 0.5, w, h: 0.44,
      fill: { color: bg },
      shadow: { type: "outer", color: "000000", blur: 4, offset: 1, angle: 135, opacity: 0.1 }
    });
    s.addText(msg.text, {
      x, y: 3.38 + i * 0.5, w, h: 0.44,
      fontSize: 10, fontFace: "Arial", color: tc,
      valign: "middle",
      margin: { left: 8, right: 8, top: 0, bottom: 0 }
    });
  });
}

// ════════════════════════════════════════
// Slide 5: config.txt URL一覧
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  titleBar(s, "設定ファイル（config.txt）— URL 一覧と役割");

  const rows = [
    { key: "PLANNING_SHEET",      type: "スプシ",    tcol: C.green,  desc: "企画管理スプレッドシート。テーマ案・文字起こしURL等をここから取得する" },
    { key: "PRESENT_SHEET",       type: "スプシ",    tcol: C.green,  desc: "LINE特典管理スプシ。キーワード・特典名・リンクを格納。訴求文の生成に使用" },
    { key: "CHANNEL_CONFIG",      type: "Doc / 設定", tcol: C.blue,   desc: "チャンネル設定（ターゲット・トーン・フォーマット等）。台本生成の前提知識として読込" },
    { key: "DESIGN_PROMPT",       type: "Doc / 設計書", tcol: C.navy, desc: "設計書（タイトル案・サムネ案・企画意図）を生成するためのプロンプト" },
    { key: "SCRIPT_PROMPT",       type: "Doc / 台本",  tcol: C.navy, desc: "台本本文（6000字程度）を生成するプロンプト。この段階では訴求を挿入しない" },
    { key: "EVAL_PROMPT",         type: "Doc / 評価",  tcol: C.red,  desc: "台本を100点満点で採点するプロンプト。75点以上になるまで修正ループを実行" },
    { key: "ADDITIONAL_PROMPT_1", type: "Doc / 追加①", tcol: C.orange, desc: "評価ループ通過後に適用する追加プロンプト①（スタイル調整・品質強化など）" },
    { key: "ADDITIONAL_PROMPT_2", type: "Doc / 追加②", tcol: C.orange, desc: "追加プロンプト②（最終仕上げ・スタイル変換など）" },
  ];

  // ヘッダー
  const headers = [
    { text: "キー名", x: 0.25, w: 2.95 },
    { text: "種別",   x: 3.25, w: 1.1  },
    { text: "役割・説明", x: 4.4, w: 5.35 },
  ];
  headers.forEach(h => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: h.x, y: 0.95, w: h.w, h: 0.35,
      fill: { color: C.navy }, line: { color: C.navy }
    });
    s.addText(h.text, {
      x: h.x, y: 0.95, w: h.w, h: 0.35,
      fontSize: 10, color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0
    });
  });

  rows.forEach((row, i) => {
    const y = 1.35 + i * 0.5;
    const bg = i % 2 === 0 ? C.white : C.bg;

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.25, y, w: 9.5, h: 0.48,
      fill: { color: bg }, line: { color: C.lightG }
    });
    s.addText(row.key, {
      x: 0.3, y, w: 2.85, h: 0.48,
      fontSize: 9, fontFace: "Courier New", color: C.navy,
      bold: true, valign: "middle",
      margin: { left: 6, right: 0, top: 0, bottom: 0 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.28, y: y + 0.1, w: 1.0, h: 0.28,
      fill: { color: row.tcol }, line: { color: row.tcol }
    });
    s.addText(row.type, {
      x: 3.28, y: y + 0.1, w: 1.0, h: 0.28,
      fontSize: 7.5, color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0
    });
    s.addText(row.desc, {
      x: 4.42, y, w: 5.28, h: 0.48,
      fontSize: 10, fontFace: "Arial", color: C.dark,
      valign: "middle",
      margin: { left: 4, right: 4, top: 0, bottom: 0 }
    });
  });
}

// ════════════════════════════════════════
// Slide 6: 別チャンネルへの流用
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  titleBar(s, "別チャンネルへの流用方法");

  const cards = [
    {
      n: "1", col: C.navy, title: "フォークする",
      lines: [
        "GitHub でリポジトリを開く",
        "「Fork」ボタンをクリック",
        "自分のアカウントへコピー",
      ]
    },
    {
      n: "2", col: C.red, title: "config.txt を差し替え",
      lines: [
        "スプシ・プロンプト Doc を準備",
        "各 /pub URL を取得して",
        "config.txt に貼り付けて保存",
      ]
    },
    {
      n: "3", col: C.green, title: "push して再インストール",
      lines: [
        "変更した config.txt を push",
        "Claude Code でリポジトリを",
        "プラグインとして再追加",
      ]
    },
  ];

  cards.forEach((card, i) => {
    const x = 0.3 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 3.0, h: 3.65,
      fill: { color: C.bg }, shadow: sh()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 3.0, h: 0.58,
      fill: { color: card.col }, line: { color: card.col }
    });
    s.addText(card.n, {
      x, y: 1.05, w: 0.58, h: 0.58,
      fontSize: 22, color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0
    });
    s.addText(card.title, {
      x: x + 0.62, y: 1.05, w: 2.35, h: 0.58,
      fontSize: 13, color: C.white, bold: true,
      valign: "middle", margin: 0
    });
    card.lines.forEach((line, j) => {
      s.addText("▸  " + line, {
        x: x + 0.15, y: 1.75 + j * 0.62, w: 2.72, h: 0.56,
        fontSize: 11, fontFace: "Arial", color: C.dark, margin: 0
      });
    });

    if (i < cards.length - 1) {
      s.addText("→", {
        x: x + 3.02, y: 1.05 + 3.65 / 2 - 0.22,
        w: 0.22, h: 0.44,
        fontSize: 20, color: C.gray, bold: true,
        align: "center", margin: 0
      });
    }
  });

  // 注意書き
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.85, w: 9.4, h: 0.48,
    fill: { color: "FFF3CD" }, line: { color: "FFC107" }
  });
  s.addText("📌  Google Doc は「ファイル → 共有 → ウェブに公開」で発行した /pub URL を使用。/edit・/view の URL は使用不可です。", {
    x: 0.38, y: 4.85, w: 9.2, h: 0.48,
    fontSize: 10, fontFace: "Arial", color: "856404",
    valign: "middle", margin: 0
  });
}

// ════════════════════════════════════════
// Slide 7: まとめ
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: C.red }, line: { color: C.red }
  });

  s.addText("まとめ", {
    x: 0.45, y: 0.35, w: 9.2, h: 0.7,
    fontSize: 28, fontFace: "Arial", color: C.white,
    bold: true, margin: 0
  });

  const points = [
    { icon: "⚡", text: "行番号を伝えるだけで STEP 0〜9 を全自動実行" },
    { icon: "🔧", text: "config.txt の URL を差し替えるだけで別チャンネルに流用可能" },
    { icon: "✅", text: "AI 採点ループで台本品質を 75 点以上に自動担保" },
    { icon: "🔗", text: "github.com/aimaruai5-crypto/youtube-script-shiftai" },
  ];

  points.forEach((p, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y: 1.3 + i * 0.88, w: 0.55, h: 0.55,
      fill: { color: C.red }, line: { color: C.red }
    });
    s.addText(p.icon, {
      x: 0.45, y: 1.3 + i * 0.88, w: 0.55, h: 0.55,
      fontSize: 18, align: "center", valign: "middle", margin: 0
    });
    s.addText(p.text, {
      x: 1.1, y: 1.3 + i * 0.88, w: 8.6, h: 0.55,
      fontSize: 14, fontFace: "Arial", color: C.ice,
      valign: "middle", margin: 0
    });
  });
}

// 出力
pres.writeFile({ fileName: "youtube-script-shiftai-guide.pptx" })
  .then(() => console.log("✅ Done: youtube-script-shiftai-guide.pptx"))
  .catch(e => console.error("❌", e));
