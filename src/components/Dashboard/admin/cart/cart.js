// stores/cart.js
import api from '../../../../services/api'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: []
    }),

    actions: {
        async fetchCart() {
            const res = await api.get('/cart')
            this.items = res.data.data
        },

        addToCartLocal(item) {
            const existing = this.items.find(i => 
                i.product_id === item.product_id &&
                i.variant_id === item.variant_id
            )

            if (existing) {
                existing.quantity += item.quantity
            } else {
                this.items.push(item)
            }
        }
    }
})