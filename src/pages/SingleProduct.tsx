import { useParams } from "react-router";
import { api } from "../../convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import EditProductForm from "@/components/EditProductForm";
import type { Id } from "../../convex/_generated/dataModel";

const SingleProduct = () => {
  const { id } = useParams<{ id: string | undefined }>();

  const {
    data: product,
    isPending,
    error,
  } = useQuery({
    ...convexQuery(api.products.get, { id: id as Id<"products"> }),
    enabled: !!id,
  });

  console.log(product);

  return (
    <>
      {isPending && (
        <div className="flex flex-col gap-2">
          <div className="bg-slate-300 animate-pulse rounded-xl h-8"></div>
          <div className="bg-slate-300 animate-pulse rounded-xl h-8"></div>
          <div className="bg-slate-300 animate-pulse rounded-xl h-8"></div>
          <div className="bg-slate-300 animate-pulse rounded-xl h-8"></div>
        </div>
      )}
      {error && <p>soemthing goes wrong!</p>}
      {product && !Array.isArray(product) && <EditProductForm {...product} />}
    </>
  );
};

export default SingleProduct;
