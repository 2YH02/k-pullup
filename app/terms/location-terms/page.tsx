import SideMain from "@common/side-main";
import Section from "@pages/terms/section";

const LocationTermsPage = () => {
  return (
    <SideMain headerTitle="위치정보 이용약관" fullHeight hasBackButton>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">
          위치정보 이용약관
        </h1>

        <Section title="제1조 (목적)">
          본 약관은 <strong>대한민국 철봉 지도</strong>(이하 &#39;서비스&#39;)가
          위치기반 서비스를 제공함에 있어, 위치정보의 보호 및 이용 등에 관한
          사항을 규정함을 목적으로 합니다.
        </Section>

        <Section title="제2조 (위치정보 수집 및 이용 목적)">
          서비스는 다음과 같은 목적으로 이용자의 위치정보를 수집·이용합니다.
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>현재 위치를 기반으로 주변 철봉 위치 정보 제공</li>
            <li>
              철봉 위치 등록 시, 현재 위치를 활용하여 위치 등록 편의성 제공
            </li>
            <li>지도 화면에서 이용자의 현재 위치 표시</li>
          </ul>
        </Section>

        <Section title="제3조 (위치정보 보유 및 이용 기간)">
          서비스는 위치기반 서비스 제공을 위해 필요한 범위 내에서 일시적으로
          위치정보를 수집·이용하며, 별도로 저장하지 않습니다. 단, 법령상 보존
          의무가 있는 경우 해당 법령에 따라 보관할 수 있습니다.
        </Section>

        <Section title="제4조 (위치정보 제3자 제공)">
          서비스는 이용자의 위치정보를 제3자에게 제공하지 않습니다. 단, 아래의
          경우는 예외로 합니다.
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 따라 수사기관, 법원 등 관계 기관의 요청이 있는 경우</li>
          </ul>
        </Section>

        <Section title="제5조 (이용자의 권리 및 동의 철회)">
          <p>
            이용자는 언제든지 위치정보 수집·이용 동의를 철회할 수 있으며, 모바일
            기기의 위치 정보 제공 기능을 끄거나, 서비스 내 설정 메뉴에서
            위치정보 제공 설정을 변경할 수 있습니다.
          </p>
          <p className="mt-2">
            단, 위치정보 제공을 거부할 경우 일부 서비스 이용이 제한될 수
            있습니다.
          </p>
        </Section>

        <Section title="제6조 (위치정보 관리 책임자)">
          서비스는 위치정보를 안전하게 관리하고, 관련 문의 처리를 위해 다음과
          같이 위치정보 관리 책임자를 지정합니다.
          <ul className="mt-2 space-y-1">
            <li>책임자: 대한민국 철봉 지도 운영팀</li>
            <li>이메일: support@k-pullup.com</li>
          </ul>
        </Section>

        <Section title="제7조 (준용)">
          본 약관에서 정하지 않은 사항은 「위치정보의 보호 및 이용 등에 관한
          법률」, 「개인정보 보호법」 및 서비스의 이용약관 을 따릅니다.
        </Section>

        <Section title="부칙">본 약관은 2025년 3월 6일부터 적용됩니다.</Section>
      </div>
    </SideMain>
  );
};

export default LocationTermsPage;
