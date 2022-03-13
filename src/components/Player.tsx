import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

const Player: React.FC = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = useCallback(() => {
    // console.log('FETCH SONG', !songInfo.id);
    if (!songInfo.id) {
      // console.log('FETCH SONG');
      spotifyApi.getMyCurrentPlayingTrack().then(response => {
        console.log('Now Playing', response.body?.item?.id);
        setCurrentTrackId(response.body?.item?.id as string);

        spotifyApi.getMyCurrentPlaybackState().then(res => {
          setIsPlaying(res.body?.is_playing);
        });
      });
    }
  }, [setCurrentTrackId, songInfo, spotifyApi, setIsPlaying]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();

      setVolume(50);
    }
  }, [spotifyApi, currentTrackId, session, fetchCurrentSong]);

  return (
    <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      {/* left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden h-10 w-10 md:inline"
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Player;
