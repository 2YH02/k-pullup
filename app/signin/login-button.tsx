"use client";

const LoginButton = () => {
  return (
    <button
      onClick={() => {
        window.Kakao.Auth.authorize({
          redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/kakao`,
          throughTalk: true,
          scope: "profile_nickname,account_email,profile_image",
        });
      }}
    >
      LoginButton
    </button>
  );
};

export default LoginButton;
