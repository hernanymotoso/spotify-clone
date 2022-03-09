import React from 'react';

import Sidebar from '../components/Sidebar';
import Center from '../components/Center';

const Home: React.FC = () => (
  <div className=" h-screen overflow-hidden bg-black">
    <main className="flex">
      <Sidebar />
      <Center />
    </main>

    <div> {/* player */} </div>
  </div>
);

export default Home;
