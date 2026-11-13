/* Twinform — bilingual quotation / pro forma invoice generator.
   All document data stays in this browser. No uploads. */
(() => {
  const STORAGE_CURRENT = "twinform.current.v1";
  const STORAGE_DRAFTS = "twinform.drafts.v1";
  const STORAGE_PRO = "twinform.proPreview.v1";
  const STORAGE_UI = "twinform.uiLang.v1";

  const DISCLAIMER = {
    zh: "本文件为报价单或形式发票（quotation / pro forma invoice），不是中国增值税发票，也不是任何税务机关出具或认可的发票。本工具不计算应纳税额，不构成税务或法律建议。单据上的税费行由你自行填写，仅用于展示。所有数据只保存在本机浏览器，不会上传到服务器。",
    en: "This document is a quotation or a pro forma invoice. It is not a China VAT invoice and is not issued or endorsed by any tax authority. This tool does not calculate tax liability and does not constitute tax or legal advice. Any tax line is entered by you and shown for document purposes only. All data stays in this browser and is not uploaded to a server.",
  };

  const CURRENCIES = {
    USD: { symbol: "$", digits: 2 },
    EUR: { symbol: "€", digits: 2 },
    CNY: { symbol: "¥", digits: 2 },
    GBP: { symbol: "£", digits: 2 },
    JPY: { symbol: "¥", digits: 0 },
    HKD: { symbol: "HK$", digits: 2 },
    SGD: { symbol: "S$", digits: 2 },
    AUD: { symbol: "A$", digits: 2 },
    CAD: { symbol: "C$", digits: 2 },
  };

  const TEMPLATES = [
    { id: "classic", zh: "经典", en: "Classic", pro: false },
    { id: "modern", zh: "现代", en: "Modern", pro: true },
    { id: "minimal", zh: "极简", en: "Minimal", pro: true },
  ];

  const I18N = {
    zh: {
      tagline: "双语报价单与形式发票",
      quote: "报价单",
      proforma: "形式发票",
      langZh: "中文",
      langEn: "English",
      langBoth: "中英对照",
      currency: "币种",
      drafts: "草稿",
      saveDraft: "存为草稿",
      exportPdf: "下载 PDF",
      print: "打印 / 另存为 PDF",
      example: "载入示例",
      clear: "清空",
      seller: "卖方信息",
      client: "客户信息",
      items: "明细",
      addItem: "添加一行",
      summary: "汇总",
      payment: "收款信息（由你自行填写）",
      notes: "备注",
      legal: "请先读这一段",
      name: "名称",
      nameEn: "英文名称",
      address: "地址",
      addressEn: "英文地址",
      email: "邮箱",
      phone: "电话",
      website: "网站",
      taxId: "税号 / 登记号（可选，原样打印）",
      logo: "公司 Logo",
      uploadLogo: "上传图片",
      removeLogo: "移除",
      docNo: "单据编号",
      issueDate: "日期",
      validUntil: "有效期至（报价单常用）",
      desc: "描述",
      descEn: "英文描述",
      qty: "数量",
      unit: "单位",
      unitPrice: "单价",
      disc: "折扣 %",
      docDisc: "整单折扣金额（可选）",
      taxEnable: "显示税费行（自行填写，非税务计算）",
      taxName: "税费行名称",
      taxRate: "税率 %（只做乘法，不是报税结果）",
      paypal: "PayPal",
      wise: "Wise",
      payoneer: "Payoneer",
      bank: "银行转账",
      paypalEmail: "PayPal 邮箱",
      wiseId: "Wise 邮箱或账户",
      payoneerId: "Payoneer 邮箱或账户",
      bankName: "银行名称",
      accountName: "账户名",
      accountNo: "账号",
      swift: "SWIFT / BIC",
      bankAddr: "开户行地址",
      payExtra: "其他付款说明",
      proTitle: "Pro 功能",
      proHint: "去水印、多模板、批量导出草稿。购买入口本版尚未开放，不会向任何地址跳转。",
      proPreview: "本地预览 Pro（只为查看效果，不是已购买）",
      buySoon: "购买入口即将开放",
      template: "模板",
      locked: "Pro",
      batch: "批量导出",
      batchHint: "从已存草稿中勾选，依次下载 PDF。免费版此功能锁定。",
      overflow: "内容可能超出一页，请减少行数或备注后再导出。",
      fit: "预览已按窗口缩放，导出仍为 A4。",
      saved: "已自动保存到本机",
      draftName: "草稿名称",
      load: "打开",
      del: "删除",
      close: "关闭",
      noDrafts: "还没有已存草稿。",
      watermark: "Twinform Free",
      notVat: "非增值税发票 · Not a VAT invoice",
      billFrom: "卖方 / From",
      billTo: "客户 / To",
      paymentTitle: "付款方式 / Payment",
      notesTitle: "备注 / Notes",
      subtotal: "小计 / Subtotal",
      discount: "折扣 / Discount",
      total: "合计 / Total",
      amount: "金额",
    },
    en: {
      tagline: "Bilingual quotes & pro forma invoices",
      quote: "Quotation",
      proforma: "Pro Forma Invoice",
      langZh: "中文",
      langEn: "English",
      langBoth: "Bilingual",
      currency: "Currency",
      drafts: "Drafts",
      saveDraft: "Save draft",
      exportPdf: "Download PDF",
      print: "Print / Save as PDF",
      example: "Load example",
      clear: "Reset",
      seller: "From",
      client: "Bill to",
      items: "Line items",
      addItem: "Add line",
      summary: "Summary",
      payment: "Payment details (entered by you)",
      notes: "Notes",
      legal: "Please read this first",
      name: "Name",
      nameEn: "Name in English",
      address: "Address",
      addressEn: "Address in English",
      email: "Email",
      phone: "Phone",
      website: "Website",
      taxId: "Tax / registration ID (optional, printed as-is)",
      logo: "Logo",
      uploadLogo: "Upload image",
      removeLogo: "Remove",
      docNo: "Document no.",
      issueDate: "Date",
      validUntil: "Valid until (typical for quotes)",
      desc: "Description",
      descEn: "Description in English",
      qty: "Qty",
      unit: "Unit",
      unitPrice: "Unit price",
      disc: "Disc. %",
      docDisc: "Document discount amount (optional)",
      taxEnable: "Show a tax line (you fill it in; not tax advice)",
      taxName: "Tax line label",
      taxRate: "Rate % (simple multiplication only, not a tax filing)",
      paypal: "PayPal",
      wise: "Wise",
      payoneer: "Payoneer",
      bank: "Bank transfer",
      paypalEmail: "PayPal email",
      wiseId: "Wise email or account",
      payoneerId: "Payoneer email or account",
      bankName: "Bank name",
      accountName: "Account name",
      accountNo: "Account number",
      swift: "SWIFT / BIC",
      bankAddr: "Bank address",
      payExtra: "Other payment notes",
      proTitle: "Pro features",
      proHint: "No watermark, extra templates, and batch export. The purchase entry is not open in this build and does not go to any checkout URL.",
      proPreview: "Preview Pro locally (for review only; not a purchase)",
      buySoon: "Purchase link coming soon",
      template: "Template",
      locked: "Pro",
      batch: "Batch export",
      batchHint: "Pick saved drafts and download PDFs one by one. Locked on the free plan.",
      overflow: "Content may overflow one page. Shorten the document before exporting.",
      fit: "Preview is scaled to the window; the export stays A4.",
      saved: "Saved locally in this browser",
      draftName: "Draft name",
      load: "Open",
      del: "Delete",
      close: "Close",
      noDrafts: "No saved drafts yet.",
      watermark: "Twinform Free",
      notVat: "Not a VAT invoice · 非增值税发票",
      billFrom: "From / 卖方",
      billTo: "To / 客户",
      paymentTitle: "Payment / 付款方式",
      notesTitle: "Notes / 备注",
      subtotal: "Subtotal / 小计",
      discount: "Discount / 折扣",
      total: "Total / 合计",
      amount: "Amount",
    },
  };

  const uid = () =>
    crypto.randomUUID ? crypto.randomUUID() : "id-" + Math.random().toString(36).slice(2, 10);

  const todayISO = () => new Date().toISOString().slice(0, 10);

  function emptyItem() {
    return { id: uid(), desc: "", descEn: "", qty: 1, unit: "", unitPrice: 0, discountPct: 0 };
  }

  function defaultState() {
    return {
      docType: "quote",
      langMode: "both",
      currency: "USD",
      template: "classic",
      number: "Q-2026-001",
      issueDate: todayISO(),
      validUntil: "",
      seller: {
        name: "",
        nameEn: "",
        address: "",
        addressEn: "",
        email: "",
        phone: "",
        website: "",
        taxId: "",
        logo: "",
      },
      client: { name: "", nameEn: "", address: "", addressEn: "", email: "", phone: "" },
      items: [emptyItem()],
      docDiscount: 0,
      taxEnabled: false,
      taxName: "",
      taxRate: 0,
      payment: {
        paypal: false,
        wise: false,
        payoneer: false,
        bank: false,
        paypalEmail: "",
        wiseId: "",
        payoneerId: "",
        bankName: "",
        accountName: "",
        accountNo: "",
        swift: "",
        bankAddr: "",
        extra: "",
      },
      notes: "",
    };
  }

  function exampleState() {
    const s = defaultState();
    s.number = "Q-2026-018";
    s.issueDate = "2026-11-13";
    s.validUntil = "2026-11-27";
    s.seller = {
      name: "北林工作室",
      nameEn: "Northwood Studio",
      address: "四川省成都市示例路 88 号（虚构地址）",
      addressEn: "88 Example Road, Chengdu, Sichuan, China (fictional)",
      email: "hello@northwood.example",
      phone: "+86 138 0000 0000",
      website: "https://northwood.example",
      taxId: "",
      logo: "assets/sample-logo.png",
    };
    s.client = {
      name: "Harbor & Co.",
      nameEn: "Harbor & Co.",
      address: "",
      addressEn: "120 Market Street, Suite 4, Seattle, WA, USA (fictional)",
      email: "projects@harbor.example",
      phone: "",
    };
    s.items = [
      {
        id: uid(),
        desc: "响应式营销网站设计与前端实现",
        descEn: "Responsive marketing website design and front-end build",
        qty: 1,
        unit: "项 / project",
        unitPrice: 2800,
        discountPct: 0,
      },
      {
        id: uid(),
        desc: "内容迁移与基础 SEO 设置（4 周）",
        descEn: "Content migration and baseline SEO setup (4 weeks)",
        qty: 4,
        unit: "周 / week",
        unitPrice: 320,
        discountPct: 10,
      },
    ];
    s.docDiscount = 0;
    s.taxEnabled = false;
    s.payment = {
      paypal: true,
      wise: true,
      payoneer: false,
      bank: true,
      paypalEmail: "payments@northwood.example  （示例）",
      wiseId: "northwood@example.com  （示例）",
      payoneerId: "",
      bankName: "Example Bank (fictional / 虚构示例)",
      accountName: "Northwood Studio",
      accountNo: "0000 0000 0000",
      swift: "EXAMPLED",
      bankAddr: "Chengdu, China",
      extra: "Please use the document number Q-2026-018 as the payment reference.\n请在汇款备注中填写本单据编号。以上收款信息均为虚构示例。",
    };
    s.notes =
      "工作在收到 40% 预付款后开始，验收后支付余款。本报价有效期至 2026-11-27。\nWork starts after a 40% deposit; the balance is due on acceptance. This quotation is valid until 27 Nov 2026.";
    return s;
  }

  let uiLang = localStorage.getItem(STORAGE_UI) || "zh";
  let proPreview = localStorage.getItem(STORAGE_PRO) === "1";
  let state = loadCurrent() || defaultState();
  let modal = null;
  let overflow = false;

  function isPro() {
    return proPreview === true;
  }

  function t(key) {
    return (I18N[uiLang] || I18N.zh)[key] || key;
  }

  function money(n) {
    const cfg = CURRENCIES[state.currency] || CURRENCIES.USD;
    const num = Number(n);
    const safe = Number.isFinite(num) ? num : 0;
    const formatted = safe.toLocaleString("en-US", {
      minimumFractionDigits: cfg.digits,
      maximumFractionDigits: cfg.digits,
    });
    return `${cfg.symbol}${formatted}`;
  }

  function lineAmount(item) {
    const qty = Number(item.qty) || 0;
    const price = Number(item.unitPrice) || 0;
    const disc = Math.min(100, Math.max(0, Number(item.discountPct) || 0));
    return qty * price * (1 - disc / 100);
  }

  function totals() {
    const subtotal = state.items.reduce((s, it) => s + lineAmount(it), 0);
    const discount = Math.max(0, Number(state.docDiscount) || 0);
    const base = Math.max(0, subtotal - discount);
    const rate = state.taxEnabled ? Math.max(0, Number(state.taxRate) || 0) : 0;
    const tax = state.taxEnabled ? base * (rate / 100) : 0;
    return { subtotal, discount, tax, total: base + tax, base };
  }

  function loadCurrent() {
    try {
      const raw = localStorage.getItem(STORAGE_CURRENT);
      if (!raw) return null;
      return migrate(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  function migrate(s) {
    const d = defaultState();
    return {
      ...d,
      ...s,
      seller: { ...d.seller, ...(s.seller || {}) },
      client: { ...d.client, ...(s.client || {}) },
      payment: { ...d.payment, ...(s.payment || {}) },
      items: Array.isArray(s.items) && s.items.length ? s.items : d.items,
    };
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_CURRENT, JSON.stringify(state));
    } catch (err) {
      console.warn("Twinform could not save to localStorage", err);
    }
  }

  let saveTimer = null;
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 300);
  }

  function listDrafts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_DRAFTS) || "[]");
    } catch {
      return [];
    }
  }

  function writeDrafts(list) {
    localStorage.setItem(STORAGE_DRAFTS, JSON.stringify(list));
  }

  function langText(zh, en) {
    if (state.langMode === "zh") return zh || en || "";
    if (state.langMode === "en") return en || zh || "";
    if (zh && en && zh !== en) return { zh, en };
    return zh || en || "";
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function nl(str) {
    return escapeHtml(str).replace(/\n/g, "<br>");
  }

  function renderLabel(zh, en) {
    const v = langText(zh, en);
    if (v && typeof v === "object") {
      return `${escapeHtml(v.zh)} <span class="item-en">${escapeHtml(v.en)}</span>`;
    }
    return escapeHtml(v);
  }

  function docTitle() {
    if (state.docType === "proforma") {
      return langText("形式发票", "Pro Forma Invoice");
    }
    return langText("报价单", "Quotation");
  }

  function titleHtml() {
    const v = docTitle();
    if (v && typeof v === "object") {
      return `${escapeHtml(v.zh)}<span class="item-en">${escapeHtml(v.en)}</span>`;
    }
    return escapeHtml(v);
  }

  /* ---------- render ---------- */
  function render() {
    const app = document.getElementById("app");
    const tot = totals();
    const pro = isPro();
    const effectiveTemplate = !pro && state.template !== "classic" ? "classic" : state.template;

    app.innerHTML = `
      <header class="app-header">
        <a class="brand" href="./">
          <img src="assets/logo.svg" alt="Twinform" />
          <span class="brand-name">Twinform<small>${escapeHtml(t("tagline"))}</small></span>
        </a>
        <div class="header-group">
          <div class="seg" data-field="docType">
            <button type="button" data-value="quote" aria-pressed="${state.docType === "quote"}">${t("quote")}</button>
            <button type="button" data-value="proforma" aria-pressed="${state.docType === "proforma"}">${t("proforma")}</button>
          </div>
          <div class="seg" data-field="langMode">
            <button type="button" data-value="zh" aria-pressed="${state.langMode === "zh"}">${t("langZh")}</button>
            <button type="button" data-value="en" aria-pressed="${state.langMode === "en"}">${t("langEn")}</button>
            <button type="button" data-value="both" aria-pressed="${state.langMode === "both"}">${t("langBoth")}</button>
          </div>
          <label class="field-inline">${t("currency")}
            <select data-bind="currency">${Object.keys(CURRENCIES)
              .map((c) => `<option value="${c}" ${state.currency === c ? "selected" : ""}>${c}</option>`)
              .join("")}</select>
          </label>
          <span class="pill ${pro ? "" : "free"}">${pro ? "Pro 预览" : "Free"}</span>
        </div>
        <div class="header-actions">
          <div class="seg" data-ui-lang>
            <button type="button" data-ui="zh" aria-pressed="${uiLang === "zh"}">界面中文</button>
            <button type="button" data-ui="en" aria-pressed="${uiLang === "en"}">UI English</button>
          </div>
          <button class="btn" data-action="example">${t("example")}</button>
          <button class="btn" data-action="drafts">${t("drafts")}</button>
          <button class="btn" data-action="print">${t("print")}</button>
          <button class="btn btn-primary" data-action="pdf">${t("exportPdf")}</button>
        </div>
      </header>
      <div class="layout">
        <aside class="editor">
          <div class="disclaimer-banner">
            <strong>${t("legal")}</strong>
            ${uiLang === "en" ? escapeHtml(DISCLAIMER.en) : escapeHtml(DISCLAIMER.zh)}
          </div>
          ${renderForm(tot, pro, effectiveTemplate)}
        </aside>
        <main class="preview-pane">
          <div class="preview-toolbar">
            <span>${t("fit")}</span>
            <span class="overflow-warn" data-overflow style="display:none">${t("overflow")}</span>
          </div>
          <div class="preview-scale" id="previewScale">
            ${renderSheet(tot, pro, effectiveTemplate)}
          </div>
        </main>
      </div>
      ${modalHtml()}
    `;
    bind();
    scalePreview();
    checkOverflow();
    document.documentElement.lang = uiLang === "en" ? "en" : "zh-CN";
  }

  function field(label, bind, opts = {}) {
    const { type = "text", placeholder = "", span = "" } = opts;
    const [root, key] = splitBind(bind);
    const val = key ? (root === "state" ? state[key] : state[root][key]) : "";
    if (type === "textarea") {
      return `<label class="lbl ${span}"><span>${label}</span><textarea data-bind="${bind}" placeholder="${escapeHtml(
        placeholder
      )}">${escapeHtml(val)}</textarea></label>`;
    }
    return `<label class="lbl ${span}"><span>${label}</span><input type="${type}" data-bind="${bind}" value="${escapeHtml(
      val
    )}" placeholder="${escapeHtml(placeholder)}"></label>`;
  }

  function splitBind(bind) {
    const i = bind.indexOf(".");
    if (i < 0) return ["state", bind];
    return [bind.slice(0, i), bind.slice(i + 1)];
  }

  function renderForm(tot, pro, effectiveTemplate) {
    const p = state.payment;
    return `
      <div class="section">
        <h2>${t("seller")}</h2>
        <div class="logo-row">
          ${
            state.seller.logo
              ? `<img src="${escapeHtml(state.seller.logo)}" alt="Logo">`
              : `<div class="logo-placeholder">${t("logo")}</div>`
          }
          <div>
            <button class="btn" data-action="upload-logo">${t("uploadLogo")}</button>
            ${state.seller.logo ? `<button class="btn btn-ghost" data-action="remove-logo">${t("removeLogo")}</button>` : ""}
            <p class="hint">PNG / JPG / SVG，将压缩后保存在本机。</p>
            <input type="file" accept="image/*" data-logo-file hidden>
          </div>
        </div>
        <div class="grid-2" style="margin-top:8px">
          ${field(t("name"), "seller.name")}
          ${field(t("nameEn"), "seller.nameEn")}
          ${field(t("address"), "seller.address", { type: "textarea", span: "full" })}
          ${field(t("addressEn"), "seller.addressEn", { type: "textarea", span: "full" })}
          ${field(t("email"), "seller.email", { type: "email" })}
          ${field(t("phone"), "seller.phone")}
          ${field(t("website"), "seller.website")}
          ${field(t("taxId"), "seller.taxId")}
        </div>
      </div>
      <div class="section">
        <h2>${t("client")}</h2>
        <div class="grid-2">
          ${field(t("name"), "client.name")}
          ${field(t("nameEn"), "client.nameEn")}
          ${field(t("address"), "client.address", { type: "textarea", span: "full" })}
          ${field(t("addressEn"), "client.addressEn", { type: "textarea", span: "full" })}
          ${field(t("email"), "client.email", { type: "email" })}
          ${field(t("phone"), "client.phone")}
        </div>
      </div>
      <div class="section">
        <h2>${state.docType === "quote" ? t("quote") : t("proforma")}</h2>
        <div class="grid-3">
          ${field(t("docNo"), "number")}
          ${field(t("issueDate"), "issueDate", { type: "date" })}
          ${field(t("validUntil"), "validUntil", { type: "date" })}
        </div>
      </div>
      <div class="section">
        <h2>${t("items")} <button class="btn" data-action="add-item">${t("addItem")}</button></h2>
        <table class="items-table">
          <thead><tr>
            <th>${t("desc")}</th><th class="col-qty">${t("qty")}</th>
            <th class="col-price">${t("unitPrice")}</th><th class="col-disc">${t("disc")}</th><th class="col-del"></th>
          </tr></thead>
          <tbody>
            ${state.items
              .map(
                (it, i) => `
              <tr>
                <td>
                  <input data-item="${i}" data-k="desc" value="${escapeHtml(it.desc)}" placeholder="${escapeHtml(t("desc"))}">
                  <input data-item="${i}" data-k="descEn" value="${escapeHtml(it.descEn)}" placeholder="${escapeHtml(t("descEn"))}" style="margin-top:4px">
                  <input data-item="${i}" data-k="unit" value="${escapeHtml(it.unit)}" placeholder="${escapeHtml(t("unit"))}" style="margin-top:4px">
                </td>
                <td class="col-qty"><input type="number" min="0" step="any" data-item="${i}" data-k="qty" value="${escapeHtml(it.qty)}"></td>
                <td class="col-price"><input type="number" min="0" step="any" data-item="${i}" data-k="unitPrice" value="${escapeHtml(it.unitPrice)}"></td>
                <td class="col-disc"><input type="number" min="0" max="100" step="any" data-item="${i}" data-k="discountPct" value="${escapeHtml(it.discountPct)}"></td>
                <td class="col-del"><button class="icon-btn" data-action="del-item" data-i="${i}" aria-label="Remove">×</button></td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="section">
        <h2>${t("summary")}</h2>
        <div class="grid-2">
          ${field(t("docDisc"), "docDiscount", { type: "number" })}
        </div>
        <label class="check" style="margin:8px 0"><input type="checkbox" data-bind="taxEnabled" ${state.taxEnabled ? "checked" : ""}> ${t("taxEnable")}</label>
        ${
          state.taxEnabled
            ? `<div class="grid-2">${field(t("taxName"), "taxName", { placeholder: uiLang === "en" ? "e.g. VAT (if applicable)" : "例如 VAT（如适用）" })}${field(t("taxRate"), "taxRate", { type: "number" })}</div>`
            : ""
        }
        <p class="hint">${t("subtotal")}: ${money(tot.subtotal)} · ${t("total")}: ${money(tot.total)}</p>
      </div>
      <div class="section">
        <h2>${t("payment")}</h2>
        <div class="pay-block">
          <label class="check"><input type="checkbox" data-bind="payment.paypal" ${p.paypal ? "checked" : ""}> ${t("paypal")}</label>
          ${p.paypal ? field(t("paypalEmail"), "payment.paypalEmail") : ""}
          <label class="check"><input type="checkbox" data-bind="payment.wise" ${p.wise ? "checked" : ""}> ${t("wise")}</label>
          ${p.wise ? field(t("wiseId"), "payment.wiseId") : ""}
          <label class="check"><input type="checkbox" data-bind="payment.payoneer" ${p.payoneer ? "checked" : ""}> ${t("payoneer")}</label>
          ${p.payoneer ? field(t("payoneerId"), "payment.payoneerId") : ""}
          <label class="check"><input type="checkbox" data-bind="payment.bank" ${p.bank ? "checked" : ""}> ${t("bank")}</label>
          ${
            p.bank
              ? `<div class="grid-2">${field(t("bankName"), "payment.bankName")}${field(t("accountName"), "payment.accountName")}${field(t("accountNo"), "payment.accountNo")}${field(t("swift"), "payment.swift")}${field(t("bankAddr"), "payment.bankAddr", { span: "full" })}</div>`
              : ""
          }
          ${field(t("payExtra"), "payment.extra", { type: "textarea", span: "full" })}
        </div>
      </div>
      <div class="section">
        <h2>${t("notes")}</h2>
        ${field(t("notes"), "notes", { type: "textarea", span: "full" })}
      </div>
      <div class="section pro-box">
        <h3>${t("proTitle")}</h3>
        <p class="hint">${t("proHint")}</p>
        <label class="check"><input type="checkbox" data-action="pro-preview" ${pro ? "checked" : ""}> ${t("proPreview")}</label>
        <div style="margin:10px 0 8px">
          <span class="lock">${t("template")}</span>
          <div class="seg" data-field="template" style="margin-left:8px">
            ${TEMPLATES.map((tpl) => {
              const locked = tpl.pro && !pro;
              return `<button type="button" data-value="${tpl.id}" aria-pressed="${effectiveTemplate === tpl.id}" ${locked ? "disabled" : ""}>${uiLang === "en" ? tpl.en : tpl.zh}${tpl.pro ? " · " + t("locked") : ""}</button>`;
            }).join("")}
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
          <button class="btn" data-action="batch" ${pro ? "" : "disabled"}>${t("batch")}</button>
          <button class="btn-pro" type="button" data-action="buy" disabled>${t("buySoon")}</button>
        </div>
        <p class="hint">${t("batchHint")}</p>
      </div>
      <p class="muted">${t("saved")}</p>
    `;
  }

  function partyHtml(person, modeFrom) {
    const name = langText(person.name, person.nameEn);
    const addr = langText(person.address, person.addressEn);
    let nameHtml = "";
    if (name && typeof name === "object") {
      nameHtml = `<div class="name">${escapeHtml(name.zh)}</div><div class="en">${escapeHtml(name.en)}</div>`;
    } else {
      nameHtml = `<div class="name">${escapeHtml(name)}</div>`;
    }
    let addrHtml = "";
    if (addr && typeof addr === "object") {
      addrHtml = `<div class="addr">${nl(addr.zh)}<br>${nl(addr.en)}</div>`;
    } else if (addr) {
      addrHtml = `<div class="addr">${nl(addr)}</div>`;
    }
    const bits = [person.email, person.phone, person.website, person.taxId].filter(Boolean);
    return `
      <div class="party">
        <div class="k">${modeFrom === "billFrom" ? labelPlain("卖方", "From") : labelPlain("客户", "To")}</div>
        ${nameHtml}
        ${addrHtml}
        ${bits.length ? `<div class="addr">${bits.map(escapeHtml).join("<br>")}</div>` : ""}
      </div>`;
  }

  function paymentHtml() {
    const p = state.payment;
    const lines = [];
    if (p.paypal && p.paypalEmail) lines.push(`PayPal: ${p.paypalEmail}`);
    if (p.wise && p.wiseId) lines.push(`Wise: ${p.wiseId}`);
    if (p.payoneer && p.payoneerId) lines.push(`Payoneer: ${p.payoneerId}`);
    if (p.bank) {
      const bankLines = [
        p.bankName && `${labelPlainRaw("银行", "Bank")}: ${p.bankName}`,
        p.accountName && `${labelPlainRaw("账户名", "Account name")}: ${p.accountName}`,
        p.accountNo && `${labelPlainRaw("账号", "Account no.")}: ${p.accountNo}`,
        p.swift && `SWIFT / BIC: ${p.swift}`,
        p.bankAddr,
      ].filter(Boolean);
      if (bankLines.length) lines.push(bankLines.join("\n"));
    }
    if (p.extra) lines.push(p.extra);
    if (!lines.length) return "";
    return `<div><h3>${t("paymentTitle")}</h3><p>${nl(lines.join("\n\n"))}</p></div>`;
  }

  function renderSheet(tot, pro, effectiveTemplate) {
    const taxLabel =
      state.taxName ||
      (state.langMode === "en" ? "Tax (entered by seller)" : state.langMode === "zh" ? "税费（由卖方自行填写）" : "税费 / Tax (entered by seller)");
    const watermark = pro
      ? ""
      : `<div class="sheet-wm"><div class="wm-diag">${t("watermark")}</div><div class="wm-foot">${t("watermark")}</div></div>`;
    const logo = state.seller.logo
      ? `<img class="sheet-logo" src="${escapeHtml(state.seller.logo)}" alt="">`
      : "";
    const metaBits = [
      metaLine("编号", "No.", state.number || "—"),
      metaLine("日期", "Date", state.issueDate || "—"),
    ];
    if (state.validUntil) metaBits.push(metaLine("有效期至", "Valid until", state.validUntil));
    metaBits.push(metaLine("币种", "Currency", state.currency));

    const headInner = `
        ${logo}
        <div class="sheet-title">
          <h1>${titleHtml()}</h1>
          <div class="sub">${escapeHtml(notVatLine())}</div>
          <div class="sheet-meta">${metaBits.map(escapeHtml).join("<br>")}</div>
        </div>`;

    const isModern = effectiveTemplate === "modern";
    const items = state.items
      .map((it) => {
        const desc = renderLabel(it.desc, it.descEn);
        const unit = it.unit ? ` <span class="item-en">${escapeHtml(it.unit)}</span>` : "";
        return `<tr>
          <td>${desc}${unit}</td>
          <td class="num">${escapeHtml(it.qty)}</td>
          <td class="num">${money(it.unitPrice)}</td>
          <td class="num">${Number(it.discountPct) ? Number(it.discountPct) + "%" : "—"}</td>
          <td class="num">${money(lineAmount(it))}</td>
        </tr>`;
      })
      .join("");

    const discRow =
      tot.discount > 0
        ? `<div class="row"><span>${labelPlain("折扣", "Discount")}</span><span>− ${money(tot.discount)}</span></div>`
        : "";
    const taxRow = state.taxEnabled
      ? `<div class="row"><span>${escapeHtml(taxLabel)}${state.taxRate ? " " + state.taxRate + "%" : ""}</span><span>${money(tot.tax)}</span></div>`
      : "";

    const notes = state.notes
      ? `<div class="notes"><h3>${t("notesTitle")}</h3><p>${nl(state.notes)}</p></div>`
      : "";

    const discBlock =
      state.langMode === "both"
        ? `<div class="sheet-disc">${escapeHtml(DISCLAIMER.zh)}<br><br>${escapeHtml(DISCLAIMER.en)}</div>`
        : `<div class="sheet-disc">${escapeHtml(state.langMode === "en" ? DISCLAIMER.en : DISCLAIMER.zh)}</div>`;

    const body = `
        <div class="parties">
          ${partyHtml(state.seller, "billFrom")}
          ${partyHtml(state.client, "billTo")}
        </div>
        <table>
          <thead>
            <tr>
              <th>${labelPlain("描述", "Description")}</th>
              <th class="num">${labelPlain("数量", "Qty")}</th>
              <th class="num">${labelPlain("单价", "Unit")}</th>
              <th class="num">${labelPlain("折扣", "Disc.")}</th>
              <th class="num">${labelPlain("金额", "Amount")}</th>
            </tr>
          </thead>
          <tbody>${items}</tbody>
        </table>
        <div class="totals">
          <div class="row"><span>${labelPlain("小计", "Subtotal")}</span><span>${money(tot.subtotal)}</span></div>
          ${discRow}
          ${taxRow}
          <div class="row grand"><span>${labelPlain("合计", "Total")}</span><span>${state.currency} ${money(tot.total)}</span></div>
        </div>
        <div class="pay">
          ${paymentHtml()}
          ${notes}
        </div>
        ${discBlock}
    `;

    if (isModern) {
      return `<article class="sheet tpl-modern" id="sheet">${watermark}
        <div class="modern-bar">${headInner}</div>
        <div class="sheet-body">${body}</div>
      </article>`;
    }
    return `<article class="sheet tpl-${escapeHtml(effectiveTemplate)}" id="sheet">${watermark}
      <div class="sheet-head">${headInner}</div>
      ${body}
    </article>`;
  }

  function labelPlain(zh, en) {
    if (state.langMode === "zh") return escapeHtml(zh);
    if (state.langMode === "en") return escapeHtml(en);
    return `${escapeHtml(zh)} / ${escapeHtml(en)}`;
  }

  function metaLine(zh, en, value) {
    return `${labelPlainRaw(zh, en)}: ${value}`;
  }

  function labelPlainRaw(zh, en) {
    if (state.langMode === "zh") return zh;
    if (state.langMode === "en") return en;
    return `${zh} / ${en}`;
  }

  function notVatLine() {
    if (state.langMode === "en") return "Not a VAT invoice";
    if (state.langMode === "zh") return "非增值税发票";
    return "非增值税发票 · Not a VAT invoice";
  }

  function modalHtml() {
    if (!modal) return "";
    if (modal === "drafts" || modal === "batch") {
      const drafts = listDrafts();
      const isBatch = modal === "batch";
      return `<div class="modal-back" data-close-modal>
        <div class="modal" role="dialog" aria-modal="true">
          <h2>${isBatch ? t("batch") : t("drafts")}</h2>
          ${isBatch ? `<p class="hint">${t("batchHint")}</p>` : ""}
          ${
            drafts.length === 0
              ? `<p class="muted">${t("noDrafts")}</p>`
              : `<ul class="draft-list">${drafts
                  .map(
                    (d) => `<li>
                    ${isBatch ? `<input type="checkbox" data-draft-check="${escapeHtml(d.id)}" checked>` : ""}
                    <span><strong>${escapeHtml(d.name)}</strong><div class="muted">${escapeHtml(d.updatedAt || "")}</div></span>
                    ${
                      isBatch
                        ? ""
                        : `<button class="btn" data-action="load-draft" data-id="${escapeHtml(d.id)}">${t("load")}</button>
                           <button class="btn btn-ghost" data-action="del-draft" data-id="${escapeHtml(d.id)}">${t("del")}</button>`
                    }
                  </li>`
                  )
                  .join("")}</ul>`
          }
          ${
            !isBatch
              ? `<div class="grid-2" style="margin-top:12px">${field(t("draftName"), "_draftName")}<div style="align-self:end"><button class="btn btn-primary" data-action="save-draft">${t("saveDraft")}</button></div></div>`
              : `<div style="margin-top:12px"><button class="btn btn-primary" data-action="run-batch">${t("exportPdf")}</button></div>`
          }
          <div style="margin-top:12px"><button class="btn" data-close-modal>${t("close")}</button></div>
        </div>
      </div>`;
    }
    return "";
  }

  /* bind + preview */
  function getBindValue(el) {
    if (el.type === "checkbox") return el.checked;
    if (el.type === "number") return el.value === "" ? 0 : el.value;
    return el.value;
  }

  function setBind(path, value) {
    const [root, key] = splitBind(path);
    if (!key) return;
    if (root === "state") state[key] = value;
    else state[root][key] = value;
  }

  function bind() {
    const app = document.getElementById("app");

    app.querySelectorAll("[data-field] button[data-value]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const field = btn.parentElement.getAttribute("data-field");
        const value = btn.getAttribute("data-value");
        if (field === "template" && value !== "classic" && !isPro()) return;
        if (field === "docType" && !state.numberManual) {
          const wasDefault = /^Q-\d{4}-/.test(state.number) || /^PF-\d{4}-/.test(state.number);
          state.docType = value;
          if (wasDefault) {
            const y = new Date().getFullYear();
            state.number = (value === "proforma" ? "PF-" : "Q-") + y + "-001";
          }
        } else {
          state[field] = value;
        }
        persistAndRender();
      });
    });

    app.querySelectorAll("[data-ui-lang] button").forEach((btn) => {
      btn.addEventListener("click", () => {
        uiLang = btn.getAttribute("data-ui");
        localStorage.setItem(STORAGE_UI, uiLang);
        render();
      });
    });

    app.querySelectorAll("[data-bind]").forEach((el) => {
      const ev = el.type === "checkbox" ? "change" : "input";
      el.addEventListener(ev, () => {
        const path = el.getAttribute("data-bind");
        if (path === "_draftName") return;
        setBind(path, getBindValue(el));
        if (path === "number") state.numberManual = true;
        scheduleSave();
        refreshPreviewOnly();
        if (path === "taxEnabled" || path.startsWith("payment.")) render();
      });
    });

    app.querySelectorAll("[data-item]").forEach((el) => {
      el.addEventListener("input", () => {
        const i = Number(el.getAttribute("data-item"));
        const k = el.getAttribute("data-k");
        let v = el.value;
        if (k === "qty" || k === "unitPrice" || k === "discountPct") v = el.value;
        state.items[i][k] = v;
        scheduleSave();
        refreshPreviewOnly();
      });
    });

    app.querySelectorAll("[data-action]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const action = el.getAttribute("data-action");
        if (action === "add-item") {
          state.items.push(emptyItem());
          persistAndRender();
        } else if (action === "del-item") {
          const i = Number(el.getAttribute("data-i"));
          state.items.splice(i, 1);
          if (!state.items.length) state.items.push(emptyItem());
          persistAndRender();
        } else if (action === "example") {
          if (confirm(uiLang === "en" ? "Replace the current form with the fictional example?" : "用虚构示例替换当前内容？")) {
            state = exampleState();
            persistAndRender();
          }
        } else if (action === "drafts") {
          modal = "drafts";
          render();
        } else if (action === "batch") {
          if (!isPro()) return;
          modal = "batch";
          render();
        } else if (action === "print") {
          scalePreview(true);
          window.print();
          scalePreview();
        } else if (action === "pdf") {
          downloadPdf();
        } else if (action === "upload-logo") {
          app.querySelector("[data-logo-file]").click();
        } else if (action === "remove-logo") {
          state.seller.logo = "";
          persistAndRender();
        } else if (action === "pro-preview") {
          proPreview = el.checked;
          localStorage.setItem(STORAGE_PRO, proPreview ? "1" : "0");
          if (!proPreview && state.template !== "classic") state.template = "classic";
          persistAndRender();
        } else if (action === "buy") {
          e.preventDefault();
        } else if (action === "save-draft") {
          const input = app.querySelector("[data-bind='_draftName']");
          const name = (input && input.value.trim()) || defaultDraftName();
          const drafts = listDrafts();
          drafts.unshift({ id: uid(), name, updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "), data: structuredClone(state) });
          writeDrafts(drafts.slice(0, 50));
          modal = "drafts";
          render();
        } else if (action === "load-draft") {
          const d = listDrafts().find((x) => x.id === el.getAttribute("data-id"));
          if (d) {
            state = migrate(d.data);
            modal = null;
            persistAndRender();
          }
        } else if (action === "del-draft") {
          writeDrafts(listDrafts().filter((x) => x.id !== el.getAttribute("data-id")));
          render();
        } else if (action === "run-batch") {
          const ids = [...app.querySelectorAll("[data-draft-check]:checked")].map((x) => x.getAttribute("data-draft-check"));
          runBatch(ids);
        }
      });
    });

    const file = app.querySelector("[data-logo-file]");
    if (file) {
      file.addEventListener("change", async () => {
        const f = file.files && file.files[0];
        if (!f) return;
        state.seller.logo = await resizeImage(f);
        persistAndRender();
      });
    }

    app.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target === el || el.hasAttribute("data-close-modal") && el.tagName === "BUTTON") {
          modal = null;
          render();
        }
      });
    });
  }

  function defaultDraftName() {
    const title = state.docType === "proforma" ? "PF" : "Q";
    return `${title} ${state.number || ""} ${state.client.name || state.client.nameEn || ""}`.trim();
  }

  function persistAndRender() {
    persist();
    render();
  }

  function refreshPreviewOnly() {
    const tot = totals();
    const pro = isPro();
    const effectiveTemplate = !pro && state.template !== "classic" ? "classic" : state.template;
    const wrap = document.getElementById("previewScale");
    if (!wrap) return;
    wrap.innerHTML = renderSheet(tot, pro, effectiveTemplate);
    scalePreview();
    checkOverflow();
  }

  function scalePreview(reset) {
    const box = document.querySelector(".preview-pane");
    const scaleEl = document.getElementById("previewScale");
    const sheet = document.getElementById("sheet");
    if (!box || !scaleEl || !sheet) return;
    if (reset) {
      scaleEl.style.transform = "none";
      return;
    }
    const avail = box.clientWidth - 32;
    const width = sheet.offsetWidth;
    const s = Math.min(1, avail / width);
    scaleEl.style.transform = s < 0.999 ? `scale(${s})` : "none";
    scaleEl.style.height = s < 0.999 ? sheet.offsetHeight * s + "px" : "auto";
  }

  function checkOverflow() {
    const sheet = document.getElementById("sheet");
    const warn = document.querySelector("[data-overflow]");
    if (!sheet || !warn) return;
    const max = mmToPx(297) + 2;
    overflow = sheet.scrollHeight > max + 8;
    warn.style.display = overflow ? "inline" : "none";
  }

  function mmToPx(mm) {
    return (mm / 25.4) * 96;
  }

  async function resizeImage(file) {
    const url = await readFile(file);
    if (file.type === "image/svg+xml") return url;
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const max = 640;
        let w = img.width;
        let h = img.height;
        if (w > max || h > max) {
          const r = Math.min(max / w, max / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/png"));
      };
      img.src = url;
    });
  }

  function readFile(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function fileBase() {
    const kind = state.docType === "proforma" ? "ProForma" : "Quotation";
    const no = (state.number || "draft").replace(/[^\w.-]+/g, "_");
    return `Twinform-${kind}-${no}`;
  }

  async function waitFonts() {
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch {
        /* ignore */
      }
    }
  }

  async function downloadPdf(customName) {
    await waitFonts();
    const sheet = document.getElementById("sheet");
    if (!sheet || !window.html2canvas) {
      alert("PDF library failed to load.");
      return;
    }
    const canvas = await html2canvas(sheet, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: sheet.offsetWidth,
      height: sheet.offsetHeight,
      windowWidth: sheet.offsetWidth,
      windowHeight: sheet.offsetHeight,
    });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = 210;
    const pageH = 297;
    const imgW = pageW;
    const imgH = (canvas.height / canvas.width) * pageW;
    const img = canvas.toDataURL("image/jpeg", 0.95);
    let remaining = imgH;
    let offset = 0;
    let page = 0;
    while (remaining > 0.5) {
      if (page > 0) pdf.addPage();
      pdf.addImage(img, "JPEG", 0, -offset, imgW, imgH);
      remaining -= pageH;
      offset += pageH;
      page += 1;
      if (page > 8) break;
    }
    const name = (customName || fileBase()) + ".pdf";
    pdf.save(name);
    return name;
  }

  async function runBatch(ids) {
    if (!isPro()) return;
    const drafts = listDrafts();
    const chosen = drafts.filter((d) => ids.includes(d.id));
    if (!chosen.length) return;
    const current = structuredClone(state);
    modal = null;
    for (const d of chosen) {
      state = migrate(d.data);
      render();
      await waitFonts();
      await new Promise((r) => setTimeout(r, 200));
      await downloadPdf(`Twinform-${d.name.replace(/[^\w.-]+/g, "_")}`);
      await new Promise((r) => setTimeout(r, 400));
    }
    state = current;
    render();
  }

  window.addEventListener("resize", () => scalePreview());

  window.Twinform = {
    loadExample() {
      state = exampleState();
      persistAndRender();
    },
    setProPreview(on) {
      proPreview = !!on;
      localStorage.setItem(STORAGE_PRO, proPreview ? "1" : "0");
      if (!proPreview && state.template !== "classic") state.template = "classic";
      persistAndRender();
    },
    setTemplate(id) {
      if (id !== "classic" && !isPro()) return;
      state.template = id;
      persistAndRender();
    },
    setLangMode(m) {
      state.langMode = m;
      persistAndRender();
    },
    setDocType(m) {
      state.docType = m;
      persistAndRender();
    },
    downloadPdf,
    getState: () => state,
    isPro,
    ready: waitFonts,
  };

  const params = new URLSearchParams(location.search);
  if (params.get("demo") === "1") state = exampleState();
  if (params.get("pro") === "1") {
    proPreview = true;
    localStorage.setItem(STORAGE_PRO, "1");
  }
  if (params.get("template") && TEMPLATES.some((x) => x.id === params.get("template"))) {
    state.template = params.get("template");
  }
  if (params.get("lang") === "en" || params.get("lang") === "zh" || params.get("lang") === "both") {
    state.langMode = params.get("lang");
  }
  if (params.get("type") === "proforma" || params.get("type") === "quote") state.docType = params.get("type");
  if (params.get("ui") === "en" || params.get("ui") === "zh") {
    uiLang = params.get("ui");
    localStorage.setItem(STORAGE_UI, uiLang);
  }

  render();
  waitFonts().then(() => {
    scalePreview();
    checkOverflow();
  });
})();
