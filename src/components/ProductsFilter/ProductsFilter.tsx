import { useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const filterSchema = z.object({
  name: z.string().optional(),
  sortBy: z.enum(["price", "quantity", ""]).optional(),
});

type FilterSchema = z.infer<typeof filterSchema>;

const ProductsFilter = ({ defaultValues }: { defaultValues: FilterSchema }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { register, handleSubmit } = useForm<FilterSchema>({
    resolver: zodResolver(filterSchema),
    defaultValues,
  });

  const onSubmit = (data: FilterSchema) => {
    const newParams = new URLSearchParams(searchParams);

    if (data.name) {
      newParams.set("name", data.name);
    } else {
      newParams.delete("name");
    }

    if (data.sortBy) {
      newParams.set("sortBy", data.sortBy);
    } else {
      newParams.delete("sortBy");
    }

    setSearchParams(newParams);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex md:flex-row flex-col p-4 justify-center gap-4 md:items-center">
      <input
        className="inputs--style"
        type="text"
        placeholder="نام محصول"
        {...register("name")}
      />
      <select className="inputs--style" {...register("sortBy")}>
        <option value="">مرتب سازی بر اساس</option>
        <option value="price">قیمت</option>
        <option value="quantity">تعداد</option>
      </select>
      <button className="forms--submit--btn" type="submit">
        اعمال فیلتر ها
      </button>
    </form>
  );
};

export default ProductsFilter;
