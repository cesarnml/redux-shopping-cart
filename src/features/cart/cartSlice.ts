import { createSelector, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { keys, map, sum, values } from 'lodash'
import { RootState } from '../../app/store'
import { CartItems, checkout } from '../../app/api'

export enum CheckoutStatus {
  Ready = 'READY',
  Loading = 'LOADING',
  Error = 'ERROR',
}

export type CartState = {
  items: { [productID: string]: number }
  checkoutStatus: CheckoutStatus
}

const initialState: CartState = {
  items: {},
  checkoutStatus: CheckoutStatus.Ready,
}

export const checkoutCart = createAsyncThunk('cart/checkoutCartStatus', checkout)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    incrementItem(state, action: PayloadAction<string>) {
      const productID = action.payload
      if (state.items[productID]) {
        state.items[productID]++
      } else {
        state.items[productID] = 1
      }
    },
    updateItem(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const { id, quantity } = action.payload
      state.items[id] = quantity
    },
    removeItem(state, action: PayloadAction<string>) {
      const productID = action.payload
      delete state.items[productID]
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkoutCart.fulfilled, (state) => {
      state.checkoutStatus = CheckoutStatus.Ready
    })
    builder.addCase(checkoutCart.pending, (state) => {
      state.checkoutStatus = CheckoutStatus.Loading
    })
    builder.addCase(checkoutCart.rejected, (state) => {
      state.checkoutStatus = CheckoutStatus.Error
    })
  },
})

export default cartSlice.reducer
export const { incrementItem, updateItem, removeItem } = cartSlice.actions

// Helper selectors
export const getCartItems = (state: RootState) => state.cart.items
export const getCheckoutStatus = (state: RootState) => state.cart.checkoutStatus

export const getProducts = (state: RootState) => state.products.products

// Memoized selector
export const selectTotalItemCount = createSelector(getCartItems, (items) => {
  return sum(values(items))
})

export const selectTotalPrice = createSelector(getCartItems, getProducts, (items, products) => {
  return sum(map(keys(items), (key) => products[key].price * items[key])).toFixed(2)
})
