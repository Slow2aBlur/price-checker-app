"use client";

import { useState } from "react";
import ProductTable, { Row } from "@/components/ProductTable";
import UploadDialog from "@/components/UploadDialog";

export default function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [fileName, setFileName] = useState<string>("");

  return (
    <div className="dd-card">
      <div style={{display:"flex",gap:12,justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h2 className="section-title" style={{margin:0}}>Market Comparison</h2>
        <div style={{display:"flex",gap:8}}>
          <UploadDialog onParsed={(r, name) => { setRows(r); setFileName(name || ""); }} />
          {fileName ? <span className="pill pill--success">{fileName}</span> : null}
          <button className="btn btn-accent no-print" onClick={()=>window.print()}>Export PDF</button>
        </div>
      </div>
      <ProductTable data={rows} onChange={setRows} />
    </div>
  );
}
