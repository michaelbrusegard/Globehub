import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Spinner,
} from '@nextui-org/react';

import { Logo } from '@/components/layout/Logo';
import { Main } from '@/components/layout/Main';

export default function SignInLoading() {
  return (
    <Main className='flex h-full items-center justify-center'>
      <Card className='m-2 h-64 w-full max-w-md p-2 xs:m-8'>
        <CardHeader className='flex items-center justify-center p-4'>
          <Logo />
        </CardHeader>
        <Divider />
        <CardBody className='flex items-center justify-center gap-4'>
          <Spinner size='lg' />
        </CardBody>
      </Card>
    </Main>
  );
}
