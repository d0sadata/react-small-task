import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('filters, sorts and resets the supplied products', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('rowheader')).toHaveCount(5)

  const search = page.getByRole('searchbox', { name: 'Filter by name' })
  await search.fill('mouse')
  await expect(page.locator('.empty-state')).toHaveText(
    'No products match your filters.',
  )
  await expect(page.getByRole('status')).toHaveText(
    'No products match your filters.',
  )
  await search.fill('Mouse')
  await expect(page.getByRole('rowheader')).toHaveText(['Wireless Mouse'])

  await page.getByRole('button', { name: 'Reset filters' }).click()
  await page
    .getByRole('combobox', { name: 'Category' })
    .selectOption('Accessories')
  await page.getByRole('checkbox', { name: 'In stock only' }).check()
  await page
    .getByRole('combobox', { name: 'Sort by price' })
    .selectOption('descending')
  await expect(page.getByRole('rowheader')).toHaveText([
    'USB C Hub',
    'Wireless Mouse',
  ])

  await page.getByRole('button', { name: 'Reset filters' }).click()
  await expect(page.getByRole('rowheader')).toHaveCount(5)
  await expect(
    page.getByRole('checkbox', { name: 'In stock only' }),
  ).not.toBeChecked()
})

test('supports keyboard navigation and has no automated WCAG violations', async ({
  page,
}) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Reset filters' }),
  ).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('searchbox', { name: 'Filter by name' }),
  ).toBeFocused()

  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(result.violations).toEqual([])
})

test('keeps controls usable at a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(
    page.getByRole('searchbox', { name: 'Filter by name' }),
  ).toBeVisible()
  await expect(page.getByRole('table')).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
})
