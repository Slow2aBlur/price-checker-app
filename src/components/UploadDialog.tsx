'use client'

import { ChangeEvent } from 'react'
import Papa from 'papaparse'
import type { Product } from '@/types/Product'

interface UploadDialogProps {
  onDataParsed: (data: Product[]) => void
}

export default function UploadDialog({ onDataParsed }: UploadDialogProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[]

        const toNum = (v: any) => {
          const n = parseFloat(String(v ?? '').replace(/[^\d.-]/g, ''))
          return Number.isFinite(n) ? n : 0
        }

        // Map your CSV columns to our normalized Product shape
        const cleaned: Product[] = rows
          .filter(r => String(r['post_title'] ?? '').trim().length > 0)
          .map((r, i) => ({
            id: String(r['product_id'] ?? r['_sku'] ?? r['supplier_sku'] ?? i),
            name: String(r['post_title'] ?? '').trim(),
            brand: String(r['product_brand'] ?? '').trim(),
            sku: String(r['_sku'] ?? r['supplier_sku'] ?? '').trim(),
            supplier: String(r['Supplier'] ?? '').trim(),
            regularPrice: toNum(r['_regular_price']),
            salePrice: toNum(r['_sale_price']),
          }))

        onDataParsed(cleaned)
      },
      error: (err) => {
        console.error('CSV Parse Error:', err)
      },
    })
  }

  return (
    <div className="mb-6">
      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800">
        <span>Upload CSV File</span>
        <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  )
}
