export interface SearchMarkerMock {
  markerId: number;
  address: string;
  thumbnailUrl?: string;
  photoCount?: number;
  facilityCount?: number;
  facilityTotal?: number;
}

export const searchMarkerFixtures: SearchMarkerMock[] = [
  {
    markerId: 9101,
    address: "서울특별시 마포구 월드컵북로 120",
    thumbnailUrl: "/pullup1.jpg",
    photoCount: 4,
    facilityCount: 2,
    facilityTotal: 5,
  },
  {
    markerId: 9102,
    address: "서울특별시 마포구 성산동 515",
    thumbnailUrl: "/pullup2.jpg",
    photoCount: 1,
    facilityCount: 1,
    facilityTotal: 2,
  },
  {
    markerId: 9103,
    address: "서울특별시 서대문구 연희로 90",
    facilityCount: 3,
    facilityTotal: 7,
  },
  { markerId: 9104, address: "서울특별시 은평구 통일로 684" },
];
