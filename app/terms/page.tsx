import SideMain from "@common/side-main";
import Section from "@pages/terms/section";

const TermsPage = () => {
  return (
    <SideMain headerTitle="이용약관" fullHeight hasBackButton>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">이용약관</h1>

        <Section title="제1조 목적">
          본 이용약관은 <strong>대한민국 철봉 지도</strong>(이하
          &#39;서비스&#39;)의 이용 조건과 운영에 관한 사항을 규정합니다.
        </Section>

        <Section title="제2조 용어의 정의">
          <p>본 약관에서 사용하는 주요 용어의 정의는 다음과 같습니다.</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>회원</strong>: 약관에 동의하고 회원 등록 후 서비스를
              이용하는 자
            </li>
            <li>
              <strong>운영자</strong>: 대한민국 철봉 지도를 관리·운영하는 주체
            </li>
            <li>
              <strong>닉네임</strong>: 서비스 이용을 위한 회원 식별용 고유
              문자열
            </li>
            <li>
              <strong>해지</strong>: 회원이 이용계약을 종료하는 행위
            </li>
          </ul>
        </Section>

        <Section title="제3조 약관 외 준칙">
          본 약관에 명시되지 않은 사항은 관련 법령 및 서비스 운영정책을
          따릅니다.
        </Section>

        <Section title="제4조 이용계약 체결">
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>
              회원 가입 시 약관 동의 및 서비스 가입 승인을 통해 이용계약이
              성립합니다.
            </li>
            <li>
              회원은 약관을 충분히 읽고 가입 버튼을 클릭함으로써 동의 의사를
              표시합니다.
            </li>
          </ol>
        </Section>

        <Section title="제5조 개인정보 보호">
          서비스는 개인정보보호법 등 관련 법령과 개인정보처리방침을 준수하여
          회원의 개인정보를 보호합니다.
        </Section>

        <Section title="제6조 운영자의 의무">
          운영자는 안정적 서비스 제공 및 회원의 의견·불만을 신속히 처리하기 위해
          최선을 다합니다.
        </Section>

        <Section title="제7조 회원의 의무">
          <p>회원은 다음 사항을 준수해야 합니다.</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>약관 및 운영정책 준수</li>
            <li>타인에게 서비스 이용권한 양도 금지</li>
            <li>불법·부적절한 콘텐츠 등록 금지</li>
          </ul>
        </Section>

        <Section title="제8조 서비스 이용 시간">
          서비스는 연중무휴 24시간 제공을 원칙으로 하며, 점검 등 사유로 일시
          중단될 수 있습니다.
        </Section>

        <Section title="제9조 서비스 해지 및 탈퇴">
          회원은 서비스 내 탈퇴 기능을 통해 언제든 탈퇴할 수 있으며, 탈퇴 즉시
          회원 정보는 삭제됩니다.
        </Section>

        <Section title="제10조 서비스 이용 제한">
          다음 각 호에 해당하는 경우 서비스 이용이 제한될 수 있습니다.
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>타인 정보 도용 및 허위 정보 등록</li>
            <li>서비스 운영 방해 행위</li>
            <li>운영자·회원·제3자 권리 침해</li>
            <li>불법·부적절한 콘텐츠 등록 및 유포</li>
          </ul>
        </Section>

        <Section title="제11조 게시물 관리 및 저작권">
          <p>
            게시물 저작권은 작성자에게 귀속되며, 서비스는 비영리 목적 내에서
            게시물을 이용할 수 있습니다.
          </p>
          <p>불법·부적절한 게시물은 사전 통보 없이 삭제될 수 있습니다.</p>
        </Section>

        <Section title="제12조 서비스 변경 및 중단">
          운영자는 서비스 일부 또는 전체를 변경·중단할 수 있으며, 사전에
          공지합니다.
        </Section>

        <Section title="제13조 손해배상 및 면책">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>회원 과실로 인한 손해에 대한 책임은 회원 본인에게 있습니다.</li>
            <li>천재지변, 해킹 등 불가항력적 사유로 인한 피해는 면책됩니다.</li>
            <li>회원 간·회원과 제3자 간 분쟁은 서비스가 책임지지 않습니다.</li>
          </ul>
        </Section>

        <Section title="부칙">이 약관은 2025년 3월 6일부터 적용됩니다.</Section>
      </div>
    </SideMain>
  );
};

export default TermsPage;
