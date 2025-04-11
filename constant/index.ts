import type { Notice } from "@components/notice/notice-list";

export const CITIES = [
  { name: "서울", lat: 37.5665, lng: 126.978 },
  { name: "부산", lat: 35.1796, lng: 129.0756 },
  { name: "인천", lat: 37.4563, lng: 126.7052 },
  { name: "대구", lat: 35.8722, lng: 128.6018 },
  { name: "대전", lat: 36.3504, lng: 127.3845 },
  { name: "광주", lat: 35.1595, lng: 126.8526 },
  { name: "울산", lat: 35.5384, lng: 129.3114 },
  { name: "세종", lat: 36.48, lng: 127.289 },
  { name: "경기", lat: 37.4138, lng: 127.5183 },
  { name: "충북", lat: 36.6358, lng: 127.4914 },
  { name: "충남", lat: 36.6588, lng: 126.6728 },
  { name: "전남", lat: 34.8679, lng: 126.991 },
  { name: "전북", lat: 35.8204, lng: 127.1088 },
  { name: "경북", lat: 36.576, lng: 128.5056 },
  { name: "경남", lat: 35.2373, lng: 128.6927 },
  { name: "강원", lat: 37.8228, lng: 128.1555 },
  { name: "제주", lat: 33.4996, lng: 126.5312 },
];

export const CITIES_BADGE_TITLE = [
  "내 주변",
  "서울",
  "부산",
  "인천",
  "대구",
  "대전",
  "광주",
  "울산",
  "세종",
  "경기",
  "충북",
  "충남",
  "전남",
  "전북",
  "경남",
  "경북",
  "강원",
  "제주",
];

export const REGION_CHAT = [
  { title: "서울 채팅방", code: "so" },
  { title: "경기 채팅방", code: "gg" },
  { title: "인천 채팅방", code: "ic" },
  { title: "부산 채팅방", code: "bs" },
  { title: "대전 채팅방", code: "dj" },
  { title: "제주도 채팅방", code: "jj" },
  { title: "충남 채팅방", code: "cn" },
  { title: "충북 채팅방", code: "cb" },
  { title: "전남 채팅방", code: "jn" },
  { title: "전북 채팅방", code: "jb" },
  { title: "경남 채팅방", code: "gn" },
  { title: "경북 채팅방", code: "gb" },
  { title: "대구 채팅방", code: "dg" },
  { title: "강원 채팅방", code: "gw" },
  { title: "울산 채팅방", code: "us" },
];

export const BASE_URL = "https://www.k-pullup.com";

