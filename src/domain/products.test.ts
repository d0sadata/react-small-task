import { describe, expect, it } from 'vitest'
import {
  DEFAULT_FILTERS,
  filterAndSortProducts,
  formatPrice,
  getCategories,
  isSortOrder,
  type Product,
} from './products'

const mouse: Product = {
  id: 1,
  name: 'Wireless Mouse',
  category: 'Accessories',
  price: 19.99,
  inStock: true,
}
const keyboard: Product = {
  id: 2,
  name: 'Mechanical Keyboard',
  category: 'Accessories',
  price: 59.99,
  inStock: false,
}
const monitor: Product = {
  id: 3,
  name: '4K Monitor',
  category: 'Displays',
  price: 299.99,
  inStock: true,
}
const hub: Product = {
  id: 4,
  name: 'USB C Hub',
  category: 'Accessories',
  price: 29.99,
  inStock: true,
}
const products = [mouse, keyboard, monitor, hub]
const defaults = DEFAULT_FILTERS

describe('getCategories', () => {
  it('returns distinct categories in alphabetical order', () => {
    expect(getCategories(products)).toEqual(['Accessories', 'Displays'])
  })

  it('returns an empty list for no products', () => {
    expect(getCategories([])).toEqual([])
  })
})

describe('filterAndSortProducts', () => {
  it('returns every product in its original order when filters are inactive', () => {
    expect(filterAndSortProducts(products, defaults)).toEqual(products)
  })

  it('uses case-sensitive literal substring matching', () => {
    const special: Product = { ...mouse, id: 5, name: 'Möuse (wireless)' }
    expect(
      filterAndSortProducts(products, { ...defaults, name: 'Mouse' }),
    ).toEqual([mouse])
    expect(
      filterAndSortProducts(products, { ...defaults, name: 'mouse' }),
    ).toEqual([])
    expect(
      filterAndSortProducts([special], { ...defaults, name: '(' }),
    ).toEqual([special])
    expect(
      filterAndSortProducts([special], { ...defaults, name: 'Möuse' }),
    ).toEqual([special])
    expect(
      filterAndSortProducts([special], { ...defaults, name: ' Möuse ' }),
    ).toEqual([])
  })

  it('filters by category and stock, including combined filters', () => {
    expect(
      filterAndSortProducts(products, { ...defaults, category: 'Displays' }),
    ).toEqual([monitor])
    expect(
      filterAndSortProducts(products, { ...defaults, inStockOnly: true }),
    ).toEqual([mouse, monitor, hub])
    expect(
      filterAndSortProducts(products, {
        ...defaults,
        name: 'USB',
        category: 'Accessories',
        inStockOnly: true,
      }),
    ).toEqual([hub])
    expect(
      filterAndSortProducts(products, { ...defaults, category: 'Unknown' }),
    ).toEqual([])
  })

  it('sorts by price without mutating input and keeps ties stable', () => {
    const samePrice: Product = { ...keyboard, price: mouse.price }
    const input = [mouse, samePrice, monitor, hub]
    expect(
      filterAndSortProducts(input, { ...defaults, sortOrder: 'ascending' }).map(
        ({ id }) => id,
      ),
    ).toEqual([1, 2, 4, 3])
    expect(
      filterAndSortProducts(input, {
        ...defaults,
        sortOrder: 'descending',
      }).map(({ id }) => id),
    ).toEqual([3, 4, 1, 2])
    expect(input).toEqual([mouse, samePrice, monitor, hub])
  })

  it('places invalid prices last in both sort directions', () => {
    const invalid: [Product, Product, Product] = [
      { ...mouse, id: 5, price: Number.NaN },
      { ...mouse, id: 6, price: -1 },
      { ...mouse, id: 7, price: Number.POSITIVE_INFINITY },
    ]
    const input = [invalid[0], monitor, invalid[1], mouse, invalid[2]]
    expect(
      filterAndSortProducts(input, { ...defaults, sortOrder: 'ascending' }).map(
        ({ id }) => id,
      ),
    ).toEqual([1, 3, 5, 6, 7])
    expect(
      filterAndSortProducts(input, {
        ...defaults,
        sortOrder: 'descending',
      }).map(({ id }) => id),
    ).toEqual([3, 1, 5, 6, 7])
  })

  it('returns an empty list for no products', () => {
    expect(filterAndSortProducts([], defaults)).toEqual([])
  })
})

describe('isSortOrder', () => {
  it.each(['none', 'ascending', 'descending'])('accepts %s', (value) => {
    expect(isSortOrder(value)).toBe(true)
  })

  it.each(['', 'asc', 'Ascending', 'price'])('rejects %j', (value) => {
    expect(isSortOrder(value)).toBe(false)
  })
})

describe('formatPrice', () => {
  it('formats valid amounts as USD', () => {
    expect(formatPrice(19.99)).toBe('$19.99')
    expect(formatPrice(0)).toBe('$0.00')
    expect(formatPrice(123456.78)).toBe('$123,456.78')
  })

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -1])(
    'makes an invalid amount visible as unavailable: %s',
    (price) => {
      expect(formatPrice(price)).toBe('Price unavailable')
    },
  )
})
