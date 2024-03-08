import { Card, CardBody } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

type NoContentProps = {
  message: string;
};

function NoContent({ message }: NoContentProps) {
  return (
    <Card>
      <CardBody
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p> Du har ingen {message}</p>
      </CardBody>
    </Card>
  );
}
export { NoContent };
