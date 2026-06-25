import { useQuery } from "@tanstack/react-query";
import { api } from "../api/products.js";

export const useFeaturedProducts = (limit = 20) =>
  useQuery({
    queryKey: ["featured", limit],
    queryFn: () => api.getFeaturedProducts(limit),
    staleTime: 0, // Always refetch so custom products appear immediately
  });

export const useProductsByCategory = (slug, limit = 100) =>
  useQuery({
    queryKey: ["category", slug, limit],
    queryFn: () => api.getProductsByCategory(slug, limit),
    enabled: !!slug,
    staleTime: 0,
  });

export const useProduct = (id) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id),
    enabled: !!id,
    staleTime: 0,
    retry: (failureCount, error) => {
      // Don't retry for not-found custom products
      if (error?.message === "Product not found") return false;
      return failureCount < 2;
    },
  });

export const useSearchProducts = (query) =>
  useQuery({
    queryKey: ["search", query],
    queryFn: () => api.searchProducts(query),
    enabled: !!query && query.length > 1,
    staleTime: 0,
  });

export const useNewArrivals = () =>
  useQuery({
    queryKey: ["new-arrivals"],
    queryFn: api.getNewArrivals,
    staleTime: 0,
  });

export const useBestSellers = () =>
  useQuery({
    queryKey: ["best-sellers"],
    queryFn: api.getBestSellers,
    staleTime: 0,
  });

export const useRelatedProducts = (slug, excludeId) =>
  useQuery({
    queryKey: ["related", slug, excludeId],
    queryFn: () => api.getRelatedProducts(slug, excludeId),
    enabled: !!slug && !!excludeId,
    staleTime: 0,
  });
