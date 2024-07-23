import Text from "@common/text";
import YoutubePlayer from "@common/youtube-player";

const Players = () => {
  return (
    <div>
      <div className="mb-4">
        <Text typography="t6" className="mb-1">
          풀업 자세 배우기
        </Text>
        <YoutubePlayer url="https://www.youtube.com/watch?v=eGo4IYlbE5g" />
      </div>
      <div>
        <Text typography="t6" className="mb-1">
          여러가지 풀업 운동
        </Text>
        <YoutubePlayer url="https://www.youtube.com/watch?v=9FN4Z26kPVY" />
      </div>
    </div>
  );
};

export default Players;
