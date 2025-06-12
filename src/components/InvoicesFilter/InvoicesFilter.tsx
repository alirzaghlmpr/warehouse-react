import { useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const filterSchema = z.object({
  type: z.enum(["", "sell", "buy"]).optional(),
  sortBy: z.enum(["", "date", "total"]).optional(),
});

type FilterSchema = z.infer<typeof filterSchema>;

const InvoicesFilter = ({ defaultValues }: { defaultValues: FilterSchema }) => {
  const [, setSearchParams] = useSearchParams();

  const { register, handleSubmit } = useForm<FilterSchema>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      type: defaultValues.type,
      sortBy: defaultValues.sortBy,
    },
  });

  const onSubmit = (data: FilterSchema) => {
    const newParams = new URLSearchParams();

    if (data.type) newParams.set("type", data.type);
    if (data.sortBy) newParams.set("sortBy", data.sortBy);

    setSearchParams(newParams);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex md:flex-row flex-col p-4 justify-center gap-4 md:items-center">
      <select className="inputs--style" {...register("type")}>
        <option value="">نوع فاکتور</option>
        <option value="sell">فروش</option>
        <option value="buy">خرید</option>
      </select>

      <select className="inputs--style" {...register("sortBy")}>
        <option value="">مرتب سازی بر اساس</option>
        <option value="date">تاریخ</option>
        <option value="total">قیمت</option>
      </select>

      <button className="forms--submit--btn" type="submit">
        اعمال فیلتر ها
      </button>
    </form>
  );
};

export default InvoicesFilter;
