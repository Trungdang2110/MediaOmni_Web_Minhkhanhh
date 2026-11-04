import { Icon, Tooltip, MdOutlineFeedback } from 'components';
import { useTranslations } from 'next-intl';
import { openSurveyManually } from '@/hooks/useSurveyTrigger';

/** Nút kính tròn "Góp ý & khảo sát" trên thanh công cụ */
export const Feeacback = ({ isHeader = false }: { isHeader?: boolean }) => {
  const t = useTranslations('Feedback');
  const label = t('tooltip', { email: 'bumlowkey@proton.me' });

  return (
    <Tooltip label={label} hasArrow>
      <button
        type="button"
        onClick={openSurveyManually}
        className="pr-gbtn pr-gbtn--round"
        aria-label={label}
      >
        <Icon as={MdOutlineFeedback} boxSize={5} />
      </button>
    </Tooltip>
  );
};
