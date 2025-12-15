"use client";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full md:w-[28vw] h-[calc(100vh-64px)] py-10">
      <div className="w-8 h-8 border-3 border-t-primary border-t-3 border-primary-border rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
