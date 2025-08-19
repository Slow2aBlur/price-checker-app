// ProductTable.tsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function getRandomSample(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [csvName, setCsvName] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setCsvName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validRows = results.data.filter(row => row['Product Name'] && row['SKU']);
        const sample = getRandomSample(validRows, 15);
        setProducts(sample);
      },
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      'SKU',
      'Product Name',
      'Brand',
      'Supplier',
      'Reg Price',
      'Sale Price',
      'HiFi Corp',
      'Game',
      'Takealot',
      'OK Furn',
      'Lowest Price',
      'Diff % to our lowest',
    ];

    const tableRows = products.map((product) => {
      const retailerPrices = [
        parseFloat(product['HiFi Corp']) || Infinity,
        parseFloat(product['Game']) || Infinity,
        parseFloat(product['Takealot']) || Infinity,
        parseFloat(product['OK Furn']) || Infinity,
      ];

      const ownPrices = [
        parseFloat(product['Reg Price']) || Infinity,
        parseFloat(product['Sale Price']) || Infinity,
      ];

      const lowestRetailer = Math.min(...retailerPrices);
      const lowestOwn = Math.min(...ownPrices);
      const diff =
        lowestRetailer < lowestOwn
          ? `${Math.round(((lowestOwn - lowestRetailer) / lowestOwn) * 100)}%`
          : '—';

      return [
        product['SKU'],
        product['Product Name'],
        product['Brand'],
        product['Supplier'],
        product['Reg Price'],
        product['Sale Price'],
        product['HiFi Corp'],
        product['Game'],
        product['Takealot'],
        product['OK Furn'],
        isFinite(lowestRetailer) ? lowestRetailer.toFixed(2) : '',
        diff,
      ];
    });

    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save('Market-Comparison.pdf');
  };

  return (
    <div className="container">
      <h1>Market Comparison</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {csvName && <span className="csv-info">{csvName}</span>}
      <button onClick={exportToPDF}>Export PDF</button>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Product Name</th>
            <th>Brand</th>
            <th>Supplier</th>
            <th>Reg Price</th>
            <th>Sale Price</th>
            <th>HiFi Corp</th>
            <th>Game</th>
            <th>Takealot</th>
            <th>OK Furn</th>
            <th>Lowest Price</th>
            <th>Diff % to our lowest</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            const retailerPrices = [
              parseFloat(product['HiFi Corp']) || Infinity,
              parseFloat(product['Game']) || Infinity,
              parseFloat(product['Takealot']) || Infinity,
              parseFloat(product['OK Furn']) || Infinity,
            ];
            const ownPrices = [
              parseFloat(product['Reg Price']) || Infinity,
              parseFloat(product['Sale Price']) || Infinity,
            ];
            const lowestRetailer = Math.min(...retailerPrices);
            const lowestOwn = Math.min(...ownPrices);
            const diff =
              lowestRetailer < lowestOwn
                ? `${Math.round(((lowestOwn - lowestRetailer) / lowestOwn) * 100)}%`
                : '—';

            return (
              <tr key={index}>
                <td>{product['SKU']}</td>
                <td>{product['Product Name']}</td>
                <td>{product['Brand']}</td>
                <td>{product['Supplier']}</td>
                <td>{product['Reg Price']}</td>
                <td>{product['Sale Price']}</td>
                <td>{product['HiFi Corp']}</td>
                <td>{product['Game']}</td>
                <td>{product['Takealot']}</td>
                <td>{product['OK Furn']}</td>
                <td>{isFinite(lowestRetailer) ? lowestRetailer.toFixed(2) : ''}</td>
                <td>{diff}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
