/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';

import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from '@heroicons/react/outline';
// import spotifyApi from '../lib/spotify';
import useSpotify from '../hooks/useSpotify';
import { playlistIdState } from '../atoms/playlistAtom';

interface IPlaylist {
  id: string;
  name: string;
}

const Sidebar: React.FC = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState<IPlaylist[]>([] as IPlaylist[]);

  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  console.log('You picked the playlist', playlistId);

  useEffect(() => {
    console.log('spotifyApi.getAccessToken()', spotifyApi.getAccessToken());
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then(response => {
        console.log('Minhas playlists', response.body.items);
        setPlaylists(response.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className="hidden h-screen overflow-y-scroll border-r border-gray-900 p-5 pb-36 text-xs text-gray-500 scrollbar-hide sm:max-w-[12rem] md:inline-flex lg:max-w-[15rem] lg:text-sm">
      <div className="space-y-4">
        <button
          className="flex items-center space-x-2 hover:text-white"
          type="button"
        >
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-white"
          type="button"
        >
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-white"
          type="button"
        >
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        <button
          className="flex items-center space-x-2 hover:text-white"
          type="button"
        >
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-white"
          type="button"
        >
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-white"
          type="button"
        >
          <RssIcon className="h-5 w-5" />
          <p>Your episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists */}
        {playlists.map(playlist => (
          <p
            key={playlist.id}
            onClick={() => setPlaylistId(playlist.id)}
            className="cursor-pointer  hover:text-white"
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
