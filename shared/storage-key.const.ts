



export const LOCAL_KEY_LIST = [
  'ExpandedSidebar',
  'MusicDirectories'
] as const;



export type LocalKeyType = typeof LOCAL_KEY_LIST[number];

export type LocalKey = {
  [key in LocalKeyType]: any;
};

export const STORAGE_KEY = LOCAL_KEY_LIST.reduce((acc, key) => ({
  ...acc,
  [key]: key
}), {} as LocalKey);
