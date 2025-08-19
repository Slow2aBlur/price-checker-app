'use client'

import { useState } from 'react'
import type { Product } from '@/types/Product'

const retailers = ['Makro', 'Game', 'HiFi Corp', 'OK Furniture', 'Takealot', 'Incredible']

interface ProductTableProps {
  products: Product[]
  onProductUpdate: (updated: Product[]) => void
}

export default function ProductTable({ products, onProductUpdate }: ProductTableProps) {
  const [localProducts, setLocalProducts] = useState(products)

  const handlePriceChange = (index: number, retailer: string, value: string) => {
    const updated = [...localProducts]
    const num = parseFloat(value)
    updated[index][retailer] = Number.isFinite(num) ? num : undefined
    setLocalProducts(updated)
    onProductUpdate(updated)
  }

  const getLowestRetail = (p: Product): number | null => {
    const nums = retailers.map(r => p[r]).filter(v => typeof v === 'number') as number[]
    return nums.length ? Math.min(...nums) : null
  }

  const pct = (base: number, lowest: number | null) => {
    if (lowest === null || base === 0) return '-'
    const diff = ((base - lowest) / base) * 100
    return `${diff.toFixed(1)}%`
  }

  return (
    <div className="mt-3 overflow-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr className="text-xs">
            <th className="p-2 whitespace-nowrap">Product ID</th>
            <th className="p-2">Product</th>
            <th className="p-2">Brand</th>
            <th className="p-2">SKU</th>
            <th className="p-2">Supplier</th>
            <th className="p-2 whitespace-nowrap">Our Reg</th>
            <th className="p-2 whitespace-nowrap">Our Sale</th>
            {retailers.map(r => (
              <th key={r} className="p-2">{r}</th>
            ))}
            <th className="p-2 whitespace-nowrap">Lowest</th>
            <th className="p-2 whitespace-nowrap">% Diff (Reg)</th>
            <th className="p-2 whitespace-nowrap">% Diff (Sale)</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {localProducts.map((p, idx) => {
            const lowest = getLowestRetail(p)
            return (
              <tr key={`${p.id}-${idx}`} className="text-center">
                <td className="border p-2 whitespace-nowrap font-mono">{p.id}</td>
                <td className="border p-2 text-left">{p.name}</td>
                <td className="border p-2">{p.brand}</td>
                <td className="border p-2">{p.sku}</td>
                <td className="border p-2">{p.supplier}</td>
                <td className="border p-2 text-red-800 font-semibold">R{p.regularPrice.toFixed(2)}</td>
                <td className="border p-2 text-green-700 font-semibold">R{p.salePrice.toFixed(2)}</td>

                {retailers.map(r => (
                  <td key={r} className="border p-2">
                    <input
                      type="number"
                      className="w-24 max-w-[96px] border px-1 py-0.5 text-[11px] text-center rounded"
                      value={p[r] ?? ''}
                      onChange={(e) => handlePriceChange(idx, r, e.target.value)}
                    />
                  </td>
                ))}

                <td className="border p-2 font-semibold">
                  {lowest !== null ? `R${lowest.toFixed(2)}` : '-'}
                </td>
                <td className="border p-2">{pct(p.regularPrice, lowest)}</td>
                <td className="border p-2">{pct(p.salePrice, lowest)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
