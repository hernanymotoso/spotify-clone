import React from 'react';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import Sidebar from '../components/Sidebar';
import Center from '../components/Center';

interface IHomeProps {
  session: Session;
}

const Home: React.FC<IHomeProps> = () => (
  <div className=" h-screen overflow-hidden bg-black">
    <main className="flex">
      <Sidebar />
      <Center />
    </main>

    <div> {/* player */} </div>
  </div>
);

export default Home;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  console.log('Teste');
  const session = await getSession(ctx);
  console.log('Session teste', session);

  return {
    props: {
      session,
    },
  };
};
