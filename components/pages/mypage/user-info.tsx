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
    </>
  );
};

export default UserInfo;
