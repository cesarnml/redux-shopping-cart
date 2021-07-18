import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { keys, map, sum, values } from 'lodash'
import { checkout } from '../../app/api'
import { RootState } from '../../app/store'

export enum CheckoutStatus {
  Ready = 'READY',
  Loading = 'LOADING',
  Error = 'ERROR',
  Success = 'SUCCESS',
}

export type CartState = {
  items: { [productID: string]: number }
  checkoutStatus: CheckoutStatus
  checkoutMessage?: string
}

const initialState: CartState = {
  items: {},
  checkoutStatus: CheckoutStatus.Ready,
}

export const checkoutCart = createAsyncThunk('cart/checkoutCart', checkout)

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
      state.checkoutStatus = CheckoutStatus.Ready
      state.checkoutMessage = ''
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
    builder.addCase(checkoutCart.fulfilled, (state, action: PayloadAction<{ success: boolean }>) => {
      const { success } = action.payload
      if (success) {
        state.checkoutStatus = CheckoutStatus.Success
        state.checkoutMessage = 'Checkout Successful! 🎉'
        state.items = {}
      }
    })
    builder.addCase(checkoutCart.pending, (state) => {
      state.checkoutStatus = CheckoutStatus.Loading
      state.checkoutMessage = 'Submitting...'
    })
    builder.addCase(checkoutCart.rejected, (state, action) => {
      state.checkoutStatus = CheckoutStatus.Error
      state.checkoutMessage = action.error.message
    })
  },
})

export default cartSlice.reducer
export const { incrementItem, updateItem, removeItem } = cartSlice.actions

// Helper selectors
export const getCartItems = (state: RootState) => state.cart.items
export const getCheckoutStatus = (state: RootState) => state.cart.checkoutStatus
export const getCheckoutMessage = (state: RootState) => state.cart.checkoutMessage

export const getProducts = (state: RootState) => state.products.products

// Memoized selector
export const selectTotalItemCount = createSelector(getCartItems, (items) => {
  return sum(values(items))
})

export const selectTotalPrice = createSelector(getCartItems, getProducts, (items, products) => {
  return sum(map(keys(items), (key) => products[key].price * items[key])).toFixed(2)
})
