export interface SongInfo {
  name: string;
}

export interface Song {
  name: string;
  duration?: number;
  dirName?: string;
  isPlaying?: boolean;
  image?: string;
  album?: string;
  lyrics?: string;
  type?: string;
  title?: string;
}

export interface MusicDirInfo {
  name: string;
  path: string;
  songs: Song[];
}

export type MusicDirInfoInDialog = Omit<MusicDirInfo, 'songs'>;

export interface DirOfSongData {
  listDir: MusicDirInfo[];
}

