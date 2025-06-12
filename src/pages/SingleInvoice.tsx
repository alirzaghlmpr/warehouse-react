import { useParams } from "react-router";
import { api } from "../../convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import AddInvoiceFormSkeleton from "@/components/Skeleton/AddInvoiceFormSkeleton";
import EditInvoiceDatasForm from "@/components/EditInvoiceDatasForm";
import type { Id } from "../../convex/_generated/dataModel";

const SingleInvoice = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const {
    data: invoice,
    isPending,
    error,
  } = useQuery({
    ...convexQuery(api.invoices.getInvoice, { id: id as Id<"invoices"> }),
    enabled: !!id,
  });

  console.log(invoice);

  return (
    <>
      {isPending && <AddInvoiceFormSkeleton />}
      {error && <p>soemthing goes wrong!</p>}
      {invoice && <EditInvoiceDatasForm {...invoice} />}
    </>
  );
};

export default SingleInvoice;
