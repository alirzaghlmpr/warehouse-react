import { useForm, Controller } from "react-hook-form";
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
import type InvoiceType from "@/types/InvoiceType";

const invoiceSchema = z.object({
  type: z
    .string({ required_error: "نوع فاکتور الزامی است" })
    .min(1, "نوع فاکتور الزامی است"),
  date: z.instanceof(DateObject, { message: "تاریخ الزامی است" }),
  phone: z.string().min(1, "شماره تماس الزامی است"),
  eco_code: z.string().optional(),
  company: z.string().min(1, "نام فروشگاه/شرکت الزامی است"),
  author: z.string().min(1, "نام ثبت کننده الزامی است"),
});

type InvoiceFormData = z.input<typeof invoiceSchema>;

const EditInvoiceDatasForm = ({ ...props }: InvoiceType) => {
  console.log(props);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      date: new DateObject({
        date: props.date,
        format: "YYYY/MM/DD",
        calendar: persian,
        locale: persian_fa,
      }),
      type: props.type,
      phone: props.phone,
      company: props.company,
      author: props.author,
      eco_code: props.eco_code,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.invoices.patch),
    onSuccess: () => {
      toast.success("با موفقیت بروزرسانی شد", {
        duration: 1000,
        position: "top-center",
      });
    },
    onError: (error) => {
      console.error("Failed to add product:", error);
    },
  });

  const onSubmit = (data: InvoiceFormData) => {
    const SubmittedData = {
      ...data,
      id: props._id,
      date: data.date.convert(persian, gregorian_en).format("YYYY/MM/DD"),
      eco_code: data.eco_code || "",
    };
    mutate(SubmittedData);

    console.log("Form Submitted Successfully!");
  };

  return (
    <>
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
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
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
              <p className="text-red-500 text-sm mt-1">
                {errors.author.message}
              </p>
            )}
          </div>
        </div>

        <div className="p-4">
          <button
            disabled={isPending}
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
            {isPending ? "درحال بروزرسانی اطلاعات..." : "بروزرسانی اطاعات"}
          </button>
        </div>
        <Toaster />
      </form>
      <p className="p-4 text-2xl font-bold">
        <span>مجموع فاکتور : </span>
        <span>{props?.total.toLocaleString()} تومان</span>
      </p>
      <div className="flex flex-col gap-2 md:w-1/2 w-full p-4">
        {props?.items?.map((item) => (
          <div
            key={item.product_id}
            className="flex max-w-max flex-col gap-2 border-1 rounded-xl p-4">
            <p className="font-bold">{item?.name}</p>
            <p className="text-xs">
              <span>{item?.price?.toLocaleString()} تومان</span>
              &nbsp;
              <span>* {item?.quantity} عدد</span>
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default EditInvoiceDatasForm;
