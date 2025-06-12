import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";

import gregorian_en from "react-date-object/locales/gregorian_en";
import InvoicesTable from "@/components/InvoicesTable";
import InvoicesFilter from "@/components/InvoicesFilter";
import TablesSkeleton from "@/components/Skeleton/TablesSkeleton";
import DateObject from "react-date-object";

import type InvoiceType from "@/types/InvoiceType";

type SortKey = "total" | "date";
const VALID_SORT_KEYS: SortKey[] = ["total", "date"];

type TypeKey = "buy" | "sell";
const VALID_TYPE_KEYS: TypeKey[] = ["buy", "sell"];

const Invoices = () => {
  const [searchParams] = useSearchParams();
  const [sortedInvoices, setSortedInvoices] = useState<InvoiceType[]>([]);

  const rawType = searchParams.get("type");
  const type = VALID_TYPE_KEYS.includes(rawType as TypeKey)
    ? (rawType as TypeKey)
    : undefined;
  const rawSortBy = searchParams.get("sortBy");
  const sortBy = VALID_SORT_KEYS.includes(rawSortBy as SortKey)
    ? (rawSortBy as SortKey)
    : undefined;

  const {
    data: invoices,
    isPending,
    error,
  } = useQuery(convexQuery(api.invoices.get, { type }));

  useEffect(() => {
    if (invoices) {
      const invoicesCopy = [...invoices];

      if (sortBy === "total") {
        invoicesCopy.sort((a, b) => b.total - a.total);
      } else if (sortBy === "date") {
        invoicesCopy.sort(
          (a, b) =>
            new DateObject({
              date: b.date,
              calendar: persian,
              locale: gregorian_en,
            }).convert(gregorian, gregorian_en).unix -
            new DateObject({
              date: a.date,
              calendar: persian,
              locale: gregorian_en,
            }).convert(gregorian, gregorian_en).unix
        );
      }

      setSortedInvoices(invoicesCopy);
    }
  }, [invoices, type, sortBy]);

  return (
    <div className="w-full">
      <InvoicesFilter
        defaultValues={{
          type,
          sortBy,
        }}
      />

      <div className="mt-4">
        {isPending && <TablesSkeleton />}
        {error && (
          <p className="text-center text-red-500">Something went wrong!</p>
        )}
        {!isPending && sortedInvoices && (
          <InvoicesTable invoices={sortedInvoices} />
        )}
        {!isPending && sortedInvoices?.length === 0 && !isPending && (
          <p className="text-center text-gray-500">No invoices found.</p>
        )}
      </div>
    </div>
  );
};

export default Invoices;
