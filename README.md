# Twinform

A small browser tool for **bilingual quotations and pro forma invoices** (Chinese and English). It runs entirely in your browser and downloads an A4 PDF. Document data stays on this device and is not uploaded.

**This is not a China VAT invoice (增值税发票), and it is not tax or legal advice.** The same notice is printed on the page and on every exported PDF.

在浏览器里制作中英双语**报价单 / 形式发票**，本地下载 A4 PDF。数据只保存在你的电脑上，不会上传。

**这不是中国增值税发票，也不构成税务或法律建议。** 页面和每一份 PDF 都会写上这段说明。

## Use it

Open the hosted tool: <https://xiaoyangge1993.github.io/twinform/>

Add `?demo=1` to load a **fictional** example (names, addresses, and payment details are not real).

Or run it locally:

```bash
python3 -m http.server 4173
```

Then visit <http://127.0.0.1:4173/>.

## What it does

- Chinese, English, or bilingual labels
- Quotation or pro forma invoice
- Multiple currencies, logo, line items, discounts
- PayPal / Wise / Payoneer / bank details (you type them in)
- Drafts saved in this browser only
- Download PDF, or use Print → Save as PDF

The free version includes a small watermark. Extra templates and batch export are not for sale on this page yet.

## License

You may use Twinform to produce quotations and pro forma invoices for your own work. You may not resell, redistribute, or rebrand the tool itself.
