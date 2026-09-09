import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { downloadBsaReport } from "@/api/export";
import { cn } from "@/lib/utils";

interface BsaDownloadButtonProps {
  fromDate?: string;
  toDate?: string;
  cust_id?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  label?: string;
}

export function BsaDownloadButton({
  fromDate,
  toDate,
  cust_id,
  className,
  variant = "default",
  size = "default",
  label = "Download BSA Report",
}: BsaDownloadButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates to export report");
      return;
    }

    const d1 = new Date(fromDate);
    const d2 = new Date(toDate);

    if (d1 > d2) {
      toast.error("From Date cannot be later than To Date");
      return;
    }

    try {
      setIsExporting(true);
      toast.loading("Generating your BSA Excel report...", { id: "bsa-export" });

      await downloadBsaReport({
        from_date: fromDate,
        to_date: toDate,
        cust_id,
      });

      toast.success("BSA Excel report downloaded successfully!", {
        id: "bsa-export",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to download BSA report", {
        id: "bsa-export",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isExporting}
      variant={variant}
      size={size}
      className={cn(
        "gap-2 font-semibold shadow-xs transition-all duration-200 cursor-pointer",
        variant === "default" &&
        "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-900/10",
        variant === "outline" &&
        "border-emerald-600 text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100",
        isExporting && "opacity-80 cursor-not-allowed",
        className
      )}
      title="Download consolidated BSA Excel Workbook (Summary, Cashflow, Monthly Overview)"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Generating Excel...</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="w-4 h-4" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}

export default BsaDownloadButton;
