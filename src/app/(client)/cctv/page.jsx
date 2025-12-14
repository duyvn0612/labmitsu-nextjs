"use client";
import { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Select, Splitter } from "antd";
import { fetchTreeCameras } from "@/redux/middlewares/apiCamSlice";
import TreeViewTrafficAnt from "@/components/TreeViewTraffic/TreeViewTrafficAnt";
import { updateGridSize } from "@/redux/slice/cctvSlice";
import VideoJS from "./VideoJS";
import videojs from "video.js";
const { Option } = Select;
const getGridColsClass = (size) => {
  switch (size) {
    case 2:
      return "grid-cols-2 grid-rows-2";
    case 3:
      return "grid-cols-3 grid-rows-3";
    case 4:
      return "grid-cols-4 grid-rows-4";
    case 5:
      return "grid-cols-5 grid-rows-5";
    case 6:
      return "grid-cols-6 grid-rows-6";
    case 7:
      return "grid-cols-7 grid-rows-7";
    case 8:
      return "grid-cols-8 grid-rows-8";
    default:
      return "grid-cols-2 grid-rows-2";
  }
};
export default function CCTVPage() {
  const dispatch = useDispatch();
  const { treeCameras, status } = useSelector((state) => state.apiCamera);
  const { gridSize, selectCameras } = useSelector((state) => state.cctv);
  useEffect(() => {
    if (status === "idle" && treeCameras.length === 0) {
      dispatch(fetchTreeCameras());
    }
  }, [dispatch, status, treeCameras.length]);

  // application/x-mpegURL

  const handlePlayerReady = (player) => {
    // playerRefs.current = player;
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };
  const handleChange = (value) => {
    dispatch(updateGridSize(value));
  };
  const openFullScreen = () => {
    const container = document.getElementById("full-screen");
    if (container) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen(); // Firefox
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen(); // Chrome, Safari và Opera
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen(); // IE/Edge
      }
    }
  };

  return (
    <div className="flex flex-col justify-stretch h-full">
      <div className="flex justify-between h-[40px]">
        <h1 className="text-2xl ">CCTV</h1>
        <div className="flex items-center gap-2">
          <button onClick={openFullScreen}>
            <Image
              src={"/images/fullScreen.svg"}
              width={0}
              height={0}
              style={{ width: "auto", height: "30px" }}
              alt="full screen"
              className="transition-transform hover:scale-125"
            />
          </button>
          <Select
            defaultValue={gridSize}
            onChange={handleChange}
            style={{ width: 90 }}
          >
            <Option value="2">2x2</Option>
            <Option value="3">3x3</Option>
            <Option value="4">4x4</Option>
            <Option value="5">5x5</Option>
            <Option value="6">6x6</Option>
            <Option value="7">7x7</Option>
            <Option value="8">8x8</Option>
          </Select>
        </div>
      </div>
      <div className="grow">
        <div className="h-full grid grid-cols-7 grid-rows-5 gap-2">
          <div className="col-span-2 row-span-5">
            {status === "loading" ? (
              <div>Loading...</div>
            ) : (
              <div className="h-full">
                <TreeViewTrafficAnt data={treeCameras} type="camera" />
              </div>
            )}
          </div>
          <div className="col-span-5 row-span-5 col-start-3" id="full-screen">
            <div className={`h-full grid ${getGridColsClass(+gridSize)}`}>
              {Array.from({ length: gridSize * gridSize }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center border w-full h-full"
                >
                  {selectCameras[index] ? (
                    <div className="w-full h-full">
                      <VideoJS
                        key={index}
                        options={{
                          autoplay: true,
                          controls: true,
                          fluid: true,
                          responsive: true,
                          sources: [
                            {
                              src: selectCameras[index].linkViewVideo,
                              type: "application/x-mpegURL",
                            },
                          ],
                        }}
                        onReady={handlePlayerReady}
                        videoId={selectCameras[index].key}
                      />
                    </div>
                  ) : (
                    <Image
                      src={"/images/videoIcon1.svg"}
                      width={0}
                      height={0}
                      style={{ width: "70px", height: "auto" }}
                      alt="video"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
