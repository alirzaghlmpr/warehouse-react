const TablesSkeleton = () => {
  return (
    <div className="p-4">
      <div className="">
        <div className="bg-slate-400 animate-pulse w-full h-14 rounded-t-xl"></div>
        <div className="bg-slate-300 animate-pulse w-full h-14"></div>{" "}
        <div className="bg-slate-400 animate-pulse w-full h-14"></div>
        <div className="bg-slate-300 animate-pulse w-full h-14"></div>{" "}
        <div className="bg-slate-400 animate-pulse w-full h-14"></div>
        <div className="bg-slate-300 animate-pulse w-full h-14   rounded-b-xl"></div>
      </div>
      <div className="flex gap-2 justify-center mt-4">
        <div className="w-8 h-8 rounded-md animate-pulse bg-slate-300"></div>
        <div className="w-8 h-8 rounded-md animate-pulse bg-slate-300"></div>
        <div className="w-8 h-8 rounded-md animate-pulse bg-slate-300"></div>
        <div className="w-8 h-8 rounded-md animate-pulse bg-slate-300"></div>
      </div>
    </div>
  );
};

export default TablesSkeleton;
