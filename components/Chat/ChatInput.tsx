'use client';
import { useRef, useCallback, KeyboardEvent } from 'react';
import {
  Flex,
  Box,
  Textarea,
  Button,
  Icon,
  HStack
} from '@chakra-ui/react';
import { AiOutlineSend } from 'react-icons/ai';

interface ChatInputProps {
  onSend: (content: string) => void;
  isDisabled: boolean;
  placeholder: string;
}

export function ChatInput({ onSend, isDisabled, placeholder }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Ô nhập: nền giấy đậm, gạch chân đỏ rượu; nút Gửi = nút chính (Primary)
  const inputBg = 'paperDeep';
  const inputBorder = 'line';

  const handleSend = useCallback(() => {
    const value = textareaRef.current?.value?.trim();
    if (!value || isDisabled) return;

    onSend(value);

    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  }, [onSend, isDisabled]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleAutoResize = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const maxHeight = 150; // ~6 lines
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, []);

  return (
    <Flex
      bg={inputBg}
      borderRadius="var(--radius-md)"
      borderWidth={1}
      borderColor={inputBorder}
      borderBottom="2px solid var(--claret)"
      alignItems="flex-end"
      pl={4}
      pr={2}
      py={2}
      _focusWithin={{
        outline: '2px solid var(--gold)',
        outlineOffset: '2px'
      }}
      transition="all 0.2s"
      w="100%"
    >
      {/* Input Field */}
      <Textarea
        ref={textareaRef}
        autoFocus
        placeholder={placeholder}
        bg="transparent"
        border="none"
        borderBottom="none"
        color="ink"
        fontFamily="var(--font-text)"
        _focus={{ boxShadow: 'none' }}
        _focusVisible={{ outline: 'none', boxShadow: 'none' }}
        _hover={{ border: 'none' }}
        onKeyDown={handleKeyDown}
        onInput={handleAutoResize}
        fontSize="17px"
        p={0}
        py={2}
        mr={2}
        lineHeight="24px"
        minH="80px"
        maxH="150px"
        resize="none"
        rows={1}
        overflow="auto"
        overflowY="hidden"
        flex={1}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '10px'
          }
        }}
      />

      {/* Right Controls */}
      <Box>
        <Button
          onClick={handleSend}
          aria-label="Send"
          isDisabled={isDisabled}
          w="44px"
          h="44px"
          minW="44px"
          p={0}
          flexShrink={0}
        >
          <Icon as={AiOutlineSend} boxSize={5} />
        </Button>
      </Box>
    </Flex>
  );
}
