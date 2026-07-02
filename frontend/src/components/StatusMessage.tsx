type Props = {
  tone?: "error" | "success" | "info";
  children: React.ReactNode;
};

export const StatusMessage = ({ tone = "info", children }: Props) => {
  const className =
    tone === "error"
      ? "border-coral/40 bg-coral/10 text-coral"
      : tone === "success"
        ? "border-moss/40 bg-moss/10 text-moss"
        : "border-slate-300 bg-slate-50 text-slate-700";

  return <div className={`rounded-md border px-3 py-2 text-sm ${className}`}>{children}</div>;
};
