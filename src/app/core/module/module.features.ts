export function convertDurationToTime(time: number) {
  const hours = ('0' + Math.floor(time / 3600));
  const ch = Number(hours);
  const minutes = ('0' + Math.floor((time - ch * 3600) / 60)).slice(-2);
  const seconds = ('0' + Math.floor(time - Math.floor(time / 60) * 60)).slice(-2);
  return ch !== 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}
