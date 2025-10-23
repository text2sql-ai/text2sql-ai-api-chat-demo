/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, Info, Maximize2 } from "lucide-react";
import { useState } from "react";

interface QueryResultsTableProps {
  rows: Record<string, any>[];
  onLimitChange?: (limit: number) => void;
  limit?: number;
}

const ROW_LIMIT_OPTIONS = [100, 500, 1000, 5000];

const convertToCSV = ({ rows, columns }: { rows: Record<string, any>[]; columns: string[] }) => {
  const header = columns.join(",");
  const csvRows = rows.map((row) =>
    columns
      .map((col) => {
        const value = String(row[col]);
        // Escape quotes and wrap in quotes if contains comma or newline
        return value.includes(",") || value.includes("\n") || value.includes('"')
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      })
      .join(",")
  );
  return [header, ...csvRows].join("\n");
};

interface ResultsTableProps {
  rows: Record<string, any>[];
  columns: string[];
  className?: string;
}

const ResultsTable = ({ rows, columns, className = "" }: ResultsTableProps) => (
  <table
    data-testid="query-results-table"
    className={`mb-0 mt-0 w-full min-w-full text-left text-sm text-gray-300 ${className}`}
  >
    <thead className="sticky -top-0.5 z-10 bg-gray-900 text-xs uppercase">
      <tr>
        {columns.map((column) => (
          <th key={column} className="max-w-[250px] whitespace-nowrap px-4 py-2">
            {column}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="ph-no-capture">
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex} className="border-t border-gray-800 bg-gray-950 hover:bg-gray-900">
          {columns.map((column) => (
            <td key={`${rowIndex}-${column}`} className="max-w-[250px] truncate px-4 py-2">
              {String(row[column])}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export const QueryResultsTable = ({ rows, onLimitChange, limit }: QueryResultsTableProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (rows.length === 0) {
    return (
      <div data-testid="no-results-found" className="mt-2 text-sm text-gray-300">
        Success. No results found.
      </div>
    );
  }

  const columns = Object.keys(rows[0]!);
  const isLimited = rows.length === limit;

  const handleExportCSV = () => {
    const csv = convertToCSV({ rows, columns });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "query-results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="flex h-[95vh] max-h-[95vh] max-w-[95vw] flex-col p-0">
          <DialogHeader className="px-6 py-4">
            <DialogTitle>Query Results</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto px-6 pb-6">
            <div className="h-full w-full overflow-auto no-scrollbar">
              <ResultsTable rows={rows} columns={columns} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-2 flex flex-col rounded-lg border border-gray-700 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-700 px-4 py-2">
          <div className="text-sm text-gray-300">
            {rows.length} {rows.length === 1 ? "row" : "rows"} found
          </div>
          <div className="flex gap-2">
            <Button
              data-testid="query-results-table-full-screen-button"
              variant="outline"
              size="sm"
              onClick={() => setIsFullScreen(true)}
              className="h-8"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              data-testid="query-results-table-export-csv-button"
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="h-8"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="max-h-[500px] overflow-x-auto no-scrollbar">
          <ResultsTable rows={rows} columns={columns} />
        </div>
        {isLimited && (
          <div className="flex flex-col gap-3 border-t border-gray-700 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">
                      <span className="flex items-center gap-1 text-xs">
                        (Limited to only {limit} rows)
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[500px] p-3 text-xs leading-relaxed" sideOffset={5}>
                      <p className="m-0 whitespace-normal p-0">
                        Results are limited to optimize browser performance, especially for queries returning large
                        datasets. You can adjust or remove this limit using the dropdown.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Limit results to:</span>
              <Select value={limit?.toString()} onValueChange={(value) => onLimitChange?.(Number(value))}>
                <SelectTrigger data-testid="query-results-limit-select" className="h-8 w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROW_LIMIT_OPTIONS.map((limit) => (
                    <SelectItem key={limit} value={limit.toString()}>
                      {limit} rows
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
