export interface Product {
  id: number
  name: string
  category: string
  price: number
  inStock: boolean
}

export const PRODUCTS: readonly Product[] = [
  {
    id: 1,
    name: 'Wireless Mouse',
    category: 'Accessories',
    price: 19.99,
    inStock: true,
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    category: 'Accessories',
    price: 59.99,
    inStock: false,
  },
  {
    id: 3,
    name: '4K Monitor',
    category: 'Displays',
    price: 299.99,
    inStock: true,
  },
  {
    id: 4,
    name: 'USB C Hub',
    category: 'Accessories',
    price: 29.99,
    inStock: true,
  },
  {
    id: 5,
    name: 'Laptop Stand',
    category: 'Accessories',
    price: 39.99,
    inStock: false,
  },
]

export type SortOrder = 'none' | 'ascending' | 'descending'

export interface ProductFilters {
  name: string
  category: string
  inStockOnly: boolean
  sortOrder: SortOrder
}

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function isValidPrice(price: number): boolean {
  return Number.isFinite(price) && price >= 0
}

export function getCategories(products: readonly Product[]): string[] {
  return [...new Set(products.map((product) => product.category))].sort(
    (a, b) => a.localeCompare(b),
  )
}

export function filterAndSortProducts(
  products: readonly Product[],
  filters: ProductFilters,
): Product[] {
  const filtered = products.filter((product) => {
    const matchesName = product.name.includes(filters.name)
    const matchesCategory =
      filters.category === '' || product.category === filters.category
    const matchesStock = !filters.inStockOnly || product.inStock
    return matchesName && matchesCategory && matchesStock
  })

  if (filters.sortOrder === 'none') return filtered

  return filtered
    .map((product, index) => ({ product, index }))
    .sort((a, b) => {
      const aValid = isValidPrice(a.product.price)
      const bValid = isValidPrice(b.product.price)
      if (aValid !== bValid) return aValid ? -1 : 1
      if (!aValid) return a.index - b.index

      const difference = a.product.price - b.product.price
      return (
        (filters.sortOrder === 'ascending' ? difference : -difference) ||
        a.index - b.index
      )
    })
    .map(({ product }) => product)
}

export function formatPrice(price: number): string {
  if (!isValidPrice(price)) return 'Price unavailable'
  return priceFormatter.format(price)
}
