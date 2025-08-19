# Price Comparison Tool

A Next.js-based CSV price comparison tool that allows you to upload product data and compare prices across major South African retailers.

## Features

- **CSV Upload**: Drag & drop or browse to upload CSV files
- **Price Comparison**: Compare your prices against 6 major retailers
- **Editable Retail Prices**: Click on price cells to edit competitor prices
- **Automatic Calculations**: 
  - Lowest retail price highlighting
  - Percentage differences from your regular and sale prices
  - Random selection of 20 products for focused analysis
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic dark/light theme detection

## Required CSV Format

Your CSV file must have these exact headers:

```csv
ID,Product Name,Brand,SKU,Supplier,Regular Price,Sale Price
```

### Example:
```csv
1,Samsung 55" 4K Smart TV,Samsung,TV-55-4K,Electronics Plus,12999.99,10999.99
2,Apple iPhone 15 Pro,Apple,IPH-15-PRO,Phone World,24999.99,22999.99
```

## How to Use

1. **Prepare your CSV file** with the required headers and product data
2. **Upload the CSV** using the drag & drop interface or click to browse
3. **Edit retail prices** by clicking on the price cells for each retailer:
   - Makro
   - Game
   - HiFi Corp
   - OK Furniture
   - Takealot
   - Incredible
4. **View comparisons** - the tool automatically:
   - Highlights the lowest retail price
   - Calculates percentage differences from your prices
   - Shows price variations across retailers

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Upload your CSV file and start comparing prices!

## Sample Data

A `sample-data.csv` file is included with 20 sample products to test the tool.

## Technical Details

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **CSV Parsing**: PapaParse
- **State Management**: React hooks (client-side only)
- **TypeScript**: Full type safety
- **Responsive**: Mobile-first design

## Data Privacy

All data is processed client-side only. No files are uploaded to any server - everything stays on your device.

## Browser Support

Works in all modern browsers that support:
- ES6+ features
- File API
- Drag & Drop API
