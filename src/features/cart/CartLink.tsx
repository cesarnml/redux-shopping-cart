import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import styles from './CartLink.module.css'
import { selectTotalItemCount } from './cartSlice'

export function CartLink() {
  const totalItemCount = useAppSelector(selectTotalItemCount)

  return (
    <Link to='/cart' className={styles.link}>
      <span className={styles.text}>🛒&nbsp;&nbsp;Cart ({totalItemCount})</span>
    </Link>
  )
}
