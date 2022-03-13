import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline';
import {
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/solid';
import { debounce } from 'lodash';
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

  const handlePlayPause = useCallback(() => {
    spotifyApi.getMyCurrentPlaybackState().then(response => {
      if (response.body.is_playing) {
        spotifyApi.pause().catch(err => {
          // eslint-disable-next-line no-alert
          alert('Only premium assinants can play and stop track');
          console.log('Play song error', err);
        });
        setIsPlaying(false);
      } else {
        spotifyApi.play().catch(err => {
          // eslint-disable-next-line no-alert
          alert('Only premium assinants can play and stop track');
          console.log('Play song error', err);
        });
        setIsPlaying(true);
      }
    });
  }, [spotifyApi, setIsPlaying]);

  const debouncedAdjustVolume = useCallback(
    debounce(vol => {
      spotifyApi.setVolume(vol).catch(err => {
        // eslint-disable-next-line no-alert
        alert('Only premium assinants can adjusts the volume');
        console.log('Play song error', err);
      });
    }, 500),
    [],
  );
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();

      setVolume(50);
    }
  }, [spotifyApi, currentTrackId, session, fetchCurrentSong]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume, debouncedAdjustVolume]);

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
      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button h-10 w-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button h-10 w-10" />
        )}
        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>

      {/* Right */}
      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28 "
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={e => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
};

export default Player;
