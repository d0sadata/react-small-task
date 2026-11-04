import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ANNOUNCEMENT_DELAY_MS, ProductExplorer } from './ProductExplorer'

// Visible text only; the screen-reader status region may repeat it.
const visibleText = (text: string) =>
  screen.getByText(text, { ignore: 'script, style, [role="status"]' })

afterEach(() => {
  vi.useRealTimers()
})

describe('ProductExplorer', () => {
  it('shows the supplied products with their details and stock status', () => {
    render(<ProductExplorer />)

    expect(screen.getAllByRole('row')).toHaveLength(6)
    const mouseRow = screen.getByRole('row', { name: /Wireless Mouse/ })
    expect(within(mouseRow).getByText('Accessories')).toBeInTheDocument()
    expect(within(mouseRow).getByText('$19.99')).toBeInTheDocument()
    expect(within(mouseRow).getByText('In stock')).toBeInTheDocument()
    const keyboardRow = screen.getByRole('row', { name: /Mechanical Keyboard/ })
    expect(within(keyboardRow).getByText('Out of stock')).toBeInTheDocument()
    expect(keyboardRow).toHaveClass('out-of-stock')
    expect(visibleText('Showing 5 of 5 products')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Showing 5 of 5 products',
    )
  })

  it('filters names case-sensitively and displays an empty state', async () => {
    const user = userEvent.setup()
    render(<ProductExplorer />)
    const search = screen.getByRole('searchbox', { name: 'Filter by name' })

    expect(search).toHaveAccessibleDescription('Search is case-sensitive.')
    expect(search).toHaveAttribute('maxLength', '100')
    await user.type(search, 'mouse')
    expect(visibleText('No products match your filters.')).toBeInTheDocument()
    await user.clear(search)
    await user.type(search, 'Mouse')
    expect(
      screen.getByRole('rowheader', { name: 'Wireless Mouse' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('rowheader', { name: 'Mechanical Keyboard' }),
    ).not.toBeInTheDocument()
    expect(visibleText('Showing 1 of 5 products')).toBeInTheDocument()
  })

  it('combines category and stock filters and resets every control', async () => {
    const user = userEvent.setup()
    render(<ProductExplorer />)

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Category' }),
      'Accessories',
    )
    await user.click(screen.getByRole('checkbox', { name: 'In stock only' }))
    expect(
      screen.getAllByRole('rowheader').map((row) => row.textContent),
    ).toEqual(['Wireless Mouse', 'USB C Hub'])
    await user.type(
      screen.getByRole('searchbox', { name: 'Filter by name' }),
      'USB',
    )
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Sort by price' }),
      'descending',
    )
    expect(screen.getAllByRole('rowheader')).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Reset filters' }))
    expect(screen.getAllByRole('rowheader')).toHaveLength(5)
    expect(
      screen.getByRole('searchbox', { name: 'Filter by name' }),
    ).toHaveValue('')
    expect(screen.getByRole('combobox', { name: 'Category' })).toHaveValue('')
    expect(screen.getByRole('combobox', { name: 'Sort by price' })).toHaveValue(
      'none',
    )
    expect(
      screen.getByRole('checkbox', { name: 'In stock only' }),
    ).not.toBeChecked()
  })

  it('sorts the displayed products by price in both directions', async () => {
    const user = userEvent.setup()
    render(<ProductExplorer />)
    const sort = screen.getByRole('combobox', { name: 'Sort by price' })

    await user.selectOptions(sort, 'ascending')
    expect(
      screen.getAllByRole('rowheader').map((row) => row.textContent),
    ).toEqual([
      'Wireless Mouse',
      'USB C Hub',
      'Laptop Stand',
      'Mechanical Keyboard',
      '4K Monitor',
    ])
    await user.selectOptions(sort, 'descending')
    expect(
      screen.getAllByRole('rowheader').map((row) => row.textContent),
    ).toEqual([
      '4K Monitor',
      'Mechanical Keyboard',
      'Laptop Stand',
      'USB C Hub',
      'Wireless Mouse',
    ])
  })

  it('announces one result summary after typing pauses', () => {
    vi.useFakeTimers()
    render(<ProductExplorer />)
    const status = screen.getByRole('status')
    const search = screen.getByRole('searchbox', { name: 'Filter by name' })

    fireEvent.change(search, { target: { value: 'M' } })
    fireEvent.change(search, { target: { value: 'Mou' } })
    act(() => {
      vi.advanceTimersByTime(ANNOUNCEMENT_DELAY_MS - 1)
    })
    expect(status).toHaveTextContent('Showing 5 of 5 products')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(status).toHaveTextContent('Showing 1 of 5 products')

    fireEvent.change(search, { target: { value: 'zzz' } })
    act(() => {
      vi.advanceTimersByTime(ANNOUNCEMENT_DELAY_MS)
    })
    expect(status).toHaveTextContent('No products match your filters.')
    expect(screen.getAllByRole('status')).toHaveLength(1)
  })

  it('handles an empty product list and unavailable prices', () => {
    const { rerender } = render(<ProductExplorer products={[]} />)
    expect(visibleText('No products match your filters.')).toBeInTheDocument()
    expect(visibleText('Showing 0 of 0 products')).toBeInTheDocument()

    rerender(
      <ProductExplorer
        products={[
          {
            id: 1,
            name: 'Unknown',
            category: 'Other',
            price: NaN,
            inStock: true,
          },
        ]}
      />,
    )
    expect(screen.getByText('Price unavailable')).toBeInTheDocument()
  })
})
