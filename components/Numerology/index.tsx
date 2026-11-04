'use client';
import ReactMarkdown from 'react-markdown';
import NextLink from 'next/link';
import {
  type FC,
  useId,
  useRef,
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo
} from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useTranslations, useLocale } from 'next-intl';
import { useToast } from '@chakra-ui/react';
import {
  Box,
  Input,
  VStack,
  HStack,
  InputDate,
  Button,
  Text,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
  Icon,
  IconButton,
  Collapse,
  FaSave,
  MdExpandMore,
  MdExpandLess,
  MdAutoAwesome,
  MdErrorOutline,
  Spinner
} from '@/components';
import { RenderItem } from './RenderItem';
import { KnowledgeMeaning } from './KnowledgeMeaning';
import {
  METRIC_GROUP,
  GROUP_ORDER,
  FEATURED_METRIC
} from './metricGroups';
import { BirthChart } from './BirthChart';
import { ProfileManager } from './ProfileManager';
import { useProcessNumerology } from 'hooks';
import { useBirthChart } from '@/hooks/useBirthChart';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useProfiles } from '@/hooks/useProfiles';
import dayjs from 'dayjs';

dayjs.extend(customParseFormat);

// --- Meaning Cache Utilities ---

const MEANING_CACHE_PREFIX = 'meaning-';
const MEANING_CACHE_TTL_DAYS = 7;
const BIRTH_CHART_VISIBILITY_KEY = 'birth-chart-visible';

interface MeaningCacheEntry {
  content: string;
  cachedAt: number;
}

function getMeaningCacheKey(metric: string, value: string | number): string {
  return `${MEANING_CACHE_PREFIX}${metric}-${value}`;
}

function getCachedMeaning(
  metric: string,
  value: string | number
): MeaningCacheEntry | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = getMeaningCacheKey(metric, value);
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const entry: MeaningCacheEntry = JSON.parse(stored);
    const now = Date.now();
    const ttlMs = MEANING_CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;

    if (now - entry.cachedAt > ttlMs) {
      localStorage.removeItem(key);
      return null;
    }

    return entry;
  } catch {
    return null;
  }
}

function setCachedMeaning(
  metric: string,
  value: string | number,
  content: string
): void {
  if (typeof window === 'undefined') return;
  const key = getMeaningCacheKey(metric, value);
  const entry: MeaningCacheEntry = {
    content,
    cachedAt: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(entry));
}

// --- Main Component ---

interface NumerologyComponentProps {
  /** Callback invoked after each successful numerology calculation */
  onCalculate?: () => void;
}

