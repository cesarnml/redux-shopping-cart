import { keys } from 'lodash'

export interface Product {
  id: string
  name: string
  price: number
  description: string
  imageURL: string
  imageAlt: string
  imageCredit: string
}

export async function fetchProducts(): Promise<Product[]> {
  const results = await fetch('/products.json')
  const products = results.json()
  return products
}

export type CartItems = { [productID: string]: number }
export type CheckoutResponse = { success: boolean; error?: string }

export async function checkout(items: CartItems): Promise<CheckoutResponse> {
  const modifier = keys(items).length > 0 ? 'success' : 'error'
  const url = `/checkout-${modifier}.json`
  console.log('url:', url)
  await sleep(500)
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(items),
  })
  const data: CheckoutResponse = await response.json()
  if (!data.success) {
    throw new Error(data.error)
  }
  return data
}

// utility function to simulate slowness in an API call
const sleep = (time: number) => new Promise((res) => setTimeout(res, time))
