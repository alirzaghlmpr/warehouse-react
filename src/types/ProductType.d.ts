import type { Id } from "../../convex/_generated/dataModel";

type ProductsType = {
  _id: Id<"products">;
  _creationTime: number;
  name: string;
  quantity: number;
  price: number;
};

export default ProductsType;
