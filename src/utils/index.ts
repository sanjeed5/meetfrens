export const getStream = (_track: MediaStreamTrack) => {
  const stream = new MediaStream();
  stream.addTrack(_track);
  return stream;
};
