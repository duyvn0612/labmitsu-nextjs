import { useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Card } from "antd";
import { Marker, Popup, useMap } from "react-leaflet";
import { fetchListCamera } from "@/redux/middlewares/apiCamSlice";
import { camFixedIcon, sectorCam, camDomeIcon } from "../../../../public/icons";
import {
  setViewCameras,
  updateFirstStatusViewCam,
  updateStatusViewCam,
} from "@/redux/slice/dboardViewVideo";
import videojs from "video.js";
const { Meta } = Card;
import "../stylePopup.css";
import VideoJSCpn from "@/components/videojs/videocpn";
function RenderCamMarks() {
  const dispatch = useDispatch();
  const map = useMap();
  const sectorCamRefs = useRef([]);
  const camRefs = useRef([]);

  const { listCamera, status } = useSelector(
    (state) => state.apiCamera,
    shallowEqual
  );
  const { viewCameras } = useSelector(
    (state) => state.dboardViewVideo,
    shallowEqual
  );
  useEffect(() => {
    if (status === "idle" && listCamera.length === 0) {
      dispatch(fetchListCamera());
    }
  }, [dispatch, status, listCamera.length]);
  useEffect(() => {
    if (listCamera.length > 0) {
      const viewCams = [];
      listCamera.forEach((camera, index) => {
        viewCams.push({ idx: index, camId: camera.id, status: false });
      });
      dispatch(setViewCameras(viewCams));
    }
  }, [listCamera.length]);
  console.log(viewCameras);

  useEffect(() => {
    if (!map) return;
    listCamera?.forEach((camera, index) => {
      const sectorCamEl = sectorCamRefs.current[index];
      const camEl = camRefs.current[index];
      map.on("zoomstart", () => {
        if (sectorCamEl && sectorCamEl._icon) {
          sectorCamEl._icon.style.display = "none";
        }
      });
      if (sectorCamEl && camEl) {
        sectorCamEl._icon.style.transformOrigin = "8.5px 17px";
        sectorCamEl._icon.style.transform = `translate3d(${
          camEl._icon._leaflet_pos.x + 12
        }px, ${camEl._icon._leaflet_pos.y}px, 0px) rotate(${
          camera.angleCam
        }deg)`;
        sectorCamEl._icon.style.display = "block";
      }
    });

    map.on("zoomend", () => {
      listCamera?.forEach((camera, index) => {
        const sectorCamEl = sectorCamRefs.current[index];
        const camEl = camRefs.current[index];
        if (sectorCamEl && camEl) {
          sectorCamEl._icon.style.transformOrigin = "8.5px 17px";
          sectorCamEl._icon.style.transform = `translate3d(${
            camEl._icon._leaflet_pos.x + 12
          }px, ${camEl._icon._leaflet_pos.y}px, 0px) rotate(${
            camera.angleCam
          }deg)`;
          sectorCamEl._icon.style.display = "block";
        }
      });
    });
    return () => {
      map.off("zoomstart", () => {});
      map.off("zoomend", () => {});
    };
  }, [map, listCamera]);
  const handlePlayerReady = (player) => {
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  const onViewCamera = (camId) => {
    dispatch(updateStatusViewCam(camId));
  };
  const onFirstViewCamera = (camId) => {
    dispatch(updateFirstStatusViewCam(camId));
  };
  return (
    listCamera.length > 0 &&
    listCamera?.map(
      (camera, index) =>
        !camera.featureCam.includes("Camera AI") && (
          <div key={camera.id}>
            <Marker
              ref={(el) => (sectorCamRefs.current[index] = el)}
              icon={sectorCam}
              position={camera.locationCam}
              draggable={false}
            ></Marker>
            <Marker
              ref={(el) => (camRefs.current[index] = el)}
              icon={camera.typeCam === "camFixed" ? camFixedIcon : camDomeIcon}
              position={camera.locationCam}
              eventHandlers={{
                popupclose: () => {
                  viewCameras[index]?.status &&
                    dispatch(updateStatusViewCam(camera.id));
                },
                click: () => {
                  // map.setView(camera.locationCam, 16);
                  onFirstViewCamera(camera.id);
                },
              }}
            >
              <Popup autoClose={false} closeOnClick={false}>
                <Card
                  bodyStyle={{ padding: "12px" }}
                  style={{
                    // body: { padding: 15 },
                    width: 250,
                    marginTop: "25px",
                    padding: "0",
                  }}
                  cover={
                    <>
                      <h2 style={{ textAlign: "center", fontSize: "16px" }}>
                        <b>Thông tin Camera</b>
                      </h2>
                      {viewCameras[index]?.status && (
                        <div className="w-full h-full">
                          <VideoJSCpn
                            options={{
                              autoplay: true,
                              controls: true,
                              responsive: true,
                              fluid: true,
                              sources: [
                                {
                                  src: camera.linkViewVideo,
                                  type: "application/x-mpegURL",
                                },
                              ],
                            }}
                            onReady={handlePlayerReady}
                          />
                        </div>
                      )}
                    </>
                  }
                  actions={[
                    <>
                      <button
                        className={`${
                          viewCameras[index]?.status && "text-red-500"
                        }`}
                        onClick={() => onViewCamera(camera.id)}
                      >
                        View Camera
                      </button>
                    </>,

                    <>
                      <button>Edit</button>
                    </>,
                  ]}
                >
                  <Meta
                    style={{ padding: "0", height: "auto", overflowY: "auto" }}
                    title={
                      <>
                        <span style={{ textAlign: "center" }}>
                          {camera.nameCam}
                        </span>
                      </>
                    }
                    description={
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>
                          <b>Vị trí: </b>
                          {camera.provinces}-{camera.district}-{camera.ward}
                        </span>
                        <span>
                          <b>Tuyến đường: </b>
                          {camera.routeCam}
                        </span>
                        <span>
                          <b>Lớp camera: </b>
                          {camera.classCam}
                        </span>
                        <span>
                          <b>Loại camera: </b>
                          {camera.typeCam === "camFixed"
                            ? "Camera cố định"
                            : "Camera mái vòm"}
                        </span>
                      </div>
                    }
                  />
                </Card>
              </Popup>
            </Marker>
          </div>
        )
    )
  );
}

export default RenderCamMarks;
