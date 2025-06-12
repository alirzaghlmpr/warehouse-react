const AddInvoiceFormSkeleton = () => {
  return (
    <div className="p-4 flex flex-col">
      <div className="flex flex-wrap gap-1 md:justify-start justify-center">
        <div className="md:w-32 w-5/12 h-12 rounded-xl bg-slate-300 animate-pulse"></div>{" "}
        <div className="md:w-32 w-5/12 h-12 rounded-xl bg-slate-300 animate-pulse"></div>
        <div className="md:w-32 w-5/12 h-12 rounded-xl bg-slate-300 animate-pulse"></div>{" "}
        <div className="md:w-32 w-5/12 h-12 rounded-xl bg-slate-300 animate-pulse"></div>{" "}
        <div className="md:w-32 w-5/12 h-12 rounded-xl bg-slate-300 animate-pulse"></div>{" "}
        <div className="md:w-32 w-5/12 h-12 rounded-xl bg-slate-300 animate-pulse"></div>
      </div>
      <div className="flex md:flex-row flex-col justify-between gap-8 my-4">
        <div className="md:w-1/4 w-full flex flex-col gap-4">
          <div className="w-full h-12 rounded-xl bg-slate-300 animate-pulse"></div>
          <div className="md:w-32 w-full h-8 rounded-xl bg-slate-300 animate-pulse"></div>{" "}
          <div className="md:w-32 w-full h-8 rounded-xl bg-slate-300 animate-pulse"></div>
          <div className="md:w-32 w-full h-8 rounded-xl bg-slate-300 animate-pulse"></div>
        </div>
        <div className="md:w-3/4 w-full h-64 bg-slate-300 animate-pulse rounded-xl"></div>
      </div>
    </div>
  );
};

export default AddInvoiceFormSkeleton;
