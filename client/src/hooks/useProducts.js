import { useQuery } from "@tanstack/react-query";
import { api } from "../api/products.js";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
    staleTime: 5 * 60_000,
  });

export const useFeaturedProducts = (limit = 20) =>
  useQuery({
    queryKey: ["featured", limit],
    queryFn: () => api.getFeaturedProducts(limit),
    staleTime: 60_000,
  });

export const useProductsByCategory = (slug, limit = 100) =>
  useQuery({
    queryKey: ["category", slug, limit],
    queryFn: () => api.getProductsByCategory(slug, limit),
    enabled: !!slug,
    staleTime: 60_000,
  });

export const useProduct = (id) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id),
    enabled: !!id,
    retry: false,
  });

export const useSearchProducts = (q) =>
  useQuery({
    queryKey: ["search", q],
    queryFn: () => api.searchProducts(q),
    enabled: !!q && q.length > 1,
  });

export const useNewArrivals = () =>
  useQuery({
    queryKey: ["new-arrivals"],
    queryFn: api.getNewArrivals,
    staleTime: 60_000,
  });

export const useBestSellers = () =>
  useQuery({
    queryKey: ["best-sellers"],
    queryFn: api.getBestSellers,
    staleTime: 60_000,
  });

export const useRelatedProducts = (slug, excludeId) =>
  useQuery({
    queryKey: ["related", slug, excludeId],
    queryFn: () => api.getRelatedProducts(slug, excludeId),
    enabled: !!slug && !!excludeId,
  });
