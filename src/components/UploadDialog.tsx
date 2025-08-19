"use client";

import React, { useRef } from "react";
import type { Row } from "./ProductTable";

const norm = (s: string) => (s || "").trim().toLowerCase();

/** Recognised retailer headers (case/spacing tolerant) */
const RETAILER_PATTERNS: { label: string; test: (h: string) => boolean }[] = [
  { label: "Makro",                  test: (h) => /\bmakro\b/.test(h) },
  { label: "HiFi Corp",              test: (h) => /\bhi[-\s]?fi\b.*\bcorp\b/.test(h) },
  { label: "OK Furniture",           test: (h) => /\bok\b.*\bfurniture\b/.test(h) },
  { label: "Game",                   test: (h) => /\bgame\b/.test(h) },
  { label: "Incredible Connection",  test: (h) => /\bincredible\b.*\b(connection|conn)?\b/.test(h) },
  { label: "Takealot",               test: (h) => /\btake[-\s]?alot\b/.test(h) },
];

/** CSV parser (handles quotes and commas in quotes) */
function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const rows: string[][] = [];
  let i = 0, cur = "", inQ = false, row: string[] = [];
  const pushCell = () => { row.push(cur); cur = ""; };
  const pushRow  = () => { rows.push(row); row = []; };

  while (i < text.length) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"' && text[i + 1] === '"') { cur += '"'; i += 2; continue; }
      if (ch === '"') { inQ = false; i++; continue; }
      cur += ch; i++; continue;
    } else {
      if (ch === '"') { inQ = true; i++; continue; }
      if (ch === ",") { pushCell(); i++; continue; }
      if (ch === "\n") { pushCell(); pushRow(); i++; continue; }
      if (ch === "\r") { i++; continue; }
      cur += ch; i++; continue;
    }
  }
  pushCell(); if (row.length) pushRow();
  const [headerRow, ...dataRows] = rows;
  return { headers: headerRow ?? [], rows: dataRows ?? [] };
}

/** "R 1,234.56" or "145%" → numbers */
function toNum(v?: string | null): number | undefined {
  if (!v) return undefined;
  const s = String(v).replace(/R/gi, "").replace(/[^0-9.\-]/g, "");
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

/** Find first header index by regex */
function findByRegex(headersN: string[], patterns: RegExp[]): number {
  for (const rx of patterns) {
    const i = headersN.findIndex((h) => rx.test(h));
    if (i !== -1) return i;
  }
  return -1;
}

export default function UploadDialog({
  onParsed,
}: {
  onParsed: (rows: Row[], fileName?: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const onPick = () => fileRef.current?.click();

  const onChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const { headers, rows } = parseCSV(text);
    const headersN = headers.map(norm);

    // Map base fields (broad synonyms)
    const idI = findByRegex(headersN, [/\b(product[_\s-]?id|post[_\s-]?id|^id)\b/]);
    const nameI = findByRegex(headersN, [/\bpost[_\s-]?title\b/, /\b(product|product[_\s-]?name|name|title)\b/]);
    const brandI = findByRegex(headersN, [/\bproduct[_\s-]?brand\b/, /\bbrand\b/]);
    const skuI = findByRegex(headersN, [/\bproduct[_\s-]?sku\b/, /\bsupplier[_\s-]?sku\b/, /\bsku\b/]);
    const supplierI = findByRegex(headersN, [/\bsupplier[_\s-]?name\b/, /\bbrand[_\s-]?supplier\b/, /\bsupplier\b/, /\bvendor\b/]);

    const purchaseI = findByRegex(headersN, [
      /\bpurchase[_\s-]?price\b/, /\bpurchase\b/, /\bcost\b/, /\bbuy\b/, /\bcost[_\s-]?price\b/
    ]);
    const regI = findByRegex(headersN, [
      /\bregular[_\s-]?price\b/, /\bprice[_\s-]?reg\b/, /\brrp\b/, /\bretail\b/, /\bregular\b/
    ]);
    const saleI = findByRegex(headersN, [
      /\bsale[_\s-]?price\b/, /\bprice[_\s-]?sale\b/, /\bsale\b/, /\bspecial\b/, /\bpromo\b/
    ]);

    // Retailers present in CSV (limit to known ones)
    const retailerCols: { label: string; index: number }[] = [];
    headersN.forEach((h, i) => {
      for (const rp of RETAILER_PATTERNS) {
        if (rp.test(h)) { retailerCols.push({ label: rp.label, index: i }); break; }
      }
    });

    const out: Row[] = rows
      .filter((r) => r.some((c) => c && c.trim() !== "")) // drop empty rows
      .map((r, rowIdx) => {
        const retailers: Record<string, number | undefined> = {};
        retailerCols.forEach(({ label, index }) => {
          retailers[label] = toNum(r[index]);
        });

        return {
          id: (idI !== -1 ? r[idI] : "") || String(rowIdx + 1),
          sku: skuI !== -1 ? r[skuI] : undefined,
          name: nameI !== -1 ? r[nameI] : "(Unnamed)",
          brand: brandI !== -1 ? r[brandI] : undefined,
          supplier: supplierI !== -1 ? r[supplierI] : undefined,
          purchasePrice: purchaseI !== -1 ? toNum(r[purchaseI]) : undefined,
          regularPrice: regI !== -1 ? toNum(r[regI]) : undefined,
          salePrice: saleI !== -1 ? toNum(r[saleI]) : undefined,
          retailers,
        };
      });

    onParsed(out, file.name);
    e.target.value = ""; // allow re-uploading same file
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input ref={fileRef} type="file" accept=".csv" onChange={onChange} hidden />
      <button className="btn btn-primary no-print" onClick={onPick}>Upload CSV</button>
    </div>
  );
}
