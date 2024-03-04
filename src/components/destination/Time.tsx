import { useFormatter, useTranslations } from 'next-intl';

function Time({
  className,
  createdAt,
  modifiedAt,
}: {
  className?: string;
  createdAt: Date;
  modifiedAt: Date | null;
}) {
  const t = useTranslations('destination');
  const format = useFormatter();
  return (
    <div className={className}>
      <time className='whitespace-nowrap' dateTime={createdAt.toISOString()}>
        {format.dateTime(createdAt, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })}
      </time>
      {modifiedAt && (
        <>
          &nbsp;{' '}
          <span className='whitespace-nowrap italic text-default-500'>
            {t('modified') + ': '}
            <time dateTime={modifiedAt.toISOString()}>
              {format.dateTime(modifiedAt, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </time>
          </span>
        </>
      )}
    </div>
  );
}

export { Time };
