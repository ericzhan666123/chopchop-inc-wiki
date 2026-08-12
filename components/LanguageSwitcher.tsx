"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/types";
import styles from "./LanguageSwitcher.module.css";

const languages = [
  { code: "en" as const, label: "English", flag: "EN" },
  { code: "de" as const, label: "Deutsch", flag: "DE" },
];

function localizedPath(pathname: string, locale: Locale) {
  const pathWithoutLocale =
    pathname.replace(/^\/de(?=\/|$)/, "") || "/";

  return locale === "de"
    ? pathWithoutLocale === "/"
      ? "/de/"
      : `/de${pathWithoutLocale}`
    : pathWithoutLocale;
}

async function navigateWithFallback(
  target: Locale,
  pathname: string,
) {
  const targetPath = localizedPath(pathname, target);

  try {
    const response = await fetch(targetPath, {
      method: "HEAD",
      cache: "no-store",
    });

    window.location.assign(
      response.ok
        ? targetPath
        : target === "de"
          ? "/de/"
          : "/",
    );
  } catch {
    window.location.assign(target === "de" ? "/de/" : "/");
  }
}

export function LanguageSwitcher({
  locale,
  mobile = false,
}: {
  locale: Locale;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs =
    useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        rootRef.current
          ?.querySelector<HTMLButtonElement>("button")
          ?.focus();
      }
    };

    document.addEventListener(
      "pointerdown",
      closeOnOutsideClick,
    );
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener(
        "pointerdown",
        closeOnOutsideClick,
      );
      document.removeEventListener(
        "keydown",
        closeOnEscape,
      );
    };
  }, [open]);

  const selectLanguage = (
    event: React.MouseEvent<HTMLAnchorElement>,
    target: Locale,
  ) => {
    event.preventDefault();
    setOpen(false);

    if (target !== locale) {
      void navigateWithFallback(target, pathname);
    }
  };

  const optionKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();

      const direction =
        event.key === "ArrowDown" ? 1 : -1;

      optionRefs.current[
        (index + direction + languages.length) %
          languages.length
      ]?.focus();
    }
  };

  if (mobile) {
    return (
      <div
        className={styles.mobileGroup}
        aria-label="Language"
      >
        <strong>Language</strong>

        {languages.map((language) => (
          <a
            key={language.code}
            href={localizedPath(pathname, language.code)}
            hrefLang={language.code}
            lang={language.code}
            className={
              language.code === locale
                ? styles.current
                : undefined
            }
            aria-current={
              language.code === locale
                ? "page"
                : undefined
            }
            onClick={(event) =>
              selectLanguage(event, language.code)
            }
          >
            <span aria-hidden>{language.flag}</span>
            <span>{language.label}</span>

            {language.code === locale && (
              <span
                className={styles.check}
                aria-label="Current language"
              >
                ✓
              </span>
            )}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.switcher} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Choose language"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);

            requestAnimationFrame(() => {
              optionRefs.current[0]?.focus();
            });
          }
        }}
      >
        <span aria-hidden>🌐</span>
        <span>{locale.toUpperCase()}</span>
        <span className={styles.arrow} aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div
          className={styles.panel}
          role="menu"
          aria-label="Language options"
        >
          {languages.map((language, index) => (
            <a
              key={language.code}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              role="menuitem"
              href={localizedPath(
                pathname,
                language.code,
              )}
              hrefLang={language.code}
              lang={language.code}
              className={
                language.code === locale
                  ? styles.current
                  : undefined
              }
              aria-current={
                language.code === locale
                  ? "page"
                  : undefined
              }
              onClick={(event) =>
                selectLanguage(event, language.code)
              }
              onKeyDown={(event) =>
                optionKeyDown(event, index)
              }
            >
              <span aria-hidden>{language.flag}</span>
              <span>{language.label}</span>

              {language.code === locale && (
                <span
                  className={styles.check}
                  aria-label="Current language"
                >
                  ✓
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}