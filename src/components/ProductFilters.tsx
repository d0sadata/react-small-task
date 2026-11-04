import { useId } from 'react'
import {
  getCategories,
  isSortOrder,
  type FilterState,
  type Product,
} from '../domain/products'

interface ProductFiltersProps {
  products: readonly Product[]
  filters: Readonly<FilterState>
  onChange: (patch: Partial<FilterState>) => void
}

export function ProductFilters({
  products,
  filters,
  onChange,
}: Readonly<ProductFiltersProps>) {
  const categories = getCategories(products)
  const searchId = useId()

  return (
    <form
      className="filters"
      aria-label="Product filters"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="field">
        <label htmlFor={searchId}>Filter by name</label>
        <input
          id={searchId}
          type="search"
          value={filters.name}
          maxLength={100}
          aria-describedby={`${searchId}-hint`}
          onChange={(event) => onChange({ name: event.currentTarget.value })}
        />
        <span className="field-hint" id={`${searchId}-hint`}>
          Search is case-sensitive.
        </span>
      </div>

      <label className="field">
        <span>Category</span>
        <select
          value={filters.category}
          onChange={(event) =>
            onChange({ category: event.currentTarget.value })
          }
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="stock-filter">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(event) =>
            onChange({ inStockOnly: event.currentTarget.checked })
          }
        />
        <span>In stock only</span>
      </label>

      <label className="field">
        <span>Sort by price</span>
        <select
          value={filters.sortOrder}
          onChange={(event) => {
            const sortOrder = event.currentTarget.value
            if (isSortOrder(sortOrder)) onChange({ sortOrder })
          }}
        >
          <option value="none">Default order</option>
          <option value="ascending">Price: low to high</option>
          <option value="descending">Price: high to low</option>
        </select>
      </label>
    </form>
  )
}