const NumerologyComponent: FC<NumerologyComponentProps> = ({ onCalculate }) => {
  const tNum = useTranslations('Numerology');
  const tVal = useTranslations('Validation');
  const tMetrics = useTranslations('NumerologyMetrics');
  const tMeaning = useTranslations('Meaning');
  const tChart = useTranslations('BirthChart');
  const tProfile = useTranslations('Profile');
  const locale = useLocale();
  const toast = useToast();
  const {
    trackFormulaView,
    trackMeaningRequest,
    trackMeaningCacheHit,
    trackNumerologyCalculate,
    trackBirthChartCellClick,
    trackProfileSave
  } = useAnalytics();
  const { saveProfile, deleteProfile, maxProfiles, profiles, isLoaded: profilesLoaded } = useProfiles();
  const id = useId();
  const color = 'var(--ink)';
  const refInputName = useRef<HTMLInputElement>(null);
  const [localName, setLocalName] = useState<string>('Dương Văn Nghĩa');
  const [localBirth, setLocalBirth] = useState<string>('1976-06-11');
  const [submittedName, setSubmittedName] = useState<string>('Dương Văn Nghĩa');
  const [submittedBirth, setSubmittedBirth] = useState<string>('1976-06-11');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [birthError, setBirthError] = useState<string>('');
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const data = useProcessNumerology(submittedName, submittedBirth);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Birth Chart toggle state (localStorage persisted)
  const [isBirthChartVisible, setIsBirthChartVisible] = useState(true);

  // AI Meaning state
  const [meaningContent, setMeaningContent] = useState<string>('');
  const [isMeaningLoading, setIsMeaningLoading] = useState<boolean>(false);
  const [isMeaningFromCache, setIsMeaningFromCache] = useState<boolean>(false);
  const [meaningError, setMeaningError] = useState<boolean>(false);
  const meaningAbortRef = useRef<AbortController | null>(null);

  // AI Birth Chart Analysis state
  const {
    isOpen: isAnalysisOpen,
    onOpen: onAnalysisOpen,
    onClose: onAnalysisClose
  } = useDisclosure();
  const [analysisContent, setAnalysisContent] = useState<string>('');
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<boolean>(false);
  const [isAnalysisFromCache, setIsAnalysisFromCache] = useState<boolean>(false);
  const [analysisCachedAt, setAnalysisCachedAt] = useState<number | null>(null);
  const analysisAbortRef = useRef<AbortController | null>(null);

  // Hook to get birth chart raw structure for AI Analysis payload
  const birthChartData = useBirthChart(submittedBirth);

  useEffect(() => {
    // Restore birth chart visibility from localStorage
    const stored = localStorage.getItem(BIRTH_CHART_VISIBILITY_KEY);
    if (stored !== null) {
      setIsBirthChartVisible(stored === 'true');
    }
    setIsMounted(true);
    // Focus name input after hydration (avoid autoFocus SSR mismatch)
    refInputName.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      meaningAbortRef.current?.abort();
    };
  }, []);

  const toggleBirthChart = useCallback(() => {
    setIsBirthChartVisible((prev) => {
      const next = !prev;
      localStorage.setItem(BIRTH_CHART_VISIBILITY_KEY, String(next));
      return next;
    });
  }, []);

  const formatBirthDate = useCallback((birthDate: string): string => {
    if (!birthDate || !birthDate.trim()) {
      return '';
    }

    const parts = birthDate.split('-');
    if (parts.length !== 3) {
      return birthDate;
    }

    const [year, month, date] = parts;
    const paddedYear = year.padStart(4, '0');
    const paddedMonth = month.padStart(2, '0');
    const paddedDate = date.padStart(2, '0');

    return `${paddedYear}-${paddedMonth}-${paddedDate}`;
  }, []);

  const validateBirthDate = useCallback(
    (birthDate: string): string => {
      if (!birthDate || !birthDate.trim()) {
        return tVal('requireBirth');
      }

      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(birthDate)) {
        return tVal('invalidFormat');
      }

      if (!isMounted) {
        return '';
      }

      const date = dayjs(birthDate, 'YYYY-MM-DD', true);
      if (!date.isValid()) {
        return tVal('invalidDate');
      }

      const today = dayjs();
      if (date.isAfter(today)) {
        return tVal('futureDate');
      }

      const minYear = 1900;
      const maxYear = dayjs().year();
      const year = date.year();
      if (year < minYear || year > maxYear) {
        return tVal('yearRange', { min: minYear, max: maxYear });
      }

      return '';
    },
    [isMounted, tVal]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const formattedBirth = formatBirthDate(localBirth);
      const error = validateBirthDate(formattedBirth);
      if (error) {
        setBirthError(error);
        return;
      }

      setBirthError('');
      setIsLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setSubmittedName(localName.trim());
        setSubmittedBirth(formattedBirth);
        trackNumerologyCalculate(localName.trim(), formattedBirth);
        onCalculate?.();
      } finally {
        setIsLoading(false);
      }
    },
    [
      localName,
      localBirth,
      formatBirthDate,
      validateBirthDate,
      trackNumerologyCalculate,
      onCalculate
    ]
  );

  // --- Save Profile (inline with submit button) ---
  const handleSaveProfile = useCallback(() => {
    if (!localName.trim() || !localBirth) return;

    const { success, isMaxReached } = saveProfile(localName, localBirth);

    if (isMaxReached) {
      toast({
        title: tProfile('maxProfilesReached', { max: maxProfiles }),
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      return;
    }

    if (success) {
      trackProfileSave(profiles.length + 1);
      toast({
        title: tProfile('profileSaved'),
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
    }
  }, [
    localName,
    localBirth,
    saveProfile,
    toast,
    tProfile,
    maxProfiles,
    profiles.length,
    trackProfileSave
  ]);

  // --- AI Meaning Handler (FIXED: correct SSE parsing) ---
  const handleMeaningClick = useCallback(async () => {
    if (!selectedItem?.key || selectedItem.value === undefined) return;

    const metric = tMetrics(selectedItem.key as any);
    const value = selectedItem.value;

    // Check cache first
    const cached = getCachedMeaning(selectedItem.key, value);
    if (cached) {
      trackMeaningCacheHit(selectedItem.key, value);
      setMeaningContent(cached.content);
      setIsMeaningFromCache(true);
      setMeaningError(false);
      return;
    }

    // Fetch from API
    trackMeaningRequest(selectedItem.key, value);
    setIsMeaningLoading(true);
    setMeaningContent('');
    setIsMeaningFromCache(false);
    setMeaningError(false);

    meaningAbortRef.current?.abort();
    const abortController = new AbortController();
    meaningAbortRef.current = abortController;

    try {
      const isVietnamese = locale === 'vi';
      const prompt = isVietnamese
        ? `Giải thích chi tiết ý nghĩa chỉ số "${metric}" mang giá trị ${value} theo Nhân số học Pythagoras. Trả lời ngắn gọn, có cấu trúc, sử dụng bullet points và emoji. Trả lời bằng tiếng Việt.`
        : `Explain in detail the meaning of the "${metric}" index with value ${value} in Pythagorean Numerology. Keep it concise, structured, use bullet points and emoji. Answer in English.`;

      const numerologySystemPrompt = isVietnamese
        ? 'Bạn là chuyên gia Nhân số học Pythagoras. Trả lời chính xác, ngắn gọn, có cấu trúc rõ ràng.'
        : 'You are a Pythagorean Numerology expert. Answer accurately, concisely, with clear structure.';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          skipExpansion: true,
          language: isVietnamese ? 'Vietnamese' : 'English',
          systemPrompt: numerologySystemPrompt
        }),
        signal: abortController.signal
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let buffer = '';

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;

        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);

            // Skip sources event
            if (parsed.type === 'sources') continue;
            // Skip done event
            if (parsed.done) continue;

            // Server sends { content: "..." } format (from response-generator.ts line 117)
            const delta = parsed.content ?? '';

            if (delta) {
              accumulatedContent += delta;
              setMeaningContent(accumulatedContent);
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      // Cache the result
      if (accumulatedContent) {
        setCachedMeaning(selectedItem.key, value, accumulatedContent);
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      console.error('[Meaning] Fetch failed:', error);
      setMeaningError(true);
    } finally {
      setIsMeaningLoading(false);
    }
  }, [selectedItem, tMetrics, trackMeaningRequest, trackMeaningCacheHit, locale]);

  // --- Birth Chart Analysis Handler ---
  const handleAnalyzeBirthChart = useCallback(async (forceRegenerate?: boolean | any) => {
    const isForce = forceRegenerate === true;
    onAnalysisOpen();
    setIsAnalysisLoading(true);
    setAnalysisContent('');
    setAnalysisError(false);
    setIsAnalysisFromCache(false);
    setAnalysisCachedAt(null);

    const cacheKeyMetric = 'birthchart-analysis';
    const cacheKeyValue = `${submittedBirth}-${locale}`;

    if (!isForce) {
      const cached = getCachedMeaning(cacheKeyMetric, cacheKeyValue);
      if (cached) {
        setAnalysisContent(cached.content);
        setIsAnalysisFromCache(true);
        setAnalysisCachedAt(cached.cachedAt);
        setIsAnalysisLoading(false);
        return;
      }
    }

    analysisAbortRef.current?.abort();
    const abortController = new AbortController();
    analysisAbortRef.current = abortController;

    try {
      const isVietnamese = locale === 'vi';
      
      // Building the comprehensive payload for the AI
      const numbersInfo = `Các số xuất hiện trong ngày sinh:
${birthChartData.grid
  .filter((c) => c.frequency > 0)
  .map((c) => `- Số ${c.number}: Xuất hiện ${c.frequency} lần${c.isIsolated ? ' (Bị cô lập)' : ''}`)
  .join('\n')}
      `;

      const strengthArrowsText = birthChartData.arrows.filter(a => a.type === 'strength').map(a => a.numbers.join('-')).join(', ');
      const emptyArrowsText = birthChartData.arrows.filter(a => a.type === 'empty').map(a => a.numbers.join('-')).join(', ');
      
      const arrowsInfo = `Mũi tên trên biểu đồ:
- Mũi tên sức mạnh (đầy đủ): ${strengthArrowsText || 'Không có'}
- Mũi tên điểm yếu (trống): ${emptyArrowsText || 'Không có'}
      `;

      const instruction = isVietnamese 
        ? `Phân tích toàn diện Biểu đồ Ngày Sinh này theo Nhân số học Pythagoras. Chỉ rõ Mũi tên sức mạnh, độ lặp lại của các con số, cảnh báo số cô lập, phân tích mũi tên trống. Cuối cùng, gợi ý hành động cụ thể để điền "con số ảo" khắc phục điểm yếu. Dùng bullet points và emoji.`
        : `Analyze this Birth Chart mapped on the Pythagorean Numerology grid. Detail the strengths arrows, number frequencies, isolated numbers, and empty arrows. Recommend concrete lifestyle actions to create "virtual numbers". Use bullet points and emojis.`;

      const prompt = `${instruction}\n\nDữ liệu Biểu đồ:\n${numbersInfo}\n${arrowsInfo}`;
      
      const systemPrompt = isVietnamese
        ? 'Bạn là Master Nhân số học. Phân tích thật chi tiết Biểu đồ Ngày Sinh, định hướng tích cực và giải pháp cải thiện cụ thể.'
        : 'You are a Numerology Master. Provide a detailed, empowering Birth Chart analysis focusing on traits, strengths, empty spots, and actionable virtual number solutions.';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          skipExpansion: true,
          language: isVietnamese ? 'Vietnamese' : 'English',
          systemPrompt
        }),
        signal: abortController.signal
      });

      if (!response.ok) throw new Error('API error');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader from response');

      let accumulatedContent = '';
      let buffer = '';
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.type === 'sources' || parsed.done) continue;
            const delta = parsed.content ?? '';
            if (delta) {
              accumulatedContent += delta;
              setAnalysisContent(accumulatedContent);
            }
          } catch {
            // Ignore partial JSON
          }
        }
      }

      if (accumulatedContent) {
        setCachedMeaning(cacheKeyMetric, cacheKeyValue, accumulatedContent);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setAnalysisError(true);
      console.error(err);
    } finally {
      setIsAnalysisLoading(false);
    }
  }, [locale, birthChartData, onAnalysisOpen, submittedBirth]);

  // Handle Close Modals
  const closeModal = useCallback(() => {
    meaningAbortRef.current?.abort();
    onClose();
  }, [onClose]);

  const closeAnalysisModal = useCallback(() => {
    analysisAbortRef.current?.abort();
    onAnalysisClose();
  }, [onAnalysisClose]);

  // --- Profile Select Handler ---
  const handleSelectProfile = useCallback(
    (name: string, birthDate: string) => {
      setLocalName(name);
      setLocalBirth(birthDate);
      setSubmittedName('');
      setSubmittedBirth('');
    },
    []
  );

  // --- Birth Chart Cell Click (GA tracking only) ---
  const handleBirthChartCellClick = useCallback(
    (number: number) => {
      trackBirthChartCellClick(number);
    },
    [trackBirthChartCellClick]
  );

  const contentFormula = useMemo(() => {
    if (!selectedItem?.key) return tNum('formulaComingSoon');
    return tNum(`ExplainFormula.${selectedItem?.key as any}`);
  }, [selectedItem?.key]);

  const isProfileAlreadySaved = useMemo(() => {
    if (!localName.trim() || !localBirth) return false;
    return profiles.some(
      (p) =>
        p.name.toLowerCase() === localName.trim().toLowerCase() &&
        p.birthDate === localBirth
    );
  }, [profiles, localName, localBirth]);

  const featuredItem = data.find((d: any) => d.key === FEATURED_METRIC);
  const gridItems = data.filter((d: any) => d.key !== FEATURED_METRIC);

  const openItem = (item: any) => {
    setSelectedItem(item);
    setMeaningContent('');
    setIsMeaningFromCache(false);
    setMeaningError(false);
    trackFormulaView(item.key);
    onOpen();
  };

  const selectedGroup = selectedItem
    ? METRIC_GROUP[selectedItem.key] ?? 'support'
    : 'support';

  return (
    <Box>
      {/* ───── Ô nhập họ tên + ngày sinh ───── */}
      <Box
        as="form"
        onSubmit={handleSubmit}
        maxW="640px"
        mx="auto"
        className="pyra-form"
      >
        <VStack spacing={4} align="stretch">
          <Box>
            <Text as="label" className="pr-label" display="block">
              {tNum('nameLabel')}
            </Text>
            <ProfileManager
              currentName={localName}
              currentBirthDate={localBirth}
              profiles={profiles}
              isLoaded={profilesLoaded}
              onSelectProfile={handleSelectProfile}
              onDeleteProfile={deleteProfile}
              nameInputRef={refInputName}
              nameValue={localName}
              onNameChange={setLocalName}
              namePlaceholder={tNum('namePlaceholder')}
              inputColor={color}
            />
          </Box>

          <FormControl isInvalid={!!birthError}>
            <Text as="span" className="pr-label" display="block">
              {tNum('birthLabel')}
            </Text>
            <InputDate
              getValue={(date) => {
                setLocalBirth(date);
              }}
              defaultValue={localBirth}
              color={color}
            />
            {birthError && (
              <FormErrorMessage mt={2} justifyContent="center">
                {birthError}
              </FormErrorMessage>
            )}
          </FormControl>

          {/* Nút chính (Primary) + nút icon Lưu hồ sơ */}
          <Box display="flex" justifyContent="center" alignItems="center" gap={3} pt={1}>
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              loadingText={tNum('processing')}
            >
              {tNum('viewResult')}
            </Button>

            {!isProfileAlreadySaved && (
              <Tooltip label={tProfile('saveProfile')} hasArrow>
                <IconButton
                  aria-label={tProfile('saveProfile')}
                  icon={<Icon as={FaSave} />}
                  variant="icon"
                  onClick={handleSaveProfile}
                  isDisabled={!localName.trim() || !localBirth}
                />
              </Tooltip>
            )}
          </Box>
        </VStack>
      </Box>

      {/* ───── Biểu đồ ngày sinh (thu gọn được) ───── */}
      {submittedBirth && (
        <Box as="section" mt={{ base: 10, md: 14 }} mb={6} mx="auto">
          <VStack spacing={2} mb={4}>
            <Text className="pyra-eyebrow" m={0}>
              ‹ {tChart('title')} ›
            </Text>
            <Button
              variant="link"
              size="sm"
              onClick={toggleBirthChart}
              aria-expanded={isBirthChartVisible}
              rightIcon={
                <Icon
                  as={isBirthChartVisible ? MdExpandLess : MdExpandMore}
                  boxSize={5}
                />
              }
            >
              {isBirthChartVisible ? tChart('hideChart') : tChart('showChart')}
            </Button>
          </VStack>

          {isMounted && (
            <Collapse in={isBirthChartVisible} animateOpacity>
              <VStack spacing={5} pb={4} px={2}>
                <BirthChart
                  birthDate={submittedBirth}
                  onCellClick={handleBirthChartCellClick}
                />
                <Button
                  variant="ticket"
                  onClick={handleAnalyzeBirthChart}
                  isLoading={isAnalysisLoading}
                  loadingText={tNum('processing')}
                >
                  {tChart('analyzeChart')}
                </Button>
              </VStack>
            </Collapse>
          )}
        </Box>
      )}

      {submittedBirth && (
        <Box className="pyra-ornament" my={{ base: 8, md: 10 }} aria-hidden>
          ✦
        </Box>
      )}

      {/* ───── 16 thẻ chỉ số ───── */}
      {!!submittedBirth && data && data.length > 0 && (
        <Box as="section" aria-labelledby="pyra-index-title">
          <VStack spacing={2} mb={{ base: 6, md: 8 }}>
            <Text className="pyra-eyebrow" m={0}>
              ‹ {tNum('collectionEyebrow')} ›
            </Text>
            <h2 id="pyra-index-title" className="pyra-section-title">
              {tNum('indexTitle')}
            </h2>
          </VStack>

          {featuredItem && (
            <Box textAlign="center">
              <RenderItem
                item={featuredItem}
                featured
                onClick={() => openItem(featuredItem)}
              />
            </Box>
          )}

          <div className="pyra-cards">
            {gridItems.map((item: any, index: number) => (
              <RenderItem
                key={id + index}
                item={item}
                onClick={() => openItem(item)}
              />
            ))}
          </div>

          <Box className="pyra-legend" aria-label={tNum('indexTitle')}>
            {GROUP_ORDER.map((g) => (
              <span key={g} className="pyra-legend__item">
                <span className={`pyra-legend__swatch pr-card--${g}`} />
                {tNum(`groupLegend.${g}` as any)}
              </span>
            ))}
          </Box>
        </Box>
      )}

      {/* ───── Hộp thoại kính: công thức + AI giải thích ───── */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        isCentered
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent mx={4} my={{ base: 4, md: 16 }} maxH="calc(100dvh - 32px)">
          <ModalHeader pb={2}>
            <HStack spacing={4} align="center">
              {selectedItem && (
                <span
                  className={`pyra-dialog-oval pyra-dialog-oval--${selectedGroup}`}
                  aria-hidden
                >
                  {String(selectedItem.value ?? '')}
                </span>
              )}
              <Box>
                <Text className="pyra-eyebrow pyra-eyebrow--glass" m={0} fontSize="14px">
                  {tNum('formulaEyebrow')}
                </Text>
                <Box as="span" display="block">
                  {selectedItem ? tMetrics(selectedItem.key as any) : ''}
                </Box>
              </Box>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box className="pyra-prose pyra-prose--glass pyra-glass-step">
              <ReactMarkdown>{contentFormula}</ReactMarkdown>
            </Box>

            {/* Ý nghĩa lấy từ kho kiến thức Pyra: hiện ngay, không cần AI (chỉ có tiếng Việt) */}
            {locale === 'vi' && selectedItem && (
              <Box mt={5}>
                <KnowledgeMeaning
                  metricKey={selectedItem.key}
                  value={selectedItem.value}
                />
              </Box>
            )}

            {selectedItem && selectedItem.value !== undefined && (
              <Box mt={5}>
                {!meaningContent && !isMeaningLoading && !meaningError && (
                  <Box display="flex" justifyContent="center">
                    <Button
                      variant="glassAccent"
                      onClick={handleMeaningClick}
                      whiteSpace="normal"
                      h="auto"
                      py={3}
                      px={6}
                      leftIcon={<Icon as={MdAutoAwesome} />}
                    >
                      {tNum('askPyra', {
                        metric: tMetrics(selectedItem.key as any),
                        value: String(selectedItem.value)
                      })}
                    </Button>
                  </Box>
                )}

                {isMeaningLoading && !meaningContent && (
                  <HStack justify="center" py={3} spacing={3} color="onGlassMuted">
                    <Spinner size="sm" color="gold" />
                    <Text fontFamily="var(--font-ui)" fontSize="14px" m={0}>
                      {tMeaning('loading')}
                    </Text>
                  </HStack>
                )}

                {meaningError && (
                  <VStack py={3} spacing={3}>
                    <Text fontFamily="var(--font-ui)" fontSize="14px" m={0}>
                      {tMeaning('error')}
                    </Text>
                    <Button variant="glass" onClick={handleMeaningClick}>
                      {tMeaning('retry')}
                    </Button>
                  </VStack>
                )}

                {meaningContent && (
                  <Box mt={2}>
                    {isMeaningFromCache && (
                      <Box display="flex" justifyContent="center" mb={3}>
                        <Tooltip label={tMeaning('cachedTooltip')} hasArrow>
                          <span className="pyra-saved-tag">
                            {tMeaning('cachedBadge')}
                          </span>
                        </Tooltip>
                      </Box>
                    )}
                    <Box className="pyra-prose pyra-prose--glass">
                      <Text className="pr-msg__who pyra-who--glass" m={0} mb={2}>
                        Pyra
                      </Text>
                      <ReactMarkdown>{meaningContent}</ReactMarkdown>
                    </Box>
                  </Box>
                )}

                <Box display="flex" justifyContent="center" mt={5}>
                  <NextLink href={`/${locale}/chat`} className="pr-gbtn">
                    {tNum('askDeeper')} →
                  </NextLink>
                </Box>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* ───── Hộp thoại kính lớn: AI giải mã biểu đồ ───── */}
      <Modal
        isOpen={isAnalysisOpen}
        onClose={closeAnalysisModal}
        size="2xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent mx={4} my={{ base: 4, md: 16 }} maxH="calc(100dvh - 32px)">
          <ModalHeader pb={2}>
            <Text className="pyra-eyebrow pyra-eyebrow--glass" m={0} fontSize="14px">
              ‹ {tChart('title')} ›
            </Text>
            {tChart('analyzeChart')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={2} pb={6}>
            {isAnalysisLoading && !analysisContent ? (
              <VStack py={8} spacing={3}>
                <Spinner color="gold" />
                <Text fontFamily="var(--font-ui)" fontSize="14px" m={0}>
                  {tNum('processing')}
                </Text>
              </VStack>
            ) : analysisError ? (
              <VStack py={6} spacing={3}>
                <Icon as={MdErrorOutline} boxSize={8} />
                <Text m={0}>{tVal('genericError')}</Text>
                <Button variant="glass" onClick={handleAnalyzeBirthChart}>
                  {tChart('retry')}
                </Button>
              </VStack>
            ) : analysisContent ? (
              <Box>
                {isAnalysisFromCache && analysisCachedAt && (
                  <HStack mb={4} justify="space-between" align="center" className="pyra-glass-step" flexWrap="wrap">
                    <span className="pyra-saved-tag">
                      {tChart('savedAt', {
                        time: dayjs(analysisCachedAt).format('DD/MM/YYYY HH:mm')
                      })}
                    </span>
                    <Button variant="glass" size="sm" onClick={() => handleAnalyzeBirthChart(true)}>
                      {tChart('regenerate')}
                    </Button>
                  </HStack>
                )}
                <Box className="pyra-prose pyra-prose--glass">
                  <ReactMarkdown>{analysisContent}</ReactMarkdown>
                </Box>
              </Box>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// React 19 compatible component type - workaround for FC type incompatibility
// Using any type to bypass React 19 JSX type strictness
export const Numerology: any = NumerologyComponent;
