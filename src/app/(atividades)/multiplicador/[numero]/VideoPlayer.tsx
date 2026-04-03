"use client"

import YouTube from 'react-youtube';

export default function VideoPlayer({ videoId }) {
  const opts = {
    playerVars: {
      autoplay: 1,
    },
  };

  return (
  <div className="w-full aspect-video">
      <YouTube
      videoId={videoId}
      opts={opts}
      className="w-full h-full"
      iframeClassName="w-full h-full"
    />
  </div>
    )
}