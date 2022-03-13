/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ChevronDownIcon } from '@heroicons/react/outline';
import { useSession, signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistState, playlistIdState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
];

const Center: React.FC = () => {
  console.log('Center');
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [color, setColor] = useState<string>();

  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then(response => {
        console.log('The playlist data is', response);
        setPlaylist(response.body);
      })
      .catch(err =>
        console.log(
          'Something wrong when we getting playlist in Center component',
          err,
        ),
      );
  }, [spotifyApi, playlistId, setPlaylist]);

  return (
    <div className="h-screen flex-grow overflow-y-scroll scrollbar-hide ">
      <header className="absolute top-5 right-8">
        <div
          onClick={() => signOut()}
          className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 opacity-90 hover:opacity-80"
        >
          <img
            className="h-10 w-10 rounded-full"
            src={session?.user.image as string}
            alt=""
          />
          <h2 className="text-white">{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b p-8 ${color} to-black text-white`}
      >
        <img className="h-44 w-44" src={playlist?.images?.[0].url} alt="" />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
            {playlist?.name}
          </h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Center;
