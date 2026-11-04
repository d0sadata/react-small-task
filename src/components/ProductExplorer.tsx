import { useMemo, useState } from 'react'
import {
  filterAndSortProducts,
  PRODUCTS,
  type Product,
  type ProductFilters,
} from '../domain/products'
import { ProductFilters as ProductFiltersView } from './ProductFilters'
import { ProductTable } from './ProductTable'

const initialFilters: ProductFilters = {
  name: '',
  category: '',
  inStockOnly: false,
  sortOrder: 'none',
}

interface ProductExplorerProps {
  products?: readonly Product[]
}

export function ProductExplorer({ products = PRODUCTS }: ProductExplorerProps) {
  const [filters, setFilters] = useState(initialFilters)
  const visibleProducts = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters],
  )

  function resetFilters() {
    setFilters(initialFilters)
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Catalog</p>
        <h1>Product Explorer</h1>
        <p className="intro">Find the right gear for your workspace.</p>
      </header>

      <section className="product-panel" aria-labelledby="product-heading">
        <div className="panel-heading">
          <div>
            <h2 id="product-heading">Products</h2>
            <p className="result-count" aria-live="polite">
              Showing {visibleProducts.length} of {products.length} products
            </p>
          </div>
          <button className="reset-button" type="button" onClick={resetFilters}>
            Reset filters
          </button>
        </div>

        <ProductFiltersView
          products={products}
          filters={filters}
          onChange={setFilters}
        />

        {visibleProducts.length > 0 ? (
          <ProductTable products={visibleProducts} />
        ) : (
          <p className="empty-state" role="status">
            No products match your filters.
          </p>
        )}
      </section>
    </main>
  )
}
