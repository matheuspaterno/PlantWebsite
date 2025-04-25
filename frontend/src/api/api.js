import axios from 'axios';
import mockProducts from '../data/mockProducts';

const BASE = import.meta.env.VITE_API_BASE_URL;
console.log('📡 API baseURL:', BASE);


const API = axios.create({ baseURL: BASE });

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export async function fetchProducts() {
  if (useMocks) {
    return mockProducts;
  }
  const { data } = await API.get('/products');
  return data;
}

// For cart, we just keep state locally in CartContext when mocking
export default API;