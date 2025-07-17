"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import approveReport from "@api/report/approve-report";
import denyReport from "@api/report/deny-report";
import type { AllReport, AllReportRes } from "@api/report/get-all-reports";
import Button from "@common/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import cn from "@lib/cn";
import useAlertStore from "@store/useAlertStore";
import {
  Calendar,
  Check,
  FileText,
  ImageIcon,
  MapPin,
  Search,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const sampleData: AllReportRes = {
  totalReports: 191,
  markers: {
    "1": {
      reports: [
        {
          latitude: 36.066447,
          longitude: 129.371552,
          newLatitude: 36.066447,
          newLongitude: 129.371552,
          createdAt: "2024-07-18T12:11:25Z",
          reportId: 167,
          markerId: 1,
          userId: 1,
          description: "철봉 없음",
          status: "PENDING" as const,
          doesExist: true,
        },
      ],
    },
    "9": {
      reports: [
        {
          latitude: 37.553847,
          longitude: 127.153826,
          newLatitude: 37.553847,
          newLongitude: 127.153826,
          createdAt: "2024-06-16T08:46:22Z",
          reportId: 95,
          markerId: 9,
          userId: 0,
          description: "",
          status: "APPROVED" as const,
          doesExist: true,
        },
      ],
    },
    "15": {
      reports: [
        {
          latitude: 37.299917,
          longitude: 126.83893699999999,
          newLatitude: 37.299917,
          newLongitude: 126.83893699999999,
          createdAt: "2025-05-26T11:03:08Z",
          reportId: 342,
          markerId: 15,
          userId: 0,
          description: "제일 높은철봉 철거",
          status: "PENDING" as const,
          doesExist: true,
        },
      ],
    },
    "4822": {
      reports: [
        {
          latitude: 37.584234,
          longitude: 126.679121,
          newLatitude: 37.584234,
          newLongitude: 126.679121,
          createdAt: "2025-02-17T05:17:35Z",
          reportId: 313,
          markerId: 4822,
          userId: 0,
          description: "3단 철봉, 평행봉, 건너편 비닐하우스 옆에 주차",
          photoUrls: [
            "https://chulbong-kr.s3.amazonaws.com/reports/b235ff8d-d909-4903-bd30-fe6e13bd7714.webp",
            "https://chulbong-kr.s3.amazonaws.com/reports/69b95b30-6626-47c1-8d2b-99677b5e84bd.webp",
          ],
          status: "DENIED" as const,
          doesExist: true,
        },
      ],
    },
  },
};

const AdminClient = ({ data }: { data: AllReportRes }) => {
  const router = useRouter();
  const { openAlert, closeAlert } = useAlertStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [_, setSelectedReport] = useState<AllReport | null>(null);

  const allReports = useMemo(() => {
    const reports: AllReport[] = [];
    Object.values(data.markers).forEach((marker) => {
      marker.reports.forEach((report) => {
        reports.push(report);
      });
    });
    return reports.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, []);

  const filteredReports = useMemo(() => {
    return allReports.filter((report) => {
      const matchesSearch =
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportId.toString().includes(searchTerm) ||
        report.markerId.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [allReports, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    return allReports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [allReports]);

  const handleApprove = (reportId: number) => {
    openAlert({
      title: "정말 승인하시겠습니까?",
      description: "해당 위치의 정보가 바뀝니다.",
      onClickAsync: async () => {
        const response = await approveReport(reportId);
        if (!response.ok) {
          closeAlert();
          openAlert({
            title: "승인할 수 없습니다.",
            description: "잠시 후 다시 시도해주세요.",
            onClick: () => {},
          });

          router.refresh();
          return;
        }

        openAlert({
          title: "승인 완료",
          description: "승인이 완료되었습니다.",
          onClick: () => {},
        });

        router.refresh();
      },
      cancel: true,
    });
  };

  const handleReject = (reportId: number) => {
    openAlert({
      title: "정말 거절하시겠습니까?",
      description: "다시 승인할 수 없습니다.",
      onClickAsync: async () => {
        const response = await denyReport(reportId);
        if (!response.ok) {
          closeAlert();
          openAlert({
            title: "거절할 수 없습니다.",
            description: "잠시 후 다시 시도해주세요.",
            onClick: () => {},
          });

          router.refresh();
          return;
        }

        openAlert({
          title: "거절 완료",
          description: "거절이 완료되었습니다.",
          onClick: () => {},
        });
        router.refresh();
      },
      cancel: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-4 max-w-[1280px] mx-auto">
      {/* 헤더 */}
      <Container>
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold text-black hover:underline cursor-pointer"
              onClick={() => router.push("/")}
            >
              대한민국 철봉 지도
            </h1>
            <p className="text-grey-dark mt-1">위치 수정 요청 관리 시스템</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue">
              {sampleData.totalReports}
            </div>
            <div className="text-sm text-gray-500">총 신고 건수</div>
          </div>
        </div>
      </Container>

      {/* 상태 카드 */}
      <div className="flex gap-3">
        <StatusCard
          title="대기중"
          count={statusCounts.PENDING || 0}
          color="text-yellow"
        />
        <StatusCard
          title="승인됨"
          count={statusCounts.APPROVED || 0}
          color="text-green"
        />
        <StatusCard
          title="거부됨"
          count={statusCounts.DENIED || 0}
          color="text-red"
        />
        <StatusCard
          title="전체"
          count={allReports.length || 0}
          color="text-blue"
        />
      </div>

      {/* 리스트 */}
      <Container>
        <div className="mb-3">
          <h2 className="text-black font-bold text-xl">신고 목록</h2>
          <p className="text-grey-dark text-sm">
            사용자가 제출한 위치 수정 요청을 관리하세요
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="신고 ID, 마커 ID, 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 text-black">
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="pending">대기중</SelectItem>
              <SelectItem value="approved">승인됨</SelectItem>
              <SelectItem value="denied">거부됨</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Reports Table */}
        <div className="rounded-md border text-black">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>신고 ID</TableHead>
                <TableHead>마커 ID</TableHead>
                <TableHead>사용자</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>위치</TableHead>
                <TableHead>날짜</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.reportId}>
                  <TableCell className="font-medium">
                    #{report.reportId}
                  </TableCell>
                  <TableCell>#{report.markerId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {report.userId === 0 ? "익명" : `사용자 ${report.userId}`}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">
                      {report.description || "설명 없음"}
                    </div>
                    {report.photoUrls && report.photoUrls.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <ImageIcon className="h-3 w-3 text-blue" />
                        <span className="text-xs text-blue">
                          {report.photoUrls.length}개 사진
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {report.newLatitude.toFixed(4)},{" "}
                      {report.newLongitude.toFixed(4)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(report.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-black">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                            className="bg-white border dark:bg-white dark:border"
                          >
                            <FileText className="h-4 w-4 text-grey-dark" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-white">
                          <DialogHeader>
                            <DialogTitle>
                              신고 상세 정보 #{report.reportId}
                            </DialogTitle>
                            <DialogDescription>
                              마커 #{report.markerId}에 대한 수정 요청
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700">
                                  현재 위치
                                </label>
                                <p className="text-sm text-gray-600">
                                  {report.latitude.toFixed(6)},{" "}
                                  {report.longitude.toFixed(6)}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">
                                  새 위치
                                </label>
                                <p className="text-sm text-gray-600">
                                  {report.newLatitude.toFixed(6)},{" "}
                                  {report.newLongitude.toFixed(6)}
                                </p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                설명
                              </label>
                              <p className="text-sm text-gray-600 mt-1">
                                {report.description ||
                                  "설명이 제공되지 않았습니다."}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                링크
                              </label>
                              <p className="text-sm text-blue underline mt-1">
                                <Link
                                  href={`https://www.k-pullup.com/pullup/${report.markerId}`}
                                  target="_blank"
                                >
                                  {`https://www.k-pullup.com/pullup/${report.markerId}`}
                                </Link>
                              </p>
                            </div>
                            {report.photoUrls &&
                              report.photoUrls.length > 0 && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">
                                    첨부 사진
                                  </label>
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    {report.photoUrls.map((url, index) => (
                                      <img
                                        key={index}
                                        src={url || "/placeholder.svg"}
                                        alt={`Report photo ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-md border"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            <div className="flex items-center gap-2 pt-4">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <User className="h-4 w-4" />
                                {report.userId === 0
                                  ? "익명 사용자"
                                  : `사용자 ID: ${report.userId}`}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                {formatDate(report.createdAt)}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {report.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(report.reportId)}
                            className="bg-green dark:bg-green"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReject(report.reportId)}
                            className="bg-red dark:bg-red"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            검색 조건에 맞는 신고가 없습니다.
          </div>
        )}
      </Container>
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
    <div className={cn("bg-white rounded-lg shadow-sm border p-6", className)}>
      {children}
    </div>
  );
};

const StatusCard = ({
  title,
  color,
  count,
}: {
  title: string;
  count: number;
  color?: string;
}) => {
  return (
    <Container className={cn("grow")}>
      <div className="text-sm font-medium text-gray-600">{title}</div>
      <div className={cn("text-2xl font-bold", color)}>{count}</div>
    </Container>
  );
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return (
        <Badge variant="default" className="bg-green text-white">
          승인됨
        </Badge>
      );
    case "DENIED":
      return (
        <Badge variant="destructive" className="bg-red text-white">
          거부됨
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="secondary" className="bg-yellow text-white">
          대기중
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default AdminClient;
