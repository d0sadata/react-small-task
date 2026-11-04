import { useState } from 'react'
import {
  DEFAULT_FILTERS,
  filterAndSortProducts,
  PRODUCTS,
  type FilterState,
  type Product,
} from '../domain/products'
import { ProductFilters } from './ProductFilters'
import { ProductTable } from './ProductTable'

interface ProductExplorerProps {
  products?: readonly Product[]
}

export function ProductExplorer({ products = PRODUCTS }: ProductExplorerProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const visibleProducts = filterAndSortProducts(products, filters)

  function updateFilters(patch: Partial<FilterState>) {
    setFilters((current) => ({ ...current, ...patch }))
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
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

        <ProductFilters
          products={products}
          filters={filters}
          onChange={updateFilters}
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
