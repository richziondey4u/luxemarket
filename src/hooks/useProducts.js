import { useQuery } from "@tanstack/react-query";
import { api } from "../api/products.js";

// All these fetch from DummyJSON only — never from localStorage
export const useFeaturedProducts = (limit = 20) =>
  useQuery({
    queryKey: ["featured", limit],
    queryFn: () => api.getFeaturedProducts(limit),
  });

export const useProductsByCategory = (slug, limit = 100) =>
  useQuery({
    queryKey: ["category", slug, limit],
    queryFn: () => api.getProductsByCategory(slug, limit),
    enabled: !!slug,
  });

export const useProduct = (id) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id),
    enabled: !!id,
  });

export const useSearchProducts = (query) =>
  useQuery({
    queryKey: ["search", query],
    queryFn: () => api.searchProducts(query),
    enabled: !!query && query.length > 1,
  });

export const useNewArrivals = () =>
  useQuery({
    queryKey: ["new-arrivals"],
    queryFn: api.getNewArrivals,
  });

export const useBestSellers = () =>
  useQuery({
    queryKey: ["best-sellers"],
    queryFn: api.getBestSellers,
  });

export const useRelatedProducts = (slug, excludeId) =>
  useQuery({
    queryKey: ["related", slug, excludeId],
    queryFn: () => api.getRelatedProducts(slug, excludeId),
    enabled: !!slug && !!excludeId,
  });
