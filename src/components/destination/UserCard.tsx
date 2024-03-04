import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@nextui-org/react';

import type { User } from '@/lib/db';

function UserCard({ user }: { user: User }) {
  return (
    <Card shadow='none' className='max-w-[300px] border-none bg-transparent'>
      <CardHeader className='justify-between'>
        <div className='flex gap-3'>
          <Avatar isBordered radius='full' size='md' src={user.image} />
          <div className='flex flex-col items-start justify-center'>
            <h4 className='text-small font-semibold leading-none text-default-600'>
              {user.name}
            </h4>
            <h5 className='text-small tracking-tight text-default-500'>🎉</h5>
          </div>
        </div>
      </CardHeader>
      <CardBody className='px-3 py-0'>
        <p className='pl-px text-small text-default-500'>{user.bio}</p>
      </CardBody>
      <CardFooter />
    </Card>
  );
}

export { UserCard };
