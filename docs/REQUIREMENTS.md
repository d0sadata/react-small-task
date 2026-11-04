# Build a small React feature for a product list

> Source of truth for this task. The original requirements and extended
> requirements below are the brief exactly as supplied.
> Add new requirements by appending to the relevant section and recording the
> change in the changelog.

Your task is to build a small React view that allows a user to explore a list
of products.

Use any React setup you are comfortable with. You can use TypeScript.
You may use React hooks and any basic utility libraries you usually rely on.
No need for routing or global state libraries.

## Original requirements

Use the following hard coded product data in your component:

<!-- markdownlint-disable MD013 -->

```js
const PRODUCTS = [
  { id: 1, name: "Wireless Mouse", category: "Accessories", price: 19.99, inStock: true },
  { id: 2, name: "Mechanical Keyboard", category: "Accessories", price: 59.99, inStock: false },
  { id: 3, name: "4K Monitor", category: "Displays", price: 299.99, inStock: true },
  { id: 4, name: "USB C Hub", category: "Accessories", price: 29.99, inStock: true },
  { id: 5, name: "Laptop Stand", category: "Accessories", price: 39.99, inStock: false },
];
```

<!-- markdownlint-enable MD013 -->

Build a simple interface that:

- Renders the list in a table or cards, showing at least name, category, price
  and stock status.
- Provides a text input to filter products by name in a case sensitive way.
- Provides a select input to filter by category, including an option for all
  categories.
- Provides a toggle control to show only items that are in stock.

## Extended requirements (stretch goals if time allows)

You do not need to complete all of these. They are only for extra discussion if
we have time.

- Allow sorting by price ascending or descending.
- Extract reusable components where it makes sense.
- Add a simple visual cue for out of stock items, for example muted text or an
  extra label.
- Add basic input validation or defensive coding where you think it is useful.

## Changelog

| Date       | Change                                                         |
| ---------- | -------------------------------------------------------------- |
| 2026-11-04 | Initial version: original brief and stretch goals as supplied. |
