import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import toast, { Toaster } from "react-hot-toast";

const productSchema = z.object({
  name: z.string().min(3, { message: "نام کالا باید حداقل ۳ حرف باشد" }),
  quantity: z.coerce
    .number({ invalid_type_error: "تعداد باید عدد باشد" })
    .positive({ message: "تعداد باید مثبت باشد" }),
  price: z.coerce
    .number({ invalid_type_error: "قیمت باید عدد باشد" })
    .positive({ message: "قیمت باید مثبت باشد" }),
});

type ProductFormData = z.infer<typeof productSchema>;

const AddProductForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.products.post),
    onSuccess: () => {
      toast.success("با موفقیت ایجاد شد", {
        duration: 1000,
        position: "top-center",
      });
      reset();
    },
    onError: (error) => {
      console.error("Failed to add product:", error);
    },
  });

  const onSubmit = (data: ProductFormData) => {
    console.log(data);
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      <Toaster />
      <div className="flex flex-col">
        <input
          type="text"
          className="inputs--style"
          placeholder="نام کالا"
          {...register("name")}
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <input
          type="text"
          className="inputs--style"
          placeholder="تعداد"
          {...register("quantity")}
          aria-invalid={errors.quantity ? "true" : "false"}
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <input
          type="text"
          className="inputs--style"
          placeholder="قیمت"
          {...register("price")}
          aria-invalid={errors.price ? "true" : "false"}
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <button type="submit" className="forms--submit--btn" disabled={isPending}>
        {isPending ? "در حال اضافه کردن..." : "اضافه کردن کالا"}
      </button>
    </form>
  );
};

export default AddProductForm;
