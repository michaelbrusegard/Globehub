import { Button, Image } from '@nextui-org/react';

export default function LogIn({ params: { locale } }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Button color='primary' auto size='large' shadow>
        <Image
          src='/authenticator.png'
          alt='Google Authenticator'
          width={48}
          height={48}
          style={{ marginRight: '10px' }}
        />
        Google Authenticator
      </Button>
    </div>
  );
}
