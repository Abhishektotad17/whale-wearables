import api from "./GlobalApi";


export const cartApi = {
   // 1️⃣ Get Cart
   getCart: (userId: number) => api.get(`/cart/${userId}`),

   // 2️⃣ Add Item
   addItem: (userId: number, productId: number, quantity: number) =>
     api.post(`/cart/${userId}/add`, null, {
       params: { productId, quantity },
     }),
 
   // 3️⃣ Update Item Quantity
   updateItem: (cartId: number, productId: number, quantity: number) =>
     api.put(`/cart/${cartId}/update`, null, {
       params: { productId, quantity },
     }),
 
   // 4️⃣ Remove Item
   removeItem: (cartId: number, productId: number) =>
     api.delete(`/cart/${cartId}/remove`, {
       params: { productId },
     }),
 
   // 5️⃣ Clear Cart
   clearCart: (cartId: number) => api.delete(`/cart/${cartId}/clear`),
};
