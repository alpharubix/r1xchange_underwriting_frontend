import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RotateCw,
  RotateCcw,
  Search,
  Filter,
  Server,
  User,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  Code,
} from "lucide-react";
import { getLogsList } from "@/api/logs";
import type { LogItem, LogFilters } from "@/api/logs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const formatTimestamp = (timestamp?: string): string => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2); // 2-digit year (YY)

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, "0");

  return `${day}-${month}-${year}, ${strHours}:${minutes}:${seconds} ${ampm}`;
};

const formatBytes = (bytes?: number | null): string => {
  if (bytes === null || bytes === undefined) return "N/A";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const getFormattedPayload = (payload: any): { text: string; isJson: boolean; isEmpty: boolean } => {
  if (payload === null || payload === undefined) {
    return { text: "", isJson: false, isEmpty: true };
  }
  if (typeof payload === "string") {
    const trimmed = payload.trim();
    if (
      !trimmed ||
      trimmed === "{}" ||
      trimmed === "null" ||
      trimmed === "b''" ||
      trimmed === '""' ||
      trimmed === "None"
    ) {
      return { text: "", isJson: false, isEmpty: true };
    }
    try {
      const parsed = JSON.parse(trimmed);
      return {
        text: JSON.stringify(parsed, null, 2),
        isJson: true,
        isEmpty: false,
      };
    } catch {
      // Handle Python bytes string representation e.g. b'{"key": "value"}'
      if (
        (trimmed.startsWith("b'") && trimmed.endsWith("'")) ||
        (trimmed.startsWith('b"') && trimmed.endsWith('"'))
      ) {
        const inner = trimmed.slice(2, -1);
        try {
          const parsed = JSON.parse(inner);
          return {
            text: JSON.stringify(parsed, null, 2),
            isJson: true,
            isEmpty: false,
          };
        } catch {
          return { text: inner, isJson: false, isEmpty: false };
        }
      }
      return { text: trimmed, isJson: false, isEmpty: false };
    }
  }
  if (typeof payload === "object") {
    if (Object.keys(payload).length === 0) {
      return { text: "", isJson: true, isEmpty: true };
    }
    return {
      text: JSON.stringify(payload, null, 2),
      isJson: true,
      isEmpty: false,
    };
  }
  return { text: String(payload), isJson: false, isEmpty: false };
};

const getMethodColor = (method?: string) => {
  switch (method?.toUpperCase()) {
    case "GET":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "POST":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "PUT":
    case "PATCH":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "DELETE":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export default function AdminLogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [inspectedLog, setInspectedLog] = useState<LogItem | null>(null);
  const [modalTab, setModalTab] = useState<"formatted" | "raw">("formatted");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Filter States
  const [filterPath, setFilterPath] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [filterStatusCode, setFilterStatusCode] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [filterUserId, setFilterUserId] = useState("");

  // Debounced input states for text filters
  const [debouncedPath, setDebouncedPath] = useState("");
  const [debouncedUserId, setDebouncedUserId] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPath(filterPath.trim());
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [filterPath]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUserId(filterUserId.trim());
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [filterUserId]);

  const hasActiveFilters =
    filterPath !== "" ||
    filterStatus !== "all" ||
    filterMethod !== "all" ||
    filterStatusCode !== "all" ||
    filterRole !== "all" ||
    filterUserId !== "";

  const handleClearFilters = () => {
    setFilterPath("");
    setFilterStatus("all");
    setFilterMethod("all");
    setFilterStatusCode("all");
    setFilterRole("all");
    setFilterUserId("");
    setCurrentPage(1);
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const queryParams: LogFilters = {
    page: currentPage,
    status_filter: filterStatus !== "all" ? filterStatus : undefined,
    method: filterMethod !== "all" ? filterMethod : undefined,
    status_code: filterStatusCode !== "all" ? Number(filterStatusCode) : undefined,
    path: debouncedPath || undefined,
    role: filterRole !== "all" ? filterRole : undefined,
    user_id: debouncedUserId || undefined,
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [
      "admin",
      "logs",
      currentPage,
      filterStatus,
      filterMethod,
      filterStatusCode,
      debouncedPath,
      filterRole,
      debouncedUserId,
    ],
    queryFn: () => getLogsList(queryParams),
    keepPreviousData: true,
  } as any);

  const logsList: LogItem[] = data?.logs || data?.["page-info"]?.logs || [];
  const totalPages = data?.total_pages || data?.["page-info"]?.total_pages || 1;
  const totalRecords =
    data?.total_logs ?? data?.total_records ?? data?.["page-info"]?.total_records ?? 0;
  const limit = data?.limit || data?.["page-info"]?.limit || 10;

  // Active inspected log payload formatting
  const currentPayloadRaw =
    inspectedLog?.request?.body_data ??
    (inspectedLog as any)?.request?.body ??
    (inspectedLog as any)?.request?.payload ??
    (inspectedLog as any)?.body_data ??
    (inspectedLog as any)?.payload;

  const currentPayloadInfo = getFormattedPayload(currentPayloadRaw);

  return (
    <>
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f6f9]">
        {/* Top Header */}
        <header className="flex items-center justify-between bg-white px-8 py-5 border-b border-slate-200 shrink-0">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              SYSTEM LOGS
            </h1>
            <p className="text-sm text-slate-500 font-semibold mt-0.5">
              Monitor real-time API requests, performance, and server exceptions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                variant="ghost"
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold rounded-xl h-10 px-3"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </Button>
            )}

            <Button
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
              variant="outline"
              className="flex items-center gap-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 rounded-xl shadow-sm h-10 px-4"
            >
              <RotateCw
                className={`h-4 w-4 ${isFetching ? "animate-spin text-blue-600" : ""}`}
              />
              <span>Refresh</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Filters Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                <Filter className="h-4 w-4 text-blue-800" />
                <span>Filter Logs</span>
                {hasActiveFilters && (
                  <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Active
                  </span>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Filter Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Path Filter */}
              <div className="space-y-1.5 lg:col-span-2">
                <Label htmlFor="fpath" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Endpoint Path
                </Label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="fpath"
                    placeholder="e.g. /v1/auth/logout"
                    value={filterPath}
                    onChange={(e) => setFilterPath(e.target.value)}
                    className="h-11 pl-9 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
                  />
                  {filterPath && (
                    <button
                      onClick={() => setFilterPath("")}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </Label>
                <Select
                  value={filterStatus}
                  onValueChange={(val) => {
                    setFilterStatus(val);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-11 w-full border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl text-sm font-semibold text-slate-700 shadow-xs transition-all">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200/90 rounded-2xl shadow-xl p-1.5 z-50">
                    <SelectItem value="all" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:bg-slate-100 cursor-pointer">
                      All Statuses
                    </SelectItem>
                    <SelectItem value="SUCCESS" className="rounded-xl py-2 px-3 text-xs font-semibold text-emerald-700 focus:bg-emerald-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>SUCCESS</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="FAILED" className="rounded-xl py-2 px-3 text-xs font-semibold text-rose-700 focus:bg-rose-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                        <span>FAILED</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Method Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Method
                </Label>
                <Select
                  value={filterMethod}
                  onValueChange={(val) => {
                    setFilterMethod(val);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-11 w-full border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl text-sm font-semibold text-slate-700 shadow-xs transition-all">
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200/90 rounded-2xl shadow-xl p-1.5 z-50">
                    <SelectItem value="all" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:bg-slate-100 cursor-pointer">
                      All Methods
                    </SelectItem>
                    <SelectItem value="GET" className="rounded-xl py-2 px-3 text-xs font-bold text-blue-700 focus:bg-blue-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-black">GET</span>
                        <span>GET</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="POST" className="rounded-xl py-2 px-3 text-xs font-bold text-emerald-700 focus:bg-emerald-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black">POST</span>
                        <span>POST</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="PUT" className="rounded-xl py-2 px-3 text-xs font-bold text-amber-700 focus:bg-amber-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-black">PUT</span>
                        <span>PUT</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="DELETE" className="rounded-xl py-2 px-3 text-xs font-bold text-rose-700 focus:bg-rose-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-black">DELETE</span>
                        <span>DELETE</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="PATCH" className="rounded-xl py-2 px-3 text-xs font-bold text-purple-700 focus:bg-purple-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-black">PATCH</span>
                        <span>PATCH</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Code Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status Code
                </Label>
                <Select
                  value={filterStatusCode}
                  onValueChange={(val) => {
                    setFilterStatusCode(val);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-11 w-full border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl text-sm font-semibold text-slate-700 shadow-xs transition-all">
                    <SelectValue placeholder="All Codes" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200/90 rounded-2xl shadow-xl p-1.5 z-50">
                    <SelectItem value="all" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:bg-slate-100 cursor-pointer">
                      All Codes
                    </SelectItem>
                    <SelectItem value="200" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:bg-slate-100 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="font-bold text-slate-800">200</span>
                        <span className="text-slate-500 text-[11px] font-normal">OK</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="201" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:bg-slate-100 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="font-bold text-slate-800">201</span>
                        <span className="text-slate-500 text-[11px] font-normal">Created</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="400" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:bg-slate-100 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="font-bold text-slate-800">400</span>
                        <span className="text-slate-500 text-[11px] font-normal">Bad Request</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="401" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:bg-slate-100 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span className="font-bold text-slate-800">401</span>
                        <span className="text-slate-500 text-[11px] font-normal">Unauthorized</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="403" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:bg-slate-100 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span className="font-bold text-slate-800">403</span>
                        <span className="text-slate-500 text-[11px] font-normal">Forbidden</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="404" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:bg-slate-100 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span className="font-bold text-slate-800">404</span>
                        <span className="text-slate-500 text-[11px] font-normal">Not Found</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="500" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:bg-slate-100 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-600" />
                        <span className="font-bold text-slate-800">500</span>
                        <span className="text-slate-500 text-[11px] font-normal">Server Error</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Role Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  User Role
                </Label>
                <Select
                  value={filterRole}
                  onValueChange={(val) => {
                    setFilterRole(val);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-11 w-full border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl text-sm font-semibold text-slate-700 shadow-xs transition-all">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200/90 rounded-2xl shadow-xl p-1.5 z-50">
                    <SelectItem value="all" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:bg-slate-100 cursor-pointer">
                      All Roles
                    </SelectItem>
                    <SelectItem value="USER" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 focus:bg-slate-100 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-blue-600" />
                        <span>USER</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ADMIN" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 focus:bg-slate-100 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-600" />
                        <span>ADMIN</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="SUPER_ADMIN" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 focus:bg-slate-100 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-purple-600" />
                        <span>SUPER_ADMIN</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ANCHOR" className="rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 focus:bg-slate-100 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-teal-600" />
                        <span>ANCHOR</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  API Logs List
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Click any row to inspect complete payload, request headers, client, and response data.
                </p>
              </div>

              <div className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                Total Logs:{" "}
                <span className="text-slate-900 font-black">{totalRecords}</span>
              </div>
            </div>

            {/* Data Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-white">
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider select-none">
                      <th className="py-4 px-6 min-w-[200px]">Timestamp</th>
                      <th className="py-4 px-6 min-w-[120px]">Status</th>
                      <th className="py-4 px-6 min-w-[100px]">Method</th>
                      <th className="py-4 px-6 min-w-[220px]">Path</th>
                      <th className="py-4 px-6 min-w-[110px]">Duration (ms)</th>
                      <th className="py-4 px-6 min-w-[110px]">Req Size</th>
                      <th className="py-4 px-6 min-w-[130px]">IP Address</th>
                      <th className="py-4 px-6 min-w-[130px]">User Role</th>
                      <th className="py-4 px-6 min-w-[140px]">Error Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {isLoading ? (
                      <tr>
                        <td colSpan={9} className="py-16 text-center text-slate-400 font-bold">
                          <div className="flex justify-center items-center gap-3">
                            <span className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin" />
                            <span>Loading system logs...</span>
                          </div>
                        </td>
                      </tr>
                    ) : logsList.length > 0 ? (
                      logsList.map((log) => {
                        const formattedTimestamp = formatTimestamp(log.timestamp);
                        const statusCode = log.response?.status_code;

                        return (
                          <tr
                            key={log._id}
                            onClick={() => {
                              setInspectedLog(log);
                              setModalTab("formatted");
                            }}
                            className="transition-colors hover:bg-blue-50/40 cursor-pointer group"
                          >
                            <td className="py-4 px-6 text-slate-900 font-bold">
                              {formattedTimestamp}
                            </td>
                            <td className="py-4 px-6">
                              {log.status === "SUCCESS" ? (
                                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-[11px] border border-emerald-200/60">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>{statusCode || 200} SUCCESS</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-lg text-[11px] border border-rose-200/60">
                                  <XCircle className="h-3.5 w-3.5" />
                                  <span>{statusCode || 500} FAILED</span>
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${getMethodColor(
                                  log.request?.method
                                )}`}
                              >
                                {log.request?.method || "-"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-slate-700 font-mono truncate max-w-[260px]">
                              {log.request?.path || "-"}
                            </td>
                            <td className="py-4 px-6 text-slate-600 font-semibold">
                              {log.performance?.duration_ms !== undefined &&
                                log.performance?.duration_ms !== null
                                ? log.performance.duration_ms
                                : "-"}
                            </td>
                            <td className="py-4 px-6 text-slate-600 font-mono">
                              {formatBytes(log.request?.request_size_bytes)}
                            </td>
                            <td className="py-4 px-6 text-slate-500 font-mono">
                              {log.client?.ip_address || "-"}
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                                {log.user?.role || "Guest / Public"}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              {log.error?.occurred || log.error?.type ? (
                                <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                                  <AlertTriangle className="h-3 w-3 shrink-0" />
                                  <span className="truncate max-w-[130px]">
                                    {log.error?.type || "Error"}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-slate-400 font-semibold">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} className="py-16 text-center text-slate-400 font-bold">
                          {hasActiveFilters ? "No logs match your filter criteria." : "No logs found."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4 gap-4">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Showing{" "}
                  <span className="text-slate-800">
                    {totalRecords === 0 ? 0 : (currentPage - 1) * limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="text-slate-800">
                    {Math.min(currentPage * limit, totalRecords)}
                  </span>{" "}
                  of <span className="text-slate-800">{totalRecords}</span> records
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                      title="First Page"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                      title="Previous Page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="text-xs font-bold text-slate-700 px-2 min-w-[70px] text-center select-none">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage >= totalPages}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                      title="Next Page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage >= totalPages}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                      title="Last Page"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {inspectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
            >
              {/* Modal Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/80 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      Log Details
                    </h2>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-black uppercase border ${getMethodColor(
                        inspectedLog.request?.method
                      )}`}
                    >
                      {inspectedLog.request?.method || "REQUEST"}
                    </span>
                    {inspectedLog.status === "SUCCESS" ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-md text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {inspectedLog.response?.status_code || 200} SUCCESS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-md text-xs">
                        <XCircle className="h-3.5 w-3.5" />
                        {inspectedLog.response?.status_code || 500} FAILED
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                    <span>Log ID:</span>
                    <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono text-[11px]">
                      {inspectedLog._id}
                    </code>
                    <button
                      onClick={() => copyToClipboard(inspectedLog._id, "log_id")}
                      className="text-slate-400 hover:text-slate-700 p-1"
                      title="Copy Log ID"
                    >
                      {copiedField === "log_id" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Tab switch */}
                  <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setModalTab("formatted")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${modalTab === "formatted"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      Structured Fields
                    </button>
                    <button
                      onClick={() => setModalTab("raw")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${modalTab === "raw"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      Raw JSON
                    </button>
                  </div>

                  <button
                    onClick={() => setInspectedLog(null)}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                {modalTab === "formatted" ? (
                  <div className="space-y-6">
                    {/* Error Banner (if occurred) */}
                    {(inspectedLog.error?.occurred ||
                      inspectedLog.status === "FAILED" ||
                      (inspectedLog.response?.status_code &&
                        inspectedLog.response.status_code >= 400)) && (
                        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-5 space-y-2">
                          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Error Detected</span>
                            <span className="bg-rose-200/80 text-rose-900 text-xs px-2 py-0.5 rounded font-mono">
                              Status Code: {inspectedLog.response?.status_code || 500}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                            <div>
                              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
                                Error Type
                              </span>
                              <span className="font-bold text-rose-900">
                                {inspectedLog.error?.type || "HTTPError"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
                                Error Code
                              </span>
                              <span className="font-bold text-rose-900 font-mono">
                                {inspectedLog.error?.code || inspectedLog.response?.status_code || "-"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
                                Occurred Flag
                              </span>
                              <span className="font-bold text-rose-900">
                                {inspectedLog.error?.occurred ? "True" : "False"}
                              </span>
                            </div>
                          </div>
                          {inspectedLog.error?.message && (
                            <div className="mt-2 bg-white/80 p-3 rounded-xl border border-rose-100 text-xs text-rose-900 font-mono whitespace-pre-wrap break-all">
                              {inspectedLog.error.message}
                            </div>
                          )}
                        </div>
                      )}

                    {/* Top 2 Columns: Request Details & Client/Performance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Section 1: Request & HTTP Details */}
                      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                          <FileText className="h-4 w-4 text-blue-700" />
                          <span>Request Details</span>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Method & Path
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getMethodColor(
                                  inspectedLog.request?.method
                                )}`}
                              >
                                {inspectedLog.request?.method || "-"}
                              </span>
                              <span
                                className="font-mono text-slate-800 font-bold break-all"
                                title={inspectedLog.request?.path}
                              >
                                {inspectedLog.request?.path || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Timestamp (DD-MM-YY) IST
                              </span>
                              <span className="font-semibold text-slate-800">
                                {formatTimestamp(inspectedLog.timestamp)}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Timestamp (ISO UTC)
                              </span>
                              <span className="font-mono text-slate-700 text-[11px] truncate block" title={inspectedLog.timestamp}>
                                {inspectedLog.timestamp}
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Request ID
                            </span>
                            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 mt-1">
                              <code className="font-mono text-[11px] text-slate-800 break-all select-all">
                                {inspectedLog.request?.request_id || "None"}
                              </code>
                              {inspectedLog.request?.request_id && (
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      inspectedLog.request!.request_id,
                                      "request_id"
                                    )
                                  }
                                  className="text-slate-400 hover:text-slate-700 ml-2 shrink-0"
                                  title="Copy Request ID"
                                >
                                  {copiedField === "request_id" ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Trace ID
                            </span>
                            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 mt-1">
                              <code className="font-mono text-[11px] text-slate-800 break-all select-all">
                                {inspectedLog.request?.trace_id || "None"}
                              </code>
                              {inspectedLog.request?.trace_id && (
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      inspectedLog.request!.trace_id,
                                      "trace_id"
                                    )
                                  }
                                  className="text-slate-400 hover:text-slate-700 ml-2 shrink-0"
                                  title="Copy Trace ID"
                                >
                                  {copiedField === "trace_id" ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Request Size
                              </span>
                              <span className="font-semibold text-slate-800">
                                {formatBytes(inspectedLog.request?.request_size_bytes)}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Response Size
                              </span>
                              <span className="font-semibold text-slate-800">
                                {formatBytes(inspectedLog.response?.response_size_bytes)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Client & Performance */}
                      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                          <Clock className="h-4 w-4 text-emerald-600" />
                          <span>Client & Performance</span>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Execution Duration
                              </span>
                              <span className="font-black text-slate-900 text-sm">
                                {inspectedLog.performance?.duration_ms !== undefined &&
                                  inspectedLog.performance?.duration_ms !== null
                                  ? `${inspectedLog.performance.duration_ms} ms`
                                  : "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Status Code
                              </span>
                              <span className="font-black text-slate-900 text-sm">
                                {inspectedLog.response?.status_code || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Client IP Address
                              </span>
                              <span className="font-mono font-semibold text-slate-800">
                                {inspectedLog.client?.ip_address || "None"}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Client Platform
                              </span>
                              <span className="font-semibold text-slate-800">
                                {inspectedLog.client?.platform || "Web / Default"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              User Agent
                            </span>
                            <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 break-all select-all leading-relaxed mt-1">
                              {inspectedLog.client?.user_agent || "Not provided"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: REQUEST PAYLOAD / BODY (Full Width, Prominent) */}
                    <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                          <Code className="h-4 w-4 text-emerald-700" />
                          <span>Request Payload (Body Data)</span>
                          {!currentPayloadInfo.isEmpty && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              {formatBytes(inspectedLog.request?.request_size_bytes) !== "N/A"
                                ? formatBytes(inspectedLog.request?.request_size_bytes)
                                : "Payload Present"}
                            </span>
                          )}
                        </div>

                        {!currentPayloadInfo.isEmpty && (
                          <button
                            onClick={() =>
                              copyToClipboard(currentPayloadInfo.text, "request_payload")
                            }
                            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-bold self-start sm:self-auto bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs"
                          >
                            {copiedField === "request_payload" ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied Payload</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy Payload</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {!currentPayloadInfo.isEmpty ? (
                        <pre className="text-xs bg-slate-950 text-emerald-400 p-5 rounded-2xl overflow-x-auto font-mono leading-relaxed max-h-72 border border-slate-800 shadow-inner select-all">
                          {currentPayloadInfo.text}
                        </pre>
                      ) : (
                        <div className="bg-white rounded-xl border border-slate-200/80 p-4 text-xs text-slate-500 italic flex items-center justify-between">
                          <span>
                            No request body payload submitted for this{" "}
                            <span className="font-bold text-slate-700">
                              {inspectedLog.request?.method || "API"}
                            </span>{" "}
                            request.
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            size: {formatBytes(inspectedLog.request?.request_size_bytes)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Section 4: REQUEST HEADERS (Full Width, Complete & Uncut) */}
                    <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                          <Layers className="h-4 w-4 text-blue-800" />
                          <span>Request Headers (Full View)</span>
                          <span className="bg-blue-100 text-blue-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                            {inspectedLog.request?.headers
                              ? Object.keys(inspectedLog.request.headers).length
                              : 0}{" "}
                            headers
                          </span>
                        </div>

                        {inspectedLog.request?.headers &&
                          Object.keys(inspectedLog.request.headers).length > 0 && (
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  JSON.stringify(inspectedLog.request?.headers, null, 2),
                                  "all_headers"
                                )
                              }
                              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-bold self-start sm:self-auto bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs"
                            >
                              {copiedField === "all_headers" ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  <span className="text-emerald-600">Copied All Headers</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy All Headers</span>
                                </>
                              )}
                            </button>
                          )}
                      </div>

                      {inspectedLog.request?.headers &&
                        Object.keys(inspectedLog.request.headers).length > 0 ? (
                        <div className="space-y-2.5">
                          {Object.entries(inspectedLog.request.headers).map(([key, val]) => (
                            <div
                              key={key}
                              className="flex flex-col sm:flex-row sm:items-start justify-between p-3.5 gap-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-200 transition-colors"
                            >
                              <div className="shrink-0 sm:w-48">
                                <span className="inline-block font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
                                  {key}
                                </span>
                              </div>

                              <div className="flex items-start justify-between gap-3 flex-1 min-w-0">
                                <div className="font-mono text-xs text-slate-800 break-all whitespace-pre-wrap select-all font-medium leading-relaxed w-full bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                                  {String(val)}
                                </div>
                                <button
                                  onClick={() => copyToClipboard(String(val), `hdr_${key}`)}
                                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 shrink-0"
                                  title={`Copy ${key} value`}
                                >
                                  {copiedField === `hdr_${key}` ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl border border-slate-200/80 p-4 text-xs text-slate-400 italic">
                          No request headers recorded for this log entry.
                        </div>
                      )}
                    </div>

                    {/* Section 5: Query Parameters (Full View) */}
                    <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          Query Parameters
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {inspectedLog.request?.query_params
                            ? Object.keys(inspectedLog.request.query_params).length
                            : 0}{" "}
                          params
                        </span>
                      </div>

                      {inspectedLog.request?.query_params &&
                        Object.keys(inspectedLog.request.query_params).length > 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100 text-xs shadow-xs">
                          {Object.entries(inspectedLog.request.query_params).map(
                            ([key, val]) => (
                              <div
                                key={key}
                                className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 gap-2"
                              >
                                <span className="font-mono font-bold text-slate-800">
                                  {key}
                                </span>
                                <span className="font-mono text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 break-all select-all">
                                  {String(val)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl border border-slate-200/80 p-4 text-xs text-slate-400 italic">
                          No query parameters passed.
                        </div>
                      )}
                    </div>

                    {/* Section 6: User Context & Service Metadata (2 Columns) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* User Context */}
                      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                          <User className="h-4 w-4 text-indigo-600" />
                          <span>User Context</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 text-xs">
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              User ID
                            </span>
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 mt-1">
                              <code className="font-mono text-[11px] text-slate-800 break-all select-all">
                                {inspectedLog.user?.user_id || "Anonymous / Unauthenticated"}
                              </code>
                              {inspectedLog.user?.user_id && (
                                <button
                                  onClick={() =>
                                    copyToClipboard(inspectedLog.user!.user_id!, "user_id")
                                  }
                                  className="text-slate-400 hover:text-slate-700 ml-2 shrink-0"
                                  title="Copy User ID"
                                >
                                  {copiedField === "user_id" ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Assigned Role
                              </span>
                              <span className="inline-block mt-1 font-bold text-slate-800 bg-slate-200 px-2.5 py-0.5 rounded text-xs">
                                {inspectedLog.user?.role || "None"}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Organization ID
                              </span>
                              <span className="font-mono text-slate-700 block mt-1 break-all">
                                {inspectedLog.user?.organization_id || "None"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Service & Deployment Environment */}
                      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                          <Server className="h-4 w-4 text-purple-600" />
                          <span>Service & Environment</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Service Name
                            </span>
                            <span className="font-bold text-slate-800">
                              {inspectedLog.service?.service_name || "underwriting-backend"}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Environment
                            </span>
                            <span className="inline-block font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded text-[11px]">
                              {inspectedLog.service?.environment || "development"}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Revision
                            </span>
                            <span className="font-mono text-slate-700 break-all">
                              {inspectedLog.service?.revision || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Git Commit
                            </span>
                            <span className="font-mono text-slate-700 break-all">
                              {inspectedLog.service?.git_commit || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Raw JSON Tab */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-semibold">
                        Complete unformatted MongoDB document for log{" "}
                        <code className="text-slate-800 font-bold">{inspectedLog._id}</code>
                      </span>
                      <Button
                        onClick={() =>
                          copyToClipboard(JSON.stringify(inspectedLog, null, 2), "raw_json")
                        }
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5 text-xs font-bold"
                      >
                        {copiedField === "raw_json" ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied Document</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Raw JSON</span>
                          </>
                        )}
                      </Button>
                    </div>

                    <pre className="text-xs bg-slate-950 text-emerald-400 p-6 rounded-2xl overflow-x-auto font-mono leading-relaxed max-h-[60vh] border border-slate-800 shadow-inner select-all">
                      {JSON.stringify(inspectedLog, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Tip: Use the <span className="font-bold text-slate-700">Raw JSON</span> tab to
                  view all exact MongoDB fields.
                </div>
                <Button
                  onClick={() => setInspectedLog(null)}
                  className="bg-[#000080] hover:bg-blue-900 text-white rounded-xl font-bold px-6 h-10 shadow-md"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
