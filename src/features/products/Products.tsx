import React, { useEffect } from 'react'
import { fetchProducts } from '../../app/api'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { incrementItem } from '../cart/cartSlice'
import styles from './Products.module.css'
import { addProducts } from './productsSlice'

export function Products() {
  // const [products, setProducts] = useState<Product[]>([])
  const dispatch = useAppDispatch()

  useEffect(() => {
    fetchProducts().then((products) => {
      // setProducts(products);
      dispatch(addProducts(products))
    })
  }, [])

  const products = useAppSelector((state) => state.products.products)

  return (
    <main className='page'>
      <ul className={styles.products}>
        {Object.values(products).map((product) => (
          <li key={product.id}>
            <article className={styles.product}>
              <figure>
                <img src={product.imageURL} alt={product.imageAlt} />
                <figcaption className={styles.caption}>{product.imageCredit}</figcaption>
              </figure>
              <div>
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p>${product.price}</p>
                <button onClick={() => dispatch(incrementItem(product.id))}>Add to Cart 🛒</button>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </main>
  )
}
