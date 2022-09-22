export interface SongInfo {
  name: string;
}

export interface Song {
  name: string;
  duration: number;
  albums?: string;
  dirName?: string;
  isPlaying?: boolean;
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
