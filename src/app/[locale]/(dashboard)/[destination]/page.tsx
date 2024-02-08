import { unstable_setRequestLocale } from 'next-intl/server';

export default function LogIn({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <div>
      <h1>Login page:</h1>
      <form>
        <div style={{ marginBottom: '10px' }}></div>

        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            placeholder='Enter your username'
            required
            style={{
              padding: '10px',
              border: '1px solid #ccc', // Border style
              borderRadius: '5px', // Rounded corners
              marginBottom: '15px', // Margin bottom for spacing
            }}
          />
        </div>

        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            placeholder='Enter your password'
            required
            style={{
              padding: '10px',
              border: '1px solid #ccc', // Border style
              borderRadius: '5px', // Rounded corners
              marginBottom: '15px', // Margin bottom for spacing
            }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}></div>

        <button
          type='submit'
          style={{
            backgroundColor: '#4CAF50',
            border: '2px solid #4CAF50', // Border style
            color: 'white',
            padding: '15px 32px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            margin: '4px 2px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          Login
        </button>

        <button
          type='submit'
          style={{
            backgroundColor: '#4CAF50',
            border: '2px solid #4CAF50', // Border style
            color: 'white',
            padding: '15px 32px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            margin: '4px 2px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          Ikke registrert? Registrer deg her.
        </button>
      </form>
    </div>
  );
}
