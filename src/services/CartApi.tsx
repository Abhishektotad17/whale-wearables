import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

export const cartApi = {
   // 1️⃣ Get Cart
   getCart: (userId: number) => API.get(`/cart/${userId}`),

   // 2️⃣ Add Item
   addItem: (userId: number, productId: number, quantity: number) =>
     API.post(`/cart/${userId}/add`, null, {
       params: { productId, quantity },
     }),
 
   // 3️⃣ Update Item Quantity
   updateItem: (cartId: number, productId: number, quantity: number) =>
     API.put(`/cart/${cartId}/update`, null, {
       params: { productId, quantity },
     }),
 
   // 4️⃣ Remove Item
   removeItem: (cartId: number, productId: number) =>
     API.delete(`/cart/${cartId}/remove`, {
       params: { productId },
     }),
 
   // 5️⃣ Clear Cart
   clearCart: (cartId: number) => API.delete(`/cart/${cartId}/clear`),
};
