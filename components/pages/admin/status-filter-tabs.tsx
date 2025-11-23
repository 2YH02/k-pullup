"use client";

import cn from "@lib/cn";
import { Check, Clock, ListFilter, X } from "lucide-react";

interface StatusFilterTabsProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  counts: {
    all: number;
    pending: number;
    approved: number;
    denied: number;
  };
}

const tabs = [
  {
    id: "all",
    label: "전체",
    icon: ListFilter,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    activeColor: "bg-gray-700 text-white",
  },
  {
    id: "pending",
    label: "대기중",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    activeColor: "bg-yellow-500 text-white",
  },
  {
    id: "approved",
    label: "승인됨",
    icon: Check,
    color: "text-green-600",
    bgColor: "bg-green-100",
    activeColor: "bg-green-500 text-white",
  },
  {
    id: "denied",
    label: "거부됨",
    icon: X,
    color: "text-red-600",
    bgColor: "bg-red-100",
    activeColor: "bg-red-500 text-white",
  },
];

/**
 * Modern pill-based status filter tabs
 */
const StatusFilterTabs = ({
  selectedStatus,
  onStatusChange,
  counts,
}: StatusFilterTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const count = counts[tab.id as keyof typeof counts];
        const isActive = selectedStatus === tab.id;

        const activeStyles = isActive
          ? {
              backgroundColor:
                tab.id === "pending"
                  ? "#eab308"
                  : tab.id === "approved"
                  ? "#22c55e"
                  : tab.id === "denied"
                  ? "#ef4444"
                  : "#374151",
              color: "#ffffff",
            }
          : {
              backgroundColor:
                tab.id === "pending"
                  ? "#fef3c7"
                  : tab.id === "approved"
                  ? "#dcfce7"
                  : tab.id === "denied"
                  ? "#fee2e2"
                  : "#f3f4f6",
              color:
                tab.id === "pending"
                  ? "#92400e"
                  : tab.id === "approved"
                  ? "#166534"
                  : tab.id === "denied"
                  ? "#991b1b"
                  : "#374151",
            };

        return (
          <button
            key={tab.id}
            onClick={() => onStatusChange(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 border-2 border-transparent hover:border-gray-300"
            style={activeStyles}
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium text-sm">{tab.label}</span>
            <span
              className="ml-1 px-2 py-0.5 text-xs font-bold rounded-md"
              style={
                isActive
                  ? { backgroundColor: "rgba(0, 0, 0, 0.2)", color: "#ffffff" }
                  : { backgroundColor: "rgba(255, 255, 255, 0.7)", color: "#1f2937" }
              }
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilterTabs;
