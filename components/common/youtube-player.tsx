"use client";

import useIsMounted from "@hooks/useIsMounted";
import ReactPlayer from "react-player";
import Skeleton from "./skeleton";

interface YoutubePlayerProps {
  url: string;
}

const YoutubePlayer = ({ url }: YoutubePlayerProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return (
      <div className="player-wrapper">
        <Skeleton className="react-player h-full w-full" />
      </div>
    );
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
