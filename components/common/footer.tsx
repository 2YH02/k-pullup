import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-12 w-full border-t border-primary/12 bg-side-main px-4 py-8 dark:border-white/10 dark:bg-black">
      <div className="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center gap-3 text-sm">
        <Link
          href="https://buymeacoffee.com/seokwon"
          target="_blank"
          className="rounded-full border border-primary/18 px-4 py-1.5 text-text-on-surface transition-colors web:hover:bg-primary/8 active:bg-primary/12 dark:border-white/15 dark:text-grey-light"
        >
          커피 한잔 후원하기
        </Link>

        <a
          href="mailto:support@k-pullup.com"
          className="text-text-on-surface-muted underline-offset-3 transition-colors web:hover:text-text-on-surface web:hover:underline active:text-text-on-surface dark:text-grey-light"
        >
          support@k-pullup.com
        </a>

        <p className="text-text-on-surface dark:text-white">
          <span className="mr-1 text-text-on-surface-muted">Developed by</span>
          <Link
            href="https://github.com/2YH02"
            target="_blank"
            className="mr-1 font-medium transition-colors web:hover:text-primary-dark active:text-primary-dark"
          >
            Yonghun,
          </Link>
          <Link
            href="https://github.com/Alfex4936"
            target="_blank"
            className="font-medium transition-colors web:hover:text-primary-dark active:text-primary-dark"
          >
            Seokwon
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
