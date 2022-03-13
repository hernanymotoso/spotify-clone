import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState } from '../atoms/songAtom';
import useSpotify from './useSpotify';

interface ISongInfo {
  album: { images: { url: string }[] };
  id: string;
  name: string;
  artists: { name: string }[];
}

const useSongInfo = () => {
  const spotifyApi = useSpotify();
  const [currentIdTrack, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState<ISongInfo>({} as ISongInfo);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentIdTrack) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentIdTrack}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          },
        ).then(response => response.json());

        setSongInfo(trackInfo);
        console.log('SONG INFO', trackInfo);
      }
    };

    fetchSongInfo();
  }, [currentIdTrack, spotifyApi]);

  return songInfo;
};

export default useSongInfo;
