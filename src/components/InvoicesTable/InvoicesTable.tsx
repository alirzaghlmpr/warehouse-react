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

import type invoiceTableItemType from "@/types/invoiceTableItemType";
import chunkArray from "@/utils/chunkArray";
import getPaginationRange from "@/utils/getPaginationRange ";

import { Link } from "react-router";

interface InvoiceTableProps {
  invoices: invoiceTableItemType[];
}

const ITEMS_PER_PAGE = 5;

const InvoicesTable = ({ invoices }: InvoiceTableProps) => {
  const [activeIndex, setActiveIndex] = useState(0);


  const pagedInvoices = useMemo(() => {
    return chunkArray(invoices, ITEMS_PER_PAGE);
  }, [invoices]);

  const totalPages = pagedInvoices.length;

  if (totalPages === 0) {
    return <p className="p-4 text-center text-gray-500">No invoices found.</p>;
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
                نوع
              </th>
              <th scope="col" className="px-6 py-3">
                توسط
              </th>
              <th scope="col" className="px-6 py-3">
                فروشگاه
              </th>
              <th scope="col" className="px-6 py-3">
                تاریخ
              </th>
              <th scope="col" className="px-6 py-3">
                مبلغ(تومان)
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">ویرایش/مشاهده</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedInvoices[activeIndex].map(
              (invoice: invoiceTableItemType, index) => (
                <tr
                  key={invoice._id}
                  className={`border-b border-gray-700 ${
                    index % 2 === 0
                      ? "bg-blue-100 hover:bg-blue-200"
                      : "bg-blue-200 hover:bg-blue-300"
                  }`}>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                    {activeIndex * ITEMS_PER_PAGE + index + 1}
                  </th>
                  <td className="px-6 py-4">{invoice._id}</td>
                  <td className="px-6 py-4">
                    {invoice.type === "sell" ? "فروش" : "خرید"}
                  </td>
                  <td className="px-6 py-4">{invoice.author}</td>
                  <td className="px-6 py-4">{invoice.company}</td>
                  <td className="px-6 py-4">{invoice.date}</td>
                  <td className="px-6 py-4">
                    {invoice.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/invoices/${invoice._id}`} 
                      className="font-medium text-slate-900 hover:underline">
                      ویرایش/مشاهده
                    </Link>
                  </td>
                </tr>
              )
            )}
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

export default InvoicesTable;
