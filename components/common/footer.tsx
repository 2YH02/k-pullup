import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 dark:bg-[#333] py-6 px-4 mt-12">
      <div className="max-w-(--breakpoint-xl) mx-auto flex flex-col justify-between items-center text-sm space-y-2 mo:space-y-4">
        <Link
          href="https://buymeacoffee.com/seokwon"
          target="_blank"
          className="hover:text-blue transition text-black dark:text-grey-light"
        >
          ☕ 커피 한잔 후원하기
        </Link>

        <a
          href="mailto:support@k-pullup.com"
          className="hover:text-green transition text-black dark:text-grey-light"
        >
          📧 문의: support@k-pullup.com
        </a>

        <p className="text-black dark:text-white">
          <span className="mr-1 text-gray-400">Developed by</span>
          <Link
            href="https://github.com/2YH02"
            target="_blank"
            className="font-medium mr-1 hover:text-primary-dark transition"
          >
            Yonghun,
          </Link>
          <Link
            href="https://github.com/Alfex4936"
            target="_blank"
            className="font-medium hover:text-primary-dark transition"
          >
            Seokwon
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