export const ALL_NOTICE: Notice[] = [
  // {
  //   id: 0,
  //   category: "일반",
  //   title:
  //     "[모집] 안드로이드 앱 베타 테스터를 찾습니다! (테스트 후 커피쿠폰 제공☕️)",
  //   content: `<br/>안녕하세요, ‘대한민국 철봉 지도’ 개발자입니다.<br/><br/>
  // 드디어 안드로이드 앱 출시를 앞두고 있습니다! 🎉<br/>
  // 정식 출시 전, 실제 사용자분들의 피드백을 통해 더 나은 서비스를 제공하고자 **테스터 10명**을 모집합니다.<br/>(선착순 마감)<br/><br/>

  // ✅ **테스터 조건**<br/>
  // - 안드로이드 스마트폰 사용자<br/>
  // (IOS는 이후 따로 출시 예정입니다.)<br/>
  // - 대한민국 철봉 지도 웹사이트를 사용해보신 분<br/><br/>

  // 📱 **테스트 내용**<br/>
  // - 앱 설치 후 실제 사용해보기<br/>
  // - 간단한 설문 피드백 제출<br/><br/>

  // 🎁 **보상**<br/>
  // - 테스트 완료 후 참여자 전원 **스타벅스 아메리카노 기프티콘 제공!**<br/><br/>

  // 📌 **참여 방법**<br/>
  // 아래 링크를 눌러 신청서를 작성해 주세요.<br/>
  // 👉 <a href="https://docs.google.com/forms/d/e/1FAIpQLSfOoEacqoZCA0t5EF2WrLl0odPpeWlW1inDeS84JoTKMu-Jfw/viewform?usp=header" class="notice-link" target="_blank">[테스터 신청서 작성하러 가기]</a><br/><br/>

  // 많은 참여 부탁드립니다. 감사합니다! 🙇‍♂️`,
  //   createdAt: "2025-04-09",
  // },
  {
    id: 1,
    category: "업데이트",
    title: "신규 기능 안내 - 모먼트 추가",
    content: `<br/>
안녕하세요, 여러분!
<br/><br/>
운동 기록을 보다 쉽고 즐겁게 공유할 수 있도록 새 기능 ‘모먼트’를 오픈했습니다.
<br/>
이제 하루 동안의 운동 완료(오운완) 순간을 사진 1장과 짧은 캡션으로 공유해 보세요.
<br/><br/>
올린 게시물은 24시간 동안만 공개되고, 그 후에는 자동으로 사라집니다.
<br/><br/>
- 사용 방법:<br/>
1. 원하는 위치에 모먼트 메뉴에서 사진을 선택하고,<br/>
2. 간단한 한 줄 캡션을 작성하면 끝!
<br/><br/>
매일 꾸준히 운동을 실천하는 모습을 서로에게 공유하면서, 더욱 큰 동기부여와 재미를 얻어가시길 바랍니다.<br/><br/>
앞으로도 더 편리하고 즐거운 기능을 제공하기 위해 최선을 다하겠습니다. 많은 이용 부탁드립니다!

감사합니다.`,
    createdAt: "2024-12-20",
  },
  {
    id: 2,
    category: "일반",
    title: "대한민국 철봉 지도 사용에 감사드립니다!",
    content: `<br/>안녕하세요, ‘대한민국 철봉 지도’ 운영자입니다.<br/><br/>
사이트를 만들고 준비하는 과정에서 많은 분들의 관심과 응원을 받았습니다. 철봉 위치 제보부터 직접 테스트까지 기꺼이 참여해주신 여러분 덕분에 더욱 알차고 의미 있는 서비스를 선보일 수 있었습니다.<br/>
<br/>
앞으로도 계속해서 대한민국 곳곳의 철봉 정보를 공유하고, 많은 분들께 편리하고 유익한 정보를 제공할 수 있도록 최선을 다하겠습니다. 언제든지 문의나 제보 사항이 있으시면 주저하지 마시고 의견을 보내주세요.
<br/><br/>
여러분의 관심과 참여에 다시 한 번 감사드립니다. 앞으로도 많은 사랑과 응원 부탁드립니다!`,
    createdAt: "2024-02-28",
  },
];

export const UPDATE_NOTICE: Notice[] = [
  {
    id: 0,
    category: "업데이트",
    title: "신규 기능 안내 - 모먼트 추가",
    content: `
안녕하세요, 여러분!
<br/><br/>
운동 기록을 보다 쉽고 즐겁게 공유할 수 있도록 새 기능 ‘모먼트’를 오픈했습니다.
<br/>
이제 하루 동안의 운동 완료(오운완) 순간을 인스타 스토리처럼 사진 1장과 짧은 캡션으로 공유해 보세요.
<br/><br/>
올린 게시물은 24시간 동안만 공개되고, 그 후에는 자동으로 사라집니다.
<br/><br/>
- 사용 방법:<br/>
1. 원하는 위치에 모먼트 메뉴에서 사진을 선택하고,
2. 간단한 한 줄 캡션을 작성하면 끝!
<br/><br/>
매일 꾸준히 운동을 실천하는 모습을 서로에게 공유하면서, 더욱 큰 동기부여와 재미를 얻어가시길 바랍니다.<br/><br/>
앞으로도 더 편리하고 즐거운 기능을 제공하기 위해 최선을 다하겠습니다. 많은 이용 부탁드립니다!

감사합니다.`,
    createdAt: "2024-12-20",
  },
];

export const NOTICE: Notice[] = [
  {
    id: 1,
    category: "일반",
    title: "감사합니다",
    content: "저희 사이트를 이용해 주셔서 정말 감사합니다.",
    createdAt: "2024-12-14",
  },
];
