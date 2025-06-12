import { api } from "../../convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import AddInvoiceForm from "@/components/AddInvoiceForm";
import AddInvoiceFormSkeleton from "@/components/Skeleton/AddInvoiceFormSkeleton";

const AddInvoice = () => {
  const {
    data: products,
    isPending,
    error,
  } = useQuery(convexQuery(api.products.get, {}));
  return (
    <>
      {isPending && <AddInvoiceFormSkeleton />}
      {error && <p>soemthing goes wrong!</p>}
      {products && Array.isArray(products) && (
        <AddInvoiceForm products={products} />
      )}
    </>
  );
};

export default AddInvoice;
