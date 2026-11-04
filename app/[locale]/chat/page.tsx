'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  VStack,
  Text,
  Flex,
  Icon,
  HStack,
  Button,
  Heading,
  Container,
    MdHome,
  MdDeleteOutline,
  LanguageSwitcher,
  useColorMode,
  AiFillGithub,
  Feeacback,
  Donate,
  Tooltip,
  SunIcon,
  MoonIcon,
  SurveyBanner
} from '@/components';
import {
  IconButton,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';
import {
  MdFileDownload,
  MdFileUpload,
  MdMenu,
  MdAdd,
  MdOutlineChat,
  MdEdit,
  MdCheck,
  MdClose,
  MdLockOutline,
  MdHelpOutline
} from 'react-icons/md';
import {
  ChatMessageBubble,
  ChatInput,
  StreamingIndicator,
  ChatGuideModal,
  ProviderSettings,
  PyraMascot
} from '@/components';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useChatRAG } from '@/hooks/use-chat-rag';
import { useProviderSettings } from '@/hooks/use-provider-settings';
import { useSurveyTrigger } from '@/hooks/useSurveyTrigger';

export default function Chat() {
  const t = useTranslations('Chat');
  const tHeader = useTranslations('Header');
  const tFooter = useTranslations('Footer');
  const router = useRouter();
  const providerHook = useProviderSettings();
  const activeProviderConfig = providerHook.getActiveProviderForRequest();

  const {
    messages,
    sendMessage,
    isStreaming,
    phase,
    error,
    retryLastMessage,
    sessions,
    currentSessionId,
    createNewSession,
    switchSession,
    deleteSession,
    renameSession,
    clearAllSessions,
    exportSessions,
    importSessions
  } = useChatRAG(activeProviderConfig);

  const { toggleColorMode, colorMode } = useColorMode();
  const toast = useToast();
  const { incrementUsage: incrementSurveyUsage } = useSurveyTrigger();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isGuideOpen,
    onOpen: onGuideOpen,
    onClose: onGuideClose
  } = useDisclosure();

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<string | 'all' | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clickSpin, setClickSpin] = useState(0);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await importSessions(file);
      toast({
        title: t('importSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      onClose(); // Close drawer on success
    } catch (err) {
      toast({
        title: t('importError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Màu theo design system Pyra Rococo:
  // nền giấy có mảng màu loang (để kính phía trên có cái để "nhìn xuyên"),
  // thanh trên cùng + ngăn kéo lịch sử = kính lỏng (chữ on-glass).
  const headerBorder = 'glassStroke';
  const scrollbarThumbBg = 'var(--line)';
  const scrollbarThumbHoverBg = 'var(--gold)';

  const sessionItemBgHover = 'glassChip';
  const sessionActiveBg = 'glassChip';
  const drawerFooterBg = 'transparent';
  const textMuted = 'onGlassMuted';
  const textHint = 'onGlassMuted';

  const hasMessages = messages.length > 0;

  return (
    <Box
      h="100dvh"
      overflow="hidden"
      className="pyra-chat-bg"
      display="flex"
      flexDir="column"
    >
      {/* Header */}
      <Flex
        pos="sticky"
        top={0}
        w="100%"
        className="pr-glass pr-glass--strong pyra-chat-header"
        zIndex={10}
      >
        <Flex p={2} align="center" justify="space-between" flex={1}>
          <Box flex={1} display="flex" justifyContent="flex-start">
            <Tooltip label={t('chatHistory')} hasArrow>
              <IconButton
                icon={<Icon as={MdMenu} boxSize={5} />}
                variant="ghost"
                size="sm"
                rounded="full"
                color="onGlass"
                onClick={onOpen}
                aria-label="Menu"
                _hover={{ bg: 'glassChip' }}
              />
            </Tooltip>
          </Box>

          <Box flex={1} display="flex" justifyContent="center" alignItems="center" gap={2}>
            <Tooltip label={tHeader('home')} hasArrow>
              <IconButton
                icon={<Icon as={MdHome} boxSize={5} />}
                variant="ghost"
                size="sm"
                rounded="full"
                color="onGlass"
                onClick={() => router.push('/')}
                aria-label="Home"
                _hover={{ bg: 'glassChip', transform: 'scale(1.1)' }}
                transition="all 0.2s"
              />
            </Tooltip>
            <Box
              as="span"
              fontFamily="var(--font-display)"
              fontWeight={900}
              fontSize="20px"
              color="onGlass"
              letterSpacing=".02em"
            >
              Pyra
            </Box>
          </Box>

          <Box flex={1} display="flex" justifyContent="flex-end">
            <HStack spacing={{ base: 1, md: 2 }}>
              <Donate isHeader />
            </HStack>
          </Box>
        </Flex>

        {/* Hidden File Input */}
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Drawer for History & Settings */}
        <Drawer
          placement="left"
          onClose={onClose}
          isOpen={isOpen}
          size={{ base: 'full', md: 'sm' }}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton mt={1} />
            <DrawerHeader borderBottomWidth="1px" borderColor={headerBorder}>
              {t('chatHistory')}
            </DrawerHeader>
            <DrawerBody p={0} display="flex" flexDir="column">
              <Box p={3}>
                <Button
                  w="100%"
                  variant="glassAccent"
                  leftIcon={<Icon as={MdAdd} />}
                  onClick={() => {
                    createNewSession();
                    onClose();
                  }}
                >
                  {t('newChat')}
                </Button>
              </Box>

              <VStack
                flex={1}
                overflowY="auto"
                align="stretch"
                spacing={0}
                px={2}
                pb={2}
              >
                {sessions.map((s) => (
                  <Flex
                    key={s.id}
                    p={3}
                    align="center"
                    cursor="pointer"
                    borderRadius="md"
                    bg={
                      s.id === currentSessionId
                        ? sessionActiveBg
                        : 'transparent'
                    }
                    _hover={{ bg: sessionItemBgHover }}
                    onClick={() => {
                      switchSession(s.id);
                      onClose();
                    }}
                  >
                    <Icon as={MdOutlineChat} mr={3} color="gold" />
                    <Box flex={1} overflow="hidden">
                      {editingSessionId === s.id ? (
                        <HStack flex={1} onClick={(e) => e.stopPropagation()}>
                          <Input
                            size="xs"
                            value={editTitleValue}
                            onChange={(e) => setEditTitleValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                renameSession(s.id, editTitleValue);
                                setEditingSessionId(null);
                              } else if (e.key === 'Escape') {
                                setEditingSessionId(null);
                              }
                            }}
                            autoFocus
                          />
                          <IconButton
                            icon={<Icon as={MdCheck} />}
                            size="xs"
                            aria-label="Save"
                            colorScheme="green"
                            onClick={() => {
                              renameSession(s.id, editTitleValue);
                              setEditingSessionId(null);
                            }}
                          />
                          <IconButton
                            icon={<Icon as={MdClose} />}
                            size="xs"
                            aria-label="Cancel"
                            onClick={() => setEditingSessionId(null)}
                          />
                        </HStack>
                      ) : (
                        <>
                          <Text
                            fontSize="sm"
                            fontWeight={
                              s.id === currentSessionId ? 'bold' : 'medium'
                            }
                            noOfLines={1}
                          >
                            {s.title}
                          </Text>
                          <Text fontSize="xs" color={textMuted}>
                            {new Date(s.updatedAt).toLocaleTimeString()} -{' '}
                            {new Date(s.updatedAt).toLocaleDateString()}
                          </Text>
                        </>
                      )}
                    </Box>
                    {!editingSessionId && (
                      <>
                        <IconButton
                          icon={<Icon as={MdEdit} />}
                          size="xs"
                          aria-label={t('renameSession')}
                          variant="ghost"
                          color="onGlass"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSessionId(s.id);
                            setEditTitleValue(s.title);
                          }}
                        />
                        <IconButton
                          icon={<Icon as={MdDeleteOutline} />}
                          size="xs"
                          aria-label="Delete"
                          variant="ghost"
                          color="peach"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(s.id);
                          }}
                        />
                      </>
                    )}
                  </Flex>
                ))}
              </VStack>

              <VStack
                p={3}
                borderTop="1px solid"
                borderColor={headerBorder}
                spacing={2}
                align="stretch"
                bg={drawerFooterBg}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  color="onGlass"
                  justifyContent="flex-start"
                  leftIcon={<Icon as={MdFileUpload} />}
                  onClick={handleImportClick}
                >
                  {t('importChat')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  color="onGlass"
                  justifyContent="flex-start"
                  leftIcon={<Icon as={MdFileDownload} />}
                  onClick={() => {
                    exportSessions();
                    onClose();
                  }}
                  isDisabled={sessions.length === 0}
                >
                  {t('exportChat')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  justifyContent="flex-start"
                  leftIcon={<Icon as={MdDeleteOutline} />}
                  onClick={() => setDeleteTarget('all')}
                  isDisabled={sessions.length === 0}
                >
                  {t('clearAllSessions')}
                </Button>

                {/* Provider Settings (BYOK) */}
                <ProviderSettings providerHook={providerHook} t={t} />

                <HStack px={2} pt={2} pb={1} spacing={2} align="flex-start">
                  <Icon
                    as={MdLockOutline}
                    color="gold"
                    mt={0.5}
                    boxSize={3.5}
                  />
                  <Text fontSize="xs" color={textHint} lineHeight="shorter">
                    {t('privacyNotice')}
                  </Text>
                </HStack>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={deleteTarget !== null}
          leastDestructiveRef={cancelRef}
          onClose={() => setDeleteTarget(null)}
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent mx={4}>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {t('confirmDeleteTitle')}
              </AlertDialogHeader>
              <AlertDialogBody>
                {deleteTarget === 'all'
                  ? t('confirmClearAllMsg')
                  : t('confirmDeleteMsg')}
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} variant="glass" onClick={() => setDeleteTarget(null)}>
                  {t('cancel')}
                </Button>
                <Button
                  variant="glassAccent"
                  onClick={() => {
                    if (deleteTarget === 'all') {
                      clearAllSessions();
                      onClose();
                    } else if (deleteTarget) {
                      deleteSession(deleteTarget);
                    }
                    setDeleteTarget(null);
                  }}
                  ml={3}
                >
                  {t('confirm')}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Flex>

      {/* Messages Scroll Area - Full Width */}
      <Box
        id="chat-scroll-area"
        flex={1}
        overflowY="auto"
        w="100%"
        css={{
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            background: scrollbarThumbBg,
            borderRadius: '10px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: scrollbarThumbHoverBg
          }
        }}
      >
        <Container
          maxW="container.lg"
          py={4}
          px={4}
          display="flex"
          flexDir="column"
          minH="100%"
        >
          {/* Empty State */}
          {!hasMessages && (
            <VStack
              spacing={6}
              align="stretch"
              flex={1}
              justify="center"
              py={8}
            >
              <Box
                id="pyra-empty-box"
                textAlign="center"
                py={{ base: 10, md: 12 }}
                px={6}
                className="pyra-chat-empty"
                display="flex"
                flexDir="column"
                alignItems="center"
                minH="300px"
                justifyContent="center"
              >
                <motion.div
                  layoutId="shared-pyra"
                  style={{ marginBottom: '16px', cursor: 'pointer' }}
                  animate={{ rotate: clickSpin * 360 }}
                  transition={{ type: 'spring', bounce: 0.5, duration: 1.5 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setClickSpin((prev) => prev + 1)}
                >
                  <PyraMascot size={150} state="playful" />
                </motion.div>
                <Text className="pyra-eyebrow" m={0} mb={2}>
                  ‹ Pyra ›
                </Text>
                <Heading
                  as="h1"
                  fontSize={{ base: '30px', md: '44px' }}
                  color="claret"
                  textTransform="uppercase"
                  fontWeight={900}
                  lineHeight={1.05}
                  mb={4}
                >
                  {t('emptyStateTitle')}
                </Heading>
                <Text
                  color={'ink'}
                  fontSize="17px"
                  maxW="md"
                  mx="auto"
                  mb={3}
                >
                  {t('emptyStateSubtitle')}
                </Text>
                <Text
                  color={'inkMuted'}
                  fontSize="15px"
                  fontStyle="italic"
                >
                  {t('emptyStateExample')}
                </Text>
              </Box>
            </VStack>
          )}

          {/* Messages */}
          {hasMessages && (
            <VStack spacing={4} align="stretch" py={2}>
              {messages.map((message) => {
                // Hide empty assistant placeholder while searching
                if (
                  message.role === 'assistant' &&
                  !message.content &&
                  phase === 'searching'
                ) {
                  return null;
                }
                return (
                  <ChatMessageBubble key={message.id} message={message} t={t} />
                );
              })}

              {/* Streaming Indicator */}
              {isStreaming && phase === 'searching' && (
                <StreamingIndicator phase="searching" t={t} />
              )}

              {/* Error + Retry */}
              {phase === 'error' && error && (
                <HStack justify="center" py={2}>
                  <Button
                    onClick={retryLastMessage}
                    variant="outline"
                  >
                    {t('retryButton')}
                  </Button>
                </HStack>
              )}

              <div ref={messagesEndRef} />
            </VStack>
          )}
        </Container>
      </Box>

      {/* Input Area - Full Width Wrapper */}
      <Box w="100%" flexShrink={0} bg="transparent">
        <Container maxW="container.lg" px={4}>
          <ChatInput
            onSend={(msg) => {
              sendMessage(msg);
              incrementSurveyUsage();
            }}
            isDisabled={isStreaming}
            placeholder={`${t('inputPlaceholder')} - ${t('tip')}`}
          />
          <Text
            fontSize="13px"
            fontFamily="var(--font-text)"
            fontStyle="italic"
            color={'inkMuted'}
            textAlign="center"
            mt={2}
          >
            {t('reminder')}
          </Text>
          {/* Thanh công cụ kính nhỏ dưới ô chat */}
          <HStack justify="center" mt={2} mb={2}>
          <HStack className="pr-glass pr-glass--strong pyra-chat-tools" spacing={1}>
            <Tooltip label={t('guideTitle')} hasArrow>
              <Flex
                as="button"
                onClick={onGuideOpen}
                aria-label="Guide"
                boxSize="44px"
                align="center"
                justify="center"
                rounded="full"
                color="onGlass"
                _hover={{
                  bg: 'glassChip'
                }}
                transition="all 0.2s"
              >
                <Icon as={MdHelpOutline} boxSize={5} />
              </Flex>
            </Tooltip>

            <Tooltip label={tFooter('sourceCode')} hasArrow>
              <Flex
                as="a"
                href="https://github.com/minhphuc010194/NumerologyWebApp"
                target="_blank"
                boxSize="44px"
                align="center"
                justify="center"
                rounded="full"
                color="onGlass"
                _hover={{
                  bg: 'glassChip'
                }}
                transition="all 0.2s"
              >
                <Icon as={AiFillGithub} boxSize={5} />
              </Flex>
            </Tooltip>

            <Feeacback isHeader />

            <LanguageSwitcher isHeader />

            <Tooltip label={tFooter('mode', { mode: colorMode })} hasArrow>
              <Flex
                as="button"
                onClick={toggleColorMode}
                boxSize="44px"
                align="center"
                justify="center"
                rounded="full"
                _hover={{
                  bg: 'glassChip'
                }}
                transition="all 0.2s"
              >
                {colorMode === 'light' ? (
                  <Icon as={MoonIcon} boxSize={5} color="onGlass" />
                ) : (
                  <Icon as={SunIcon} boxSize={5} color="gold" />
                )}
              </Flex>
            </Tooltip>
          </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Floating Pyra Mascot when chatting (Idle) */}
      {hasMessages && !isStreaming && (
        <Tooltip label="Scroll to Top" placement="left" hasArrow bg="claret">
          <Box
            as={motion.div}
            layoutId="shared-pyra"
            position="fixed"
            bottom={{ base: '170px', md: '150px' }}
            right={{ base: '15px', md: '25px' }}
            zIndex={10}
            pointerEvents="auto"
            display="flex"
            cursor="pointer"
            onClick={() => {
              const el = document.getElementById('chat-scroll-area');
              if (el) {
                el.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <PyraMascot size={{ base: '55px', md: '80px' }} state="idle" />
          </Box>
        </Tooltip>
      )}

      {/* Guide Modal Component */}
      <ChatGuideModal isOpen={isGuideOpen} onClose={onGuideClose} t={t} />

      {/* Survey Banner */}
      <SurveyBanner page="chat" />
    </Box>
  );
}
