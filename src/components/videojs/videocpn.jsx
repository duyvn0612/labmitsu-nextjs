import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { updateDeleteCamera } from "@/redux/slice/cctvSlice";

export default function VideoJS(props) {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady, videoId } = props;

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [videoRef]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);
  const closeVideo = () => {
    dispatch(updateDeleteCamera(videoId));
    const player = playerRef.current;
    if (player && !player.isDisposed()) {
      player.dispose();
      playerRef.current = null;
    }
  };
  return (
    <div data-vjs-player className="group/item relative w-full h-full">
      <div
        ref={videoRef}
        className="flex justify-center items-center w-full h-full"
      />
      <button
        className="absolute z-50 top-2 left-2 invisible group-hover/item:visible"
        onClick={closeVideo}
      >
        <Image
          src={"/images/closebtn.svg"}
          width={0}
          height={0}
          style={{ width: "20px", height: "auto" }}
          alt="closebtn"
        />
      </button>
    </div>
  );
}
