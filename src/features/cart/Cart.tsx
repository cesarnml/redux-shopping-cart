import classNames from 'classnames'
import { entries, startCase } from 'lodash'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import styles from './Cart.module.css'
import {
  checkoutCart,
  CheckoutStatus,
  getCartItems,
  getCheckoutStatus,
  getProducts,
  removeItem,
  selectTotalPrice,
  updateItem,
} from './cartSlice'

export function Cart() {
  const dispatch = useAppDispatch()

  const products = useAppSelector(getProducts)
  const items = useAppSelector(getCartItems)
  const totalPrice = useAppSelector(selectTotalPrice)
  const checkoutStatus = useAppSelector(getCheckoutStatus)

  const tableClassNames = classNames(styles.table, {
    [styles.checkoutError]: checkoutStatus === CheckoutStatus.Error,
    [styles.checkoutLoading]: checkoutStatus === CheckoutStatus.Loading,
  })

  const submit = (e) => {
    e.preventDefault()
    dispatch(checkoutCart(items))
  }

  return (
    <main className='page'>
      <h1>Shopping Cart</h1>
      <table className={tableClassNames}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {entries(items).map(([id, quantity]) => {
            return (
              <tr key={id}>
                <td>{products[id].name}</td>
                <td>
                  <input
                    type='text'
                    className={styles.input}
                    defaultValue={quantity}
                    onBlur={(e) => dispatch(updateItem({ id, quantity: Number(e.target.value) ?? 0 }))}
                  />
                </td>
                <td>${products[id].price}</td>
                <td>
                  <button
                    aria-label={`Remove ${startCase(products[id].name)} from Shopping Cart`}
                    onClick={() => dispatch(removeItem(id))}
                  >
                    X
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
            <td className={styles.total}>${totalPrice}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <form onSubmit={submit}>
        <button className={styles.button} type='submit'>
          Checkout
        </button>
      </form>
    </main>
  )
}
