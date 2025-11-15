"use client";

import type { AllReport } from "@api/report/get-all-reports";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@common/button";
import cn from "@lib/cn";
import {
  formatRelativeTime,
  isHighPriority,
  calculateDistance,
  formatDistance,
} from "@lib/admin-utils";
import {
  AlertTriangle,
  Calendar,
  Check,
  ExternalLink,
  FileText,
  MapPin,
  User,
  X,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ImageGallery from "./image-gallery";
import LocationComparison from "./location-comparison";
import LocationWithAddress from "./location-with-address";

interface ReportCardProps {
  report: AllReport;
  onApprove: (reportId: number) => void;
  onReject: (reportId: number) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold"
          style={{ backgroundColor: '#22c55e', color: '#ffffff' }}
        >
          <Check className="h-3 w-3" />
          승인됨
        </span>
      );
    case "DENIED":
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold"
          style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
        >
          <X className="h-3 w-3" />
          거부됨
        </span>
      );
    case "PENDING":
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold"
          style={{ backgroundColor: '#eab308', color: '#ffffff' }}
        >
          <AlertTriangle className="h-3 w-3" />
          대기중
        </span>
      );
    default:
      return (
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border"
          style={{ backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' }}
        >
          {status}
        </span>
      );
  }
};

/**
 * Modern report card with inline images and actions
 */
const ReportCard = ({ report, onApprove, onReject }: ReportCardProps) => {
  const isPriority = isHighPriority(report.description);
  const distance = calculateDistance(
    report.latitude,
    report.longitude,
    report.newLatitude,
    report.newLongitude
  );
  const hasMoved = distance > 0.5;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg",
        isPriority ? "border-red-300 bg-red-50/30" : "border-gray-200",
        report.status === "PENDING" ? "hover:border-blue-300" : ""
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Report ID Badge */}
          <div className="flex flex-col gap-1">
            <span
              className="inline-flex items-center font-mono text-xs px-2 py-1 rounded-md border"
              style={{ backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' }}
            >
              #{report.reportId}
            </span>
            <span
              className="inline-flex items-center font-mono text-xs px-2 py-1 rounded-md border"
              style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#93c5fd' }}
            >
              마커 #{report.markerId}
            </span>
          </div>

          {/* Meta Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge(report.status)}
              {isPriority && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold"
                  style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                >
                  <AlertTriangle className="h-3 w-3" />
                  긴급
                </span>
              )}
              {hasMoved && (
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border"
                  style={{ backgroundColor: '#fff7ed', color: '#ea580c', borderColor: '#fdba74' }}
                >
                  {formatDistance(distance)} 이동
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {report.userId === 0 ? "익명" : `사용자 ${report.userId}`}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatRelativeTime(report.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Thumbnails (if exists) */}
      {report.photoUrls && report.photoUrls.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2">
            {report.photoUrls.slice(0, 3).map((url, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 group cursor-pointer"
              >
                <Image
                  src={url}
                  alt={`Report photo ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-200"
                  unoptimized
                />
                {index === 2 && report.photoUrls && report.photoUrls.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      +{report.photoUrls.length - 3}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-4">
        <p
          className={cn(
            "text-gray-700 text-sm leading-relaxed",
            !report.description && "text-gray-400 italic"
          )}
        >
          {report.description || "설명이 제공되지 않았습니다."}
        </p>
      </div>

      {/* Location Info with Address */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <LocationWithAddress
          lat={report.newLatitude}
          lng={report.newLongitude}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Detail Modal Button */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors text-gray-700 font-medium text-sm">
              <FileText className="h-4 w-4" />
              상세 보기
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-gray-900">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-black">
                신고 상세 정보 #{report.reportId}
                {isPriority && (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold"
                    style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                  >
                    <AlertTriangle className="h-3 w-3" />
                    긴급
                  </span>
                )}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                마커 #{report.markerId}에 대한 수정 요청
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Status and Meta */}
              <div className="flex items-center gap-3">
                {getStatusBadge(report.status)}
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  {report.userId === 0
                    ? "익명 사용자"
                    : `사용자 ID: ${report.userId}`}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {formatRelativeTime(report.createdAt)}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  신고 내용
                </label>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border">
                  {report.description || "설명이 제공되지 않았습니다."}
                </p>
              </div>

              {/* Location Comparison */}
              <LocationComparison
                oldLat={report.latitude}
                oldLng={report.longitude}
                newLat={report.newLatitude}
                newLng={report.newLongitude}
              />

              {/* Photos */}
              {report.photoUrls && report.photoUrls.length > 0 && (
                <ImageGallery images={report.photoUrls} />
              )}

              {/* Link to Marker */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  마커 페이지
                </label>
                <Link
                  href={`https://www.k-pullup.com/pullup/${report.markerId}`}
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-blue hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {`https://www.k-pullup.com/pullup/${report.markerId}`}
                </Link>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Action Buttons (Approve/Reject) */}
        {report.status === "PENDING" && (
          <>
            <Button
              size="sm"
              onClick={() => onApprove(report.reportId)}
              className="bg-green dark:bg-green hover:bg-green-600"
            >
              <Check className="h-4 w-4 mr-1" />
              승인
            </Button>
            <Button
              size="sm"
              onClick={() => onReject(report.reportId)}
              className="bg-red dark:bg-red hover:bg-red-600"
            >
              <X className="h-4 w-4 mr-1" />
              거부
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
