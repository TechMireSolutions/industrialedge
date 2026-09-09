import { useCallback } from 'react';
import { cartApi } from '../services';

export function useWishlist() {
  const addToWishlist = useCallback(async (productId) => {
    const response = await cartApi.addToWishlist(productId);
    return response.data;
  }, []);

  const removeFromWishlist = useCallback(async (productId) => {
    await cartApi.removeFromWishlist(productId);
  }, []);

  const checkWishlist = useCallback(async (productId) => {
    const response = await cartApi.checkWishlist(productId);
    return response.data.inWishlist;
  }, []);

  const moveToCart = useCallback(async (productId) => {
    const response = await cartApi.moveToCart(productId);
    return response.data;
  }, []);

  return { addToWishlist, removeFromWishlist, checkWishlist: checkWishlist, moveToCart };
}