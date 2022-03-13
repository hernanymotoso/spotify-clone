/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { IPlaylistTracksItem } from '../atoms/playlistAtom';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import { millisToMinutesAndSeconds } from '../lib/time';

interface ISongProps {
  order: number;
  track: IPlaylistTracksItem;
}
const Song: React.FC<ISongProps> = ({ order, track }) => {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const handlePlaySong = useCallback(() => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi
      .play({
        uris: [track.track.uri],
      })
      .catch(err => {
        // eslint-disable-next-line no-alert
        alert('Only premium assinants can skip to next track');
        console.log('Play song error', err);
      });
  }, [
    setCurrentTrackId,
    setIsPlaying,
    track.track.id,
    track.track.uri,
    spotifyApi,
  ]);

  return (
    <div
      onClick={() => handlePlaySong()}
      className="grid cursor-pointer grid-cols-2 rounded-lg py-4 px-5 text-gray-500 hover:bg-gray-900"
    >
      <div className="items=center flex space-x-4">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={track.track.album.images[0].url}
          alt=""
        />
        <div>
          <p className="w-36 truncate text-white lg:w-64">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>
      <div className="ml-auto flex items-center justify-between md:ml-0">
        <p className="hidden w-40 md:inline">{track.track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
};

export default Song;
