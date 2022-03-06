import React from 'react';

import Sidebar from '../components/Sidebar';

const Home: React.FC = () => (
  <div className="">
    <main className="h-screen overflow-hidden bg-black">
      <Sidebar />
      {/* Sidebar */}
      {/* center */}
    </main>

    <div> {/* player */} </div>
  </div>
);

export default Home;
