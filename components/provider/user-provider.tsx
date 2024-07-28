"use client";

import myInfo from "@api/user/myInfo";
import useUserStore from "@store/useUserStore";
import { useEffect } from "react";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await myInfo();

      setUser(user);
    };
    fetchUser();
  }, [setUser]);

  return <>{children}</>;
};

export default UserProvider;
