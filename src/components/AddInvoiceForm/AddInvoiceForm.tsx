import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-multi-date-picker";
import type ProductsType from "@/types/ProductType";

const invoiceSchema = z
  .object({
    type: z
      .string({ required_error: "نوع فاکتور الزامی است" })
      .min(1, "نوع فاکتور الزامی است"),
    date: z.instanceof(DateObject, { message: "تاریخ الزامی است" }),
    phone: z.string().min(1, "شماره تماس الزامی است"),
    eco_code: z.string().optional(),
    company: z.string().min(1, "نام فروشگاه/شرکت الزامی است"),
    author: z.string().min(1, "نام ثبت کننده الزامی است"),
    items: z
      .array(
        z.object({
          product_id: z.string(),
          name: z.string(),
          price: z.number(),
          quantity: z.number().min(1),
        })
      )
      .min(1, "حداقل یک محصول باید انتخاب شود"),
    total: z.number(),
  })
  .refine(
    (data) => {
      const calculatedTotal = data.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      return data.total === calculatedTotal;
    },
    {
      message: "مجموع کل با موارد فاکتور مطابقت ندارد",
      path: ["total"],
    }
  );

type InvoiceFormData = z.input<typeof invoiceSchema>;

interface InvoiceAddFormProps {
  products: ProductsType[];
}

const AddInvoiceForm = ({ products }: InvoiceAddFormProps) => {
  const [filterProducts, setFilterProducts] = useState(products);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      date: new DateObject(),
      items: [],
      type: "",
      phone: "",
      company: "",
      author: "",
      eco_code: "",
      total: 0,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  const handleAddOrIncrementProduct = (productToAdd: ProductsType) => {
    const existingProductIndex = fields.findIndex(
      (field) => field.product_id === productToAdd._id
    );

    if (existingProductIndex > -1) {
      const currentProduct = fields[existingProductIndex];
      update(existingProductIndex, {
        ...currentProduct,
        quantity: currentProduct.quantity + 1,
      });
    } else {
      append({
        product_id: productToAdd._id,
        name: productToAdd.name,
        price: productToAdd.price,
        quantity: 1,
      });
    }
  };

  const handleDeleteProduct = (index: number) => {
    remove(index);
  };

  const watchedItems = watch("items");

  useEffect(() => {
    const calculatedTotal = watchedItems.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 0);
    }, 0);
    setValue("total", calculatedTotal);
  }, [watchedItems, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.invoices.post),
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

  const onSubmit = (data: InvoiceFormData) => {
    const submittedData = {
      ...data,
      date: data.date.convert(persian, gregorian_en).format("YYYY/MM/DD"),
      eco_code: data.eco_code || "",
    };
    mutate(submittedData);

    console.log("Form Submitted Successfully!", data);
  };

  const totalInvoicePrice = watch("total");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex md:flex-row flex-col p-4 justify-start gap-8 flex-wrap">
        <div>
          <select className="inputs--style" {...register("type")}>
            <option value="" disabled>
              نوع فاکتور
            </option>
            <option value="buy">فروش</option>
            <option value="sell">خرید</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span> تاریخ : </span>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  value={field.value}
                  onChange={field.onChange}
                  style={{
                    borderRadius: "8px",
                    padding: "16px",
                    cursor: "pointer",
                    borderColor: errors.date
                      ? "red"
                      : "oklch(92.9% 0.013 255.508)",
                  }}
                />
              )}
            />
          </div>
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        <div>
          <input
            className="inputs--style"
            type="text"
            placeholder="شماره تماس"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <input
            className="inputs--style"
            type="text"
            placeholder="کد اقتصادی"
            {...register("eco_code")}
          />
          {errors.eco_code && (
            <p className="text-red-500 text-sm mt-1">
              {errors.eco_code.message}
            </p>
          )}
        </div>

        <div>
          <input
            className="inputs--style"
            type="text"
            placeholder="نام فروشگاه/شرکت"
            {...register("company")}
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">
              {errors.company.message}
            </p>
          )}
        </div>

        <div>
          <input
            className="inputs--style"
            type="text"
            placeholder="توسط"
            {...register("author")}
          />
          {errors.author && (
            <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
          )}
        </div>
      </div>

      <div className="flex md:flex-row flex-col justify-between p-4 gap-8">
        <div className="flex flex-col gap-4 overflow-y-auto h-96 p-4 border rounded-lg md:w-80">
          <input
            type="text"
            className="inputs--style sticky top-0"
            placeholder="جست و جوی محصول..."
            onChange={(e) => {
              setFilterProducts(
                products.filter((product) =>
                  product.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
                )
              );
            }}
          />
          {filterProducts.map((product) => (
            <button
              type="button"
              className="border-1 rounded-xl px-4 py-2 cursor-pointer text-right hover:bg-slate-50"
              key={product._id}
              onClick={() => handleAddOrIncrementProduct(product)}>
              <p className="font-bold">{product.name}</p>
              <p className="text-sm">{product.price.toLocaleString()} ریال</p>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <p className="font-bold text-lg">محصولات داخل فاکتور</p>
          {errors.items && !errors.items.root && (
            <p className="text-red-500 text-sm">{errors.items.message}</p>
          )}

          <div className="flex flex-col gap-3 overflow-y-scroll h-80">
            {fields.length === 0 ? (
              <p className="text-gray-500">محصولی انتخاب نشده است.</p>
            ) : (
              fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex justify-between items-center border p-3 rounded-lg shadow-sm">
                  <div className="flex flex-col">
                    <p className="font-bold">{field.name}</p>
                    <p className="text-sm text-gray-600">
                      {field.quantity} عدد × {field.price.toLocaleString()} ریال
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold w-32 text-left">
                      {(field.quantity * field.price).toLocaleString()} ریال
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(index)}
                      className="bg-red-100 text-red-600 hover:bg-red-500 hover:text-white rounded-full w-7 h-7 flex items-center justify-center font-bold transition-colors">
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {fields.length > 0 && (
            <div className="mt-4 border-t-2 pt-4 flex justify-between items-center">
              <p className="text-xl font-bold">مجموع کل:</p>
              <p className="text-xl font-bold">
                {totalInvoicePrice.toLocaleString()} ریال
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <button
          disabled={isPending}
          type="submit"
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
          {isPending ? "درحال ثبت فاکتور..." : "ثبت فاکتور"}
        </button>
      </div>
      <Toaster />
    </form>
  );
};

export default AddInvoiceForm;
