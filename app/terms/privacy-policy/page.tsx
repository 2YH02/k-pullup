import SideMain from "@common/side-main";
import Section from "@pages/terms/section";

const PrivacyPolicyPage = () => {
  return (
    <SideMain headerTitle="개인정보처리방침" fullHeight hasBackButton>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          개인정보처리방침
        </h1>

        <Section title="1. 개인정보 수집 항목 및 수집 방법">
          <p>대한민국 철봉 지도는 다음과 같은 개인정보를 수집합니다.</p>
          <ul className="list-disc list-inside mt-2">
            <li>이메일 (회원가입 및 로그인 시)</li>
            <li>프로필 정보 (닉네임)</li>
            <li>위치 정보 (철봉 위치 등록 시)</li>
            <li>디바이스 정보 (서비스 이용 과정에서 자동 수집)</li>
            <li>서비스 이용 기록, 접속 로그, 쿠키</li>
          </ul>
          <p className="mt-4">
            수집 방법: 회원가입, 서비스 이용 과정, 구글 애널리틱스를 통한 자동
            수집
          </p>
        </Section>

        <Section title="2. 개인정보 수집 및 이용 목적">
          <ul className="list-disc list-inside mt-2">
            <li>회원가입 및 서비스 이용 관리</li>
            <li>철봉 위치 등록 및 조회 서비스 제공</li>
            <li>서비스 개선 및 사용자 통계 분석 (구글 애널리틱스 활용)</li>
            <li>부정 이용 방지 및 보안 강화</li>
            <li>광고 표시 및 광고 성과 분석 (광고 수익 창출 목적)</li>
          </ul>
        </Section>

        <Section title="3. 개인정보 보유 및 이용 기간">
          <p>
            회원 탈퇴 시 즉시 파기합니다. 단, 다음 정보는 아래 기간 동안
            보관합니다.
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>부정 이용 기록: 최대 1년</li>
            <li>관계 법령에 따른 보관 정보: 법정 기간 동안 보관</li>
          </ul>
        </Section>

        <Section title="4. 개인정보의 제3자 제공 및 위탁">
          <p>
            서비스는 원칙적으로 이용자의 동의 없이 개인정보를 제3자에게 제공하지
            않습니다. 다만, 다음 경우에 한해 제공될 수 있습니다.
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>법령에 따른 요구가 있는 경우</li>
            <li>수사기관의 요청이 있는 경우</li>
          </ul>
          <p className="mt-4">
            또한 서비스 분석 및 광고 제공을 위해 다음과 같이 개인정보 처리를
            위탁합니다.
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>구글 애널리틱스: 서비스 이용 분석 및 통계 처리</li>
            <li>
              광고 플랫폼 (구글 애드센스 등): 맞춤형 광고 제공 및 광고 성과 분석
            </li>
          </ul>
        </Section>

        <Section title="5. 맞춤형 광고 및 쿠키 운영">
          <p>서비스는 광고 수익 창출을 위해 맞춤형 광고를 제공합니다.</p>
          <p>
            이를 위해 쿠키 및 유사 기술을 사용하여 이용자의 서비스 이용 기록을
            분석하고, 관심 기반 광고를 노출할 수 있습니다.
          </p>
          <p className="mt-4">
            이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수
            있습니다.
          </p>
        </Section>

        <Section title="6. 개인정보 보호를 위한 기술적·관리적 조치">
          <ul className="list-disc list-inside mt-2">
            <li>개인정보 암호화 및 접근 권한 관리</li>
            <li>정기적인 보안 점검 및 교육</li>
            <li>개인정보 취급 직원 최소화 및 교육 강화</li>
          </ul>
        </Section>

        <Section title="7. 이용자 권리 및 행사 방법">
          <p>
            이용자는 언제든지 개인정보 열람, 수정, 삭제 요청을 할 수 있습니다.
          </p>
          <p>요청은 서비스 내 설정 페이지 또는 고객센터를 통해 가능합니다.</p>
        </Section>

        <Section title="8. 개인정보 보호책임자 및 문의처">
          <p>개인정보 보호책임자: 대한민국 철봉 지도 운영팀</p>
          <p>문의처: support@k-pullup.com</p>
        </Section>

        <Section title="9. 개인정보처리방침 변경">
          <p>본 개인정보처리방침은 2025년 3월 6일부터 적용됩니다.</p>
          <p>
            법령, 서비스 정책 변경에 따라 내용이 변경될 수 있으며, 변경 시
            공지사항을 통해 안내드립니다.
          </p>
        </Section>
      </div>
    </SideMain>
  );
};

export default PrivacyPolicyPage;
