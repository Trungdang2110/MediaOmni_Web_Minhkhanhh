'use client';
import { useState, useEffect, useCallback } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Layout,
  Numerology,
  SurveyBanner,
  Text,
  VStack,
  Icon,
  Collapse,
  Button,
  MdAutoAwesome,
  MdPlayCircleOutline,
  MdExpandMore,
  MdExpandLess
} from '@/components';
import { useTranslations, useLocale } from 'next-intl';
import { PyraMascot } from '@/components/Chat/PyraMascot';
import { useSurveyTrigger } from '@/hooks/useSurveyTrigger';

const Link = NextLink as any;

const VIDEO_VISIBILITY_KEY = 'numerology-video-visible';

export default function HomePage() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { incrementUsage: incrementSurveyUsage } = useSurveyTrigger();

  useEffect(() => {
    const stored = localStorage.getItem(VIDEO_VISIBILITY_KEY);
    if (stored !== null) {
      setIsVideoVisible(stored === 'true');
    }
    setIsMounted(true);
  }, []);

  const toggleVideoVisibility = useCallback(() => {
    setIsVideoVisible((prev) => {
      const next = !prev;
      localStorage.setItem(VIDEO_VISIBILITY_KEY, String(next));
      return next;
    });
  }, []);

  return (
    <Layout>
      <VStack spacing={0} align="stretch" pt={{ base: 3, md: 6 }}>
        {/* ───── Hero: tranh loang màu + chữ khổng lồ đè lên ───── */}
        <Box as="section" className="pyra-hero" mb={{ base: 8, md: 12 }}>
          <VStack spacing={{ base: 4, md: 5 }} position="relative" zIndex={1}>
            <Link href="/chat" aria-label={t('heroFrameAlt')}>
              <Box className="pyra-oval pyra-hero__mascot">
                <Box className="pyra-hero__mascot-wrap">
                  <PyraMascot size={{ base: '84px', md: '96px' }} state="idle" />
                </Box>
              </Box>
            </Link>

            <Text className="pyra-eyebrow" m={0}>
              ‹ {t('eyebrow')} ›
            </Text>

            <h1 className="pyra-hero__title">{t('title')}</h1>

            <p className="pyra-hero__sub">{t('subtitle')}</p>

            {/* Nút nằm trên tranh → dùng nút kính */}
            <Link href="/chat" style={{ textDecoration: 'none' }}>
              <span className="pr-glass pr-glass--strong pyra-hero__cta">
                <span className="pyra-hero__badge">{t('chatBadgeLabel')}</span>
                <span>{t('chatNotice')}</span>
                <Icon as={MdAutoAwesome} boxSize={4} color="gold" />
              </span>
            </Link>
          </VStack>
        </Box>

        {/* ───── Giới thiệu / video hướng dẫn (kiểu "Our story") ───── */}
        <VStack spacing={4} mb={{ base: 8, md: 12 }}>
          <Text className="pyra-eyebrow" m={0}>
            ‹ {t('videoTitle')} ›
          </Text>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVideoVisibility}
            aria-expanded={isVideoVisible}
            aria-label={t('videoToggleLabel')}
            leftIcon={<Icon as={MdPlayCircleOutline} boxSize={5} />}
            rightIcon={
              <Icon
                as={isVideoVisible ? MdExpandLess : MdExpandMore}
                boxSize={5}
              />
            }
          >
            {t('videoTitle')}
          </Button>

          {isMounted && (
            <Collapse in={isVideoVisible} animateOpacity style={{ width: '100%' }}>
              <VStack spacing={4} w="100%">
                <Box
                  w="100%"
                  maxW="720px"
                  mx="auto"
                  bg="paperDeep"
                  overflow="hidden"
                  p={2}
                  border="1px solid var(--gold)"
                  borderRadius="6px"
                  boxShadow="var(--shadow-card)"
                >
                  <Box
                    as="video"
                    w="100%"
                    display="block"
                    controls
                    preload="metadata"
                    playsInline
                    sx={{ '&:focus': { outline: 'none' } }}
                  >
                    <source
                      src={`/videos/DecodingNumerology_${locale}.mp4`}
                      type="video/mp4"
                    />
                  </Box>
                </Box>

                <Text
                  fontSize="15px"
                  color="inkMuted"
                  textAlign="center"
                  fontStyle="italic"
                  maxW="560px"
                >
                  {t('videoCaption')}
                </Text>
              </VStack>
            </Collapse>
          )}
        </VStack>

        <Box className="pyra-ornament" mb={{ base: 6, md: 8 }} aria-hidden>
          ✦
        </Box>

        {/* ───── Nhập thông tin + kết quả ───── */}
        <Box as="main">
          <Numerology onCalculate={incrementSurveyUsage} />
        </Box>
      </VStack>

      <SurveyBanner page="home" />
    </Layout>
  );
}
