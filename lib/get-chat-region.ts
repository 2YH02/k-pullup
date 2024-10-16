interface Region {
  name: string;
  code: string;
  title: string;
}

const regions: Region[] = [
  { name: "제주특별자치도", code: "jj", title: "제주도 채팅방" },
  { name: "전남", code: "jn", title: "전라남도 채팅방" },
  { name: "전북특별자치도", code: "jb", title: "전북특별자치도 채팅방" },
  { name: "경남", code: "gn", title: "경상남도 채팅방" },
  { name: "경북", code: "gb", title: "경상북도 채팅방" },
  { name: "대구", code: "dg", title: "대구 채팅방" },
  { name: "울산", code: "us", title: "울산 채팅방" },
  { name: "충북", code: "cb", title: "충청북도 채팅방" },
  { name: "충남", code: "cn", title: "충청남도 채팅방" },
  { name: "대전", code: "dj", title: "대전 채팅방" },
  { name: "강원특별자치도", code: "gw", title: "강원도 채팅방" },
  { name: "경기", code: "gg", title: "경기도 채팅방" },
  { name: "서울", code: "so", title: "서울 채팅방" },
  { name: "인천", code: "ic", title: "인천 채팅방" },
  { name: "부산", code: "bs", title: "부산 채팅방" },
];

const nameToCodeMap: Record<string, string> = {};
const codeToTitleMap: Record<string, string> = {};

regions.forEach(({ name, code, title }) => {
  nameToCodeMap[name] = code;
  codeToTitleMap[code] = title;
});

interface ChatRegion {
  getCode: (name: string) => string;
  getTitle: (code: string) => string | number;
}

const getChatRegion = (): ChatRegion => {
  const getCode = (name: string): string => {
    return nameToCodeMap[name] || "";
  };

  const getTitle = (code: string): string | number => {
    return codeToTitleMap[code] || 404;
  };

  return { getCode, getTitle };
};

export default getChatRegion;
