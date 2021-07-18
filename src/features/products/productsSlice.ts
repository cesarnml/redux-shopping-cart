import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { map, zipObject } from 'lodash'
import { Product } from '../../app/api'

export type ProductsState = {
  products: { [id: string]: Product }
}

const initialState: ProductsState = {
  products: {},
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProducts: (state, action: PayloadAction<Product[]>) => {
      const products = action.payload
      state.products = { ...state.products, ...zipObject(map(products, 'id'), action.payload) }
    },
  },
})

export default productsSlice.reducer
export const { addProducts } = productsSlice.actions
