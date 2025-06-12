import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";

import ProductsTable from "@/components/ProductsTable";
import ProductsFilter from "@/components/ProductsFilter";
import TablesSkeleton from "@/components/Skeleton/TablesSkeleton";
import type ProductsType from "@/types/ProductType";

type SortKey = "price" | "quantity";
const VALID_SORT_KEYS: SortKey[] = ["price", "quantity"];

const Products = () => {
  const [searchParams] = useSearchParams();
  const [sortedProducts, setSortedProducts] = useState<ProductsType[]>([]);

  const name = searchParams.get("name") || undefined;
  const rawSortBy = searchParams.get("sortBy");
  const sortBy = VALID_SORT_KEYS.includes(rawSortBy as SortKey)
    ? (rawSortBy as SortKey)
    : undefined;

  const {
    data: products,
    isPending,
    error,
  } = useQuery(convexQuery(api.products.get, { name }));

  useEffect(() => {
    if (products && !isPending) {
      console.log(`Applying client-side sort: "${sortBy}"`);

      let productsCopy: ProductsType[] = [];

      if (products && Array.isArray(products)) {
        productsCopy = [...products];
      }
      if (sortBy === "price") {
        productsCopy.sort((a, b) => b.price - a.price);
      } else if (sortBy === "quantity") {
        productsCopy.sort((a, b) => b.quantity - a.quantity);
      }

      setSortedProducts(productsCopy);
    }
  }, [products, name, sortBy]);

  return (
    <div className="w-full">
      <ProductsFilter defaultValues={{ name, sortBy }} />

      <div className="mt-4">
        {isPending && <TablesSkeleton />}
        {error && (
          <p className="text-center text-red-500">Something went wrong!</p>
        )}
        {!isPending && sortedProducts && (
          <ProductsTable products={sortedProducts} />
        )}
        {!isPending && sortedProducts?.length === 0 && !isPending && (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
