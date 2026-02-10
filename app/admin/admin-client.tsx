"use client";

import { Input } from "@/components/ui/input";
import approveReport from "@api/report/approve-report";
import denyReport from "@api/report/deny-report";
import type { AllReport, AllReportRes } from "@api/report/get-all-reports";
import cn from "@lib/cn";
import useAlertStore from "@store/useAlertStore";
import {
  ArrowDownUp,
  Search,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ReportCard from "@pages/admin/report-card";
import StatusFilterTabs from "@pages/admin/status-filter-tabs";
import Pagination from "@pages/admin/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "newest" | "oldest" | "priority";

const AdminClient = ({ data }: { data: AllReportRes }) => {
  const router = useRouter();
  const { openAlert, closeAlert } = useAlertStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // ✅ FIX: Add `data` as dependency to refresh when data changes
  const allReports = useMemo(() => {
    const reports: AllReport[] = [];
    Object.values(data.markers).forEach((marker) => {
      marker.reports.forEach((report) => {
        reports.push(report);
      });
    });
    return reports;
  }, [data]); // ✅ FIXED: Added data dependency

  const filteredReports = useMemo(() => {
    let filtered = allReports.filter((report) => {
      const matchesSearch =
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportId.toString().includes(searchTerm) ||
        report.markerId.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });

    // Sort reports
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "priority":
          // Priority: PENDING > high-priority descriptions > photos > oldest
          const aPriority =
            a.status === "PENDING"
              ? 3
              : a.description.includes("없음") || a.description.includes("철거")
              ? 2
              : a.photoUrls && a.photoUrls.length > 0
              ? 1
              : 0;
          const bPriority =
            b.status === "PENDING"
              ? 3
              : b.description.includes("없음") || b.description.includes("철거")
              ? 2
              : b.photoUrls && b.photoUrls.length > 0
              ? 1
              : 0;
          return bPriority - aPriority;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allReports, searchTerm, statusFilter, sortBy]);

  const statusCounts = useMemo(() => {
    return {
      all: allReports.length,
      pending: allReports.filter((r) => r.status === "PENDING").length,
      approved: allReports.filter((r) => r.status === "APPROVED").length,
      denied: allReports.filter((r) => r.status === "DENIED").length,
    };
  }, [allReports]);

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReports.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredReports, currentPage, ITEMS_PER_PAGE]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  const handleApprove = (reportId: number) => {
    openAlert({
      title: "정말 승인하시겠습니까?",
      description: "해당 위치의 정보가 바뀝니다.",
      onClickAsync: async () => {
        setProcessingIds((prev) => new Set(prev).add(reportId));

        try {
          const response = await approveReport(reportId);

          if (!response.ok) {
            closeAlert();
            openAlert({
              title: "승인할 수 없습니다.",
              description: "잠시 후 다시 시도해주세요.",
              onClick: () => {},
            });
            return;
          }

          closeAlert();
          openAlert({
            title: "승인 완료",
            description: "승인이 완료되었습니다.",
            onClick: () => {
              router.refresh();
            },
          });

          // Refresh to get updated data
          router.refresh();
        } catch (error) {
          console.error("Approve error:", error);
          closeAlert();
          openAlert({
            title: "오류 발생",
            description: "승인 처리 중 오류가 발생했습니다.",
            onClick: () => {},
          });
        } finally {
          setProcessingIds((prev) => {
            const next = new Set(prev);
            next.delete(reportId);
            return next;
          });
        }
      },
      cancel: true,
    });
  };

  const handleReject = (reportId: number) => {
    openAlert({
      title: "정말 거절하시겠습니까?",
      description: "다시 승인할 수 없습니다.",
      onClickAsync: async () => {
        setProcessingIds((prev) => new Set(prev).add(reportId));

        try {
          const response = await denyReport(reportId);

          if (!response.ok) {
            closeAlert();
            openAlert({
              title: "거절할 수 없습니다.",
              description: "잠시 후 다시 시도해주세요.",
              onClick: () => {},
            });
            return;
          }

          closeAlert();
          openAlert({
            title: "거절 완료",
            description: "거절이 완료되었습니다.",
            onClick: () => {
              router.refresh();
            },
          });

          // Refresh to get updated data
          router.refresh();
        } catch (error) {
          console.error("Deny error:", error);
          closeAlert();
          openAlert({
            title: "오류 발생",
            description: "거절 처리 중 오류가 발생했습니다.",
            onClick: () => {},
          });
        } finally {
          setProcessingIds((prev) => {
            const next = new Set(prev);
            next.delete(reportId);
            return next;
          });
        }
      },
      cancel: true,
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold text-black hover:underline cursor-pointer"
              onClick={() => router.push("/")}
            >
              대한민국 철봉 지도
            </h1>
            <p className="text-grey-dark mt-1 text-sm md:text-base">
              위치 수정 요청 관리 시스템
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-3xl md:text-4xl font-bold text-blue">
              {data.totalReports}
            </div>
            <div className="text-sm text-gray-500">총 신고 건수</div>
          </div>
        </div>
      </Container>

      {/* Status Filter Tabs */}
      <Container>
        <StatusFilterTabs
          selectedStatus={statusFilter}
          onStatusChange={setStatusFilter}
          counts={statusCounts}
        />
      </Container>

      {/* Search and Sort */}
      <Container>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="신고 ID, 마커 ID, 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-48 text-black">
              <ArrowDownUp className="h-4 w-4 mr-2" />
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="newest">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
              <SelectItem value="priority">우선순위</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Info */}
        <div className="mt-3 text-sm text-gray-600">
          {filteredReports.length}개의 신고
          {searchTerm && ` (검색 결과)`}
        </div>
      </Container>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <Container>
          <div className="text-center py-16">
            <div className="text-gray-400 mb-2">
              <Search className="h-12 w-12 mx-auto mb-3" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              검색 결과가 없습니다
            </h3>
            <p className="text-sm text-gray-500">
              다른 검색어나 필터를 시도해보세요
            </p>
          </div>
        </Container>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {paginatedReports.map((report) => (
              <div key={report.reportId} className="relative">
                {processingIds.has(report.reportId) && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs z-10 rounded-xl flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue" />
                  </div>
                )}
                <ReportCard
                  report={report}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredReports.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </>
      )}
    </div>
  );
};

const Container = ({
  className,
  children,
}: React.PropsWithChildren<{
  className?: React.ComponentProps<"div">["className"];
}>) => {
  return (
    <div className={cn("bg-white rounded-lg shadow-xs border p-4 md:p-6", className)}>
      {children}
    </div>
  );
};

export default AdminClient;
