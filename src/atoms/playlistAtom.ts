import { atom } from 'recoil';

interface IPlaylistImage {
  url: string;
}
export interface IPlaylistTracksItem {
  track: {
    name: string;
    id: string;
    album: { images: { url: string }[]; name: string };
    artists: { id: string; name: string }[];
    duration_ms: number;
  };
}

interface IPlaylistState {
  images: IPlaylistImage[];
  name: string;
  tracks: { items: IPlaylistTracksItem[] };
}

export const playlistState = atom({
  key: 'playlistState',
  default: {} as IPlaylistState,
});

export const playlistIdState = atom({
  key: 'playlistIdState',
  default: '7ssHFdVpGTrjtGbTDiZMQp',
});
