import { formatPrice, type Product } from '../domain/products'

interface ProductTableProps {
  products: readonly Product[]
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="table-scroll">
      <table>
        <caption className="visually-hidden">
          Products and their availability
        </caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">Price</th>
            <th scope="col">Availability</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className={product.inStock ? undefined : 'out-of-stock'}
            >
              <th scope="row">{product.name}</th>
              <td>{product.category}</td>
              <td>{formatPrice(product.price)}</td>
              <td>
                {product.inStock ? (
                  <span className="stock-badge available">In stock</span>
                ) : (
                  <span className="stock-badge unavailable">Out of stock</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
