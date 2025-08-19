'use client'

import { useMemo, useState } from 'react'
import UploadDialog from '@/components/UploadDialog'
import ProductTable from '@/components/ProductTable'
import type { Product } from '@/types/Product'

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])

  const handleParsed = (rows: Product[]) => {
    setAllProducts(rows)
    setVisibleProducts(sample15(rows))
  }

  const resample = () => {
    if (allProducts.length) setVisibleProducts(sample15(allProducts))
  }

  const handleProductUpdate = (updated: Product[]) => {
    setVisibleProducts(updated)
  }

  const total = useMemo(() => allProducts.length, [allProducts])

  return (
    <main className="p-4 md:p-6 lg:p-8 print:p-0">
      <header className="flex items-center justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-semibold leading-tight">Price Comparison Tool</h1>
          {total > 0 && (
            <p className="text-[11px] md:text-xs text-gray-600">
              Loaded {total} products • Showing a random 15 each time
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0 no-print">
          <button
            onClick={resample}
            className="px-2 py-1 rounded border border-slate-300 hover:bg-slate-50 text-xs"
          >
            Re‑sample 15
          </button>
          <button
            onClick={() => window.print()}
            className="px-2 py-1 rounded bg-slate-800 text-white hover:bg-slate-900 text-xs"
          >
            Print to PDF
          </button>
        </div>
      </header>

      <div className="no-print">
        <UploadDialog onDataParsed={handleParsed} />
      </div>

      {visibleProducts.length > 0 ? (
        <>
          <h2 className="text-sm font-semibold mb-2">Product Comparison ({visibleProducts.length} of {total})</h2>
          <ProductTable
            products={visibleProducts}
            onProductUpdate={handleProductUpdate}
          />
        </>
      ) : (
        <HowTo />
      )}

      {/* Global compact + print styles */}
      <style jsx global>{`
        :root { --base-size: 12px; }
        html, body { font-size: var(--base-size); }
        @media (min-width: 1024px) { :root { --base-size: 12px; } }

        /* Make tables compact everywhere */
        table { font-size: 11px; }
        th, td { padding: 6px 8px; }

        /* Inputs/buttons compact */
        input, button { font-size: 12px; }

        /* Print rules: landscape, tighter margins, compact cells */
        @media print {
          @page { size: A4 landscape; margin: 8mm; }
          body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          header { margin-bottom: 6px; }
          table { font-size: 10px !important; }
          th, td { padding: 4px 6px !important; }
        }
      `}</style>
    </main>
  )
}

function sample15<T>(arr: T[]) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, 15)
}

function HowTo() {
  return (
    <div className="text-center text-gray-700">
      <h3 className="text-sm font-semibold mb-2">How to use</h3>
      <ol className="space-y-1 inline-block text-left text-xs">
        <li>1) Click <b>Upload CSV File</b> and select today’s file</li>
        <li>2) The app randomly selects 15 products</li>
        <li>3) Enter competitor prices in the table</li>
        <li>4) Click <b>Print to PDF</b>, then save and email manually</li>
      </ol>
    </div>
  )
}
