'use client';
import { FC } from 'react';
import {
  Icon,
  Tooltip,
  Donate,
  Feeacback,
  useColorMode,
  AiFillGithub,
  Disclaimer,
  LanguageSwitcher,
  SunIcon,
  MoonIcon,
  Box
} from 'components';
import { useTranslations } from 'next-intl';

/**
 * Chân trang gồm 2 phần:
 * 1. Khối chân trang đỏ rượu (claret-deep): monogram "P", lời nhắc tham khảo.
 * 2. Thanh công cụ KÍNH NỔI ở đáy màn hình (liquid glass): ngôn ngữ, sáng/tối,
 *    ủng hộ, mã nguồn, góp ý. Nó luôn nổi trên nội dung nên dùng kính.
 */
export const Footer: FC = () => {
  const t = useTranslations('Footer');
  const { toggleColorMode, colorMode } = useColorMode();
  const isLight = colorMode === 'light';

  return (
    <>
      <Box as="footer" className="pyra-footer">
        <Box textAlign="center" mb={4}>
          <span className="pyra-monogram" aria-hidden>
            P
          </span>
          <Box className="pyra-footer__mark" mt={3}>
            Pyra
          </Box>
          <Box
            fontFamily="var(--font-caps)"
            fontWeight={700}
            letterSpacing=".14em"
            fontSize="14px"
            textTransform="uppercase"
            opacity={0.85}
          >
            ‹ {t('tagline')} ›
          </Box>
        </Box>
        <Disclaimer />
      </Box>

      {/* Thanh công cụ kính nổi */}
      <nav
        className="pr-glass pr-glass--strong pyra-dock"
        aria-label={t('toolbar')}
      >
        <LanguageSwitcher />

        <Tooltip label={t('mode', { mode: colorMode })} hasArrow>
          <button
            type="button"
            className="pr-gbtn pr-gbtn--round"
            onClick={toggleColorMode}
            aria-label={t('mode', { mode: colorMode })}
          >
            <Icon as={isLight ? MoonIcon : SunIcon} boxSize={4} />
          </button>
        </Tooltip>

        <span className="pyra-dock__sep" aria-hidden />

        <Donate />

        <span className="pyra-dock__sep" aria-hidden />

        <Tooltip label={t('sourceCode')} hasArrow>
          <a
            href="https://github.com/minhphuc010194/NumerologyWebApp"
            target="_blank"
            rel="noreferrer"
            className="pr-gbtn pr-gbtn--round"
            aria-label={t('sourceCode')}
          >
            <Icon as={AiFillGithub} boxSize={5} />
          </a>
        </Tooltip>

        <Feeacback />
      </nav>
    </>
  );
};
