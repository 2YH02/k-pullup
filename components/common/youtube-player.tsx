"use client";

import useIsMounted from "@hooks/useIsMounted";
import ReactPlayer from "react-player";

interface YoutubePlayerProps {
  url: string;
}

const YoutubePlayer = ({ url }: YoutubePlayerProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <div className="player-wrapper">
      <ReactPlayer
        className="react-player"
        url={url}
        width="100%"
        height="100%"
        controls
      />
    </div>
  );
};

export default YoutubePlayer;
