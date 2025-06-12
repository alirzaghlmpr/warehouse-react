import type { Id } from "../../convex/_generated/dataModel";

type InvoiceType = {
  _id: Id<"invoices">;
  _creationTime: number;
  total: number;
  date: string;
  type: string;
  phone: string;
  eco_code: string | undefined;
  company: string;
  author: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    product_id: string;
  }[];
};

export default InvoiceType;
