import { type MyInfo } from "@api/user/myInfo";
import Text from "@common/text";

const UserInfo = ({ user }: { user: MyInfo }) => {
  return (
    <>
      <div>
        <Text typography="t4" fontWeight="bold" className="mr-1">
          {user.username}
        </Text>
        <Text>님</Text>
      </div>
      <Text typography="t6">안녕하세요.</Text>
      {(user.reportCount || user.markerCount) && (
        <div className="mt-3">
          {user.reportCount && (
            <Text typography="t7" display="block">
              정보 수정 제안{" "}
              <span className="font-bold">{user.reportCount}</span>회
            </Text>
          )}

          {user.markerCount && (
            <Text typography="t7" display="block">
              등록한 철봉 <span className="font-bold">{user.markerCount}</span>
              개
            </Text>
          )}
        </div>
      )}
    </>
  );
};

export default UserInfo;
