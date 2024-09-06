"use client";

const LoginButton = () => {
  return (
    <button
      onClick={() => {
        window.Kakao.Auth.authorize({
          redirectUri: "https://api.k-pullup.com/api/v1/auth/kakao",
        });
      }}
    >
      LoginButton
    </button>
  );
};

export default LoginButton;
