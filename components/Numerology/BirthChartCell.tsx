'use client';
import { FC, useMemo } from 'react';
import {
  Box,
  Text,
  Tooltip
} from '@/components';
import type { BirthChartGrid } from '@/hooks/useBirthChart';
import { useTranslations } from 'next-intl';

interface BirthChartCellProps {
  cell: BirthChartGrid;
  onClick?: (number: number) => void;
  /** Stagger delay index for animation */
  animationIndex: number;
  /** Ô nằm trên một mũi tên đủ số → thêm viền trong màu vàng */
  inArrow?: boolean;
}

export const BirthChartCell: FC<BirthChartCellProps> = ({
  cell,
  onClick,
  animationIndex,
  inArrow
}) => {
  const tChart = useTranslations('BirthChart');
  const isPresent = cell.frequency > 0;

  // Màu theo design system: ô có số = nền giấy + số đỏ rượu; ô trống = nét đứt
  const presentBg = 'paper';
  const absentBg = 'transparent';
  const presentBorder = 'line';
  const absentBorder = 'line';
  const numberColor = 'claret';
  const absentNumberColor = 'inkMuted';
  const isolatedBorder = 'danger';
  const frequencyBadgeBg = 'claretFill';

  const displayContent = useMemo(() => {
    if (!isPresent) return String(cell.number);
    // Show the digit repeated by frequency (e.g., 1 appears 2 times → "11")
    return String(cell.number).repeat(cell.frequency);
  }, [cell.number, cell.frequency, isPresent]);

  let tooltipLabel = isPresent
    ? tChart('frequency', { count: cell.frequency })
    : tChart('absent');

  if (cell.isIsolated) {
    tooltipLabel += ` - ${tChart('isolatedNumber') || 'Bị cô lập'}`;
  }

  return (
    <Tooltip
      label={tooltipLabel}
      placement="top"
      hasArrow
      fontSize="xs"
      borderRadius="md"
    >
      <Box
        position="relative"
        w="100%"
        paddingBottom="100%"
        cursor={onClick ? 'pointer' : 'default'}
        onClick={() => onClick?.(cell.number)}
        role="button"
        aria-label={`${tChart('cellLabel', { number: cell.number })} — ${tooltipLabel}`}
        sx={{
          animation: `fadeInCell 0.4s ease-out ${animationIndex * 0.06}s both`
        }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          bg={isPresent ? presentBg : absentBg}
          borderWidth={cell.isIsolated ? '2px' : '1.5px'}
          borderColor={cell.isIsolated ? isolatedBorder : (isPresent ? presentBorder : absentBorder)}
          borderStyle={isPresent ? 'solid' : 'dashed'}
          borderRadius="var(--radius-sm)"
          boxShadow={inArrow ? 'inset 0 0 0 2px var(--gold)' : 'none'}
          transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
          _hover={{
            transform: 'scale(1.04)',
            borderColor: 'gold'
          }}
          _active={{
            transform: 'scale(0.97)'
          }}
        >
          {/* Number display */}
          <Text
            fontSize={isPresent ? { base: '20px', md: '26px' } : '15px'}
            fontFamily={isPresent ? 'var(--font-display)' : 'var(--font-ui)'}
            fontWeight={isPresent ? 700 : 500}
            m={0}
            color={isPresent ? numberColor : absentNumberColor}
            lineHeight={1}
            letterSpacing={cell.frequency > 1 ? '2px' : 'normal'}
          >
            {displayContent}
          </Text>

          {/* Frequency badge - only show when > 1 */}
          {cell.frequency > 1 && (
            <Box
              position="absolute"
              top={{ base: '2px', md: '4px' }}
              right={{ base: '2px', md: '4px' }}
              bg={frequencyBadgeBg}
              color="onClaret"
              borderRadius="full"
              w={{ base: '14px', md: '18px' }}
              h={{ base: '14px', md: '18px' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize={{ base: '8px', md: '10px' }}
              fontWeight={700}
            >
              {cell.frequency}
            </Box>
          )}
        </Box>
      </Box>
    </Tooltip>
  );
};
