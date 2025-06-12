import { useState, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import chunkArrayWithItemNumber from "@/utils/chunkArray";
import getPaginationRange from "@/utils/getPaginationRange ";
import { Link } from "react-router";
import type ProductsType from "@/types/ProductType";

interface ProductsTableProps {
  products: ProductsType[];
}

const ITEMS_PER_PAGE = 5;

const ProductsTable = ({ products }: ProductsTableProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const pagedProducts = useMemo(() => {
    return chunkArrayWithItemNumber(products, ITEMS_PER_PAGE);
  }, [products]);

  const totalPages = pagedProducts.length;

  if (totalPages === 0) {
    return (
      <p className="p-4 text-center text-gray-500">No products to display.</p>
    );
  }

  return (
    <div className="p-4">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-slate-900">
          <thead className="text-xs text-slate-50 uppercase bg-blue-900">
            <tr>
              <th scope="col" className="px-6 py-3">
                ردیف
              </th>
              <th scope="col" className="px-6 py-3">
                شناسه
              </th>
              <th scope="col" className="px-6 py-3">
                نام محصول
              </th>
              <th scope="col" className="px-6 py-3">
                قیمت(تومان)
              </th>
              <th scope="col" className="px-6 py-3">
                تعداد
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">ویرایش</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedProducts[activeIndex].map((product) => (
              <tr
                key={product._id}
                className={`border-b border-gray-700 ${
                  product.itemNumber % 2 === 0
                    ? "bg-blue-100 hover:bg-blue-200"
                    : "bg-blue-200 hover:bg-blue-300"
                }`}>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                  {product.itemNumber + 1}
                </th>
                <td className="px-6 py-4">{product._id}</td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.price.toLocaleString()}</td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/products/${product._id}`}
                    className="font-medium text-slate-900 hover:underline">
                    ویرایش
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination className="my-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
            />
          </PaginationItem>
          {getPaginationRange(totalPages, activeIndex + 1).map((item, i) => (
            <PaginationItem key={i}>
              {item === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={item - 1 === activeIndex}
                  onClick={() => setActiveIndex(item - 1)}>
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                setActiveIndex((prev) => Math.min(prev + 1, totalPages - 1))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProductsTable;
