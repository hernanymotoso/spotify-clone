import React from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { Provider } from 'next-auth/providers';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

interface ILoginProps {
  providers: Provider[];
}

const Login: React.FC<ILoginProps> = ({ providers }) => {
  console.log('Login');

  return (
    <div>
      <img
        className="mb-5 w-52"
        src="https://links.papareact.com/9xl"
        alt="Spotify"
      />
      {providers &&
        Object.values(providers).map(provider => (
          <div>
            <button type="button">Login with {provider.name}</button>
          </div>
        ))}
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const providers = await getProviders();
  console.log('Providers', providers);

  return {
    props: {
      providers,
    },
  };
};
