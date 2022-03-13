import React from 'react';
import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtom';
import Song from './Song';

const Songs: React.FC = () => {
  const playlist = useRecoilValue(playlistState);

  return (
    <div className="flex flex-col space-y-1 px-8 pb-28 text-white">
      {playlist?.tracks?.items.map((item, index) => (
        // <div className="text-white">{track.track.name}</div>
        <Song key={item.track.id} track={item} order={index} />
      ))}
    </div>
  );
};

export default Songs;
