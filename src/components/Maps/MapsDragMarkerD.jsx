import React, { useState, useRef, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMap, Marker } from "react-leaflet";
import { updateLocationCam, updateAngleCam } from "@/redux/slice/formCamSlice";
import { updateLocationVms } from "@/redux/slice/formVmsSlice";
import {
  vmsIcon,
  camAIDomeIcon,
  camAIFixedIcon,
  camFixedIcon,
  camDomeIcon,
  sectorAICam,
  sectorCam,
  cabinetIcon,
} from "../../../public/icons";
function MapsDragMarkerD() {
  const dispatch = useDispatch();
  const map = useMap();
  const { device, isAddingDevice } = useSelector((state) => state.addDevice);
  const [rotation, setRotation] = useState(0); // Trạng thái xoay của sectorCam
  const [isDragging, setIsDragging] = useState(false); // Trạng thái bấm giữ chuột
  const sectorCamRef = useRef(null);
  const camRef = useRef(null);
  console.log(rotation);
  // Hàm tính toán góc giữa sectorCam và vị trí chuột
  const calculateRotation = (e) => {
    const camElement = sectorCamRef.current?._icon;
    if (!camElement) return;
    const rect = camElement.getBoundingClientRect(); // Lấy vị trí của camFixedIcon trên màn hình
    const centerX = rect.left + rect.width / 2; // Tâm của camFixedIcon theo trục X
    const centerY = rect.top + rect.height / 2; // Tâm của camFixedIcon theo trục Y

    // Tính toán góc dựa trên vị trí chuột
    const radians = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const degree = radians * (180 / Math.PI); // Chuyển từ radian sang độ
    return degree;
  };

  // Hàm xử lý khi bấm giữ chuột
  const handleMouseDown = () => {
    setIsDragging(true); // Bắt đầu kéo
    map.dragging.disable(); // Vô hiệu hóa kéo bản đồ
  };

  // Hàm xử lý khi thả chuột
  const handleMouseUp = () => {
    setIsDragging(false); // Dừng kéo
    map.dragging.enable(); // Kích hoạt lại kéo bản đồ
  };

  // Hàm xử lý khi di chuyển chuột
  const handleMouseMove = (e) => {
    if (isDragging) {
      const newRotation = calculateRotation(e);
      setRotation(newRotation); // Cập nhật góc xoay
    }
  };

  useEffect(() => {
    if (!map) return;

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    if (device.position && !isDragging) {
      map.setView(device.position, map.getZoom());
    }

    if (!isDragging) {
      dispatch(updateAngleCam(rotation));
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [device.position, isDragging, map]);

  useEffect(() => {
    if (!map) return;
    const sectorCamEl = sectorCamRef.current;
    const camEl = camRef.current;

    map.on("zoomstart", () => {
      if (sectorCamEl && sectorCamEl._icon)
        sectorCamEl._icon.style.display = "none";
    });

    if (sectorCamEl && camEl && map) {
      // map.setView(device.position, map.getZoom());
      sectorCamEl._icon.style.transformOrigin = "8.5px 17px";
      sectorCamEl._icon.style.transform = `translate3d(${
        camEl._icon._leaflet_pos.x + 12
      }px, ${camEl._icon._leaflet_pos.y}px, 0px) rotate(${rotation}deg)`;
    }
    return () => {
      map.on("zoomend", () => {
        if (sectorCam && camEl) {
          sectorCamEl._icon.style.transformOrigin = "8.5px 17px";
          sectorCamEl._icon.style.transform = `translate3d(${
            camEl._icon._leaflet_pos.x + 12
          }px, ${camEl._icon._leaflet_pos.y}px, 0px) rotate(${rotation}deg)`;
          sectorCamEl._icon.style.display = "block";
        }
      });
    };
  }, [map, device.position, rotation]);
  const getIconMark = {
    vms: [vmsIcon],
    camFixed: [camFixedIcon, sectorCam],
    camAIFixed: [camAIFixedIcon, sectorAICam],
    camDome: [camDomeIcon, sectorCam],
    camAIDome: [camAIDomeIcon, sectorAICam],
    cab: [cabinetIcon],
  };
  // Hàm kiểm tra và điều chỉnh vị trí của bản đồ nếu marker gần biên
  const adjustMapIfNeeded = (latlng) => {
    const bounds = map.getBounds(); // Lấy giới hạn hiện tại của bản đồ
    if (!bounds.contains(latlng)) {
      map.panTo(latlng); // Di chuyển bản đồ để hiển thị marker trong tầm nhìn
    }
  };
  // Hàm xử lý khi thả chuột sau khi kéo marker
  const handleMarkerDragEnd = (e) => {
    const newPosition = {
      lat: e.target.getLatLng().lat,
      lng: e.target.getLatLng().lng,
    };

    // dispatch(updateMarkerPosition(newPosition));
    if (device.type === "vms") dispatch(updateLocationVms(newPosition));
    if (device.type === "camFixed" || device.type === "camDome") {
      dispatch(updateLocationCam(newPosition));
      sectorCamRef.current._icon.style.display = "block";
    }

    adjustMapIfNeeded(newPosition); // Kiểm tra và điều chỉnh bản đồ nếu cần
    map.setView(newPosition, map.getZoom()); // Căn giữa bản đồ vào vị trí mới
  };

  const handleMarkerDrag = () => {
    sectorCamRef.current._icon.style.display = "none";
  };

  return isAddingDevice ? (
    <>
      {(device.type === "camFixed" || device.type === "camDome") && (
        <div>
          <Marker
            ref={sectorCamRef}
            icon={getIconMark[device.typeAndFeature][1]}
            position={device.position}
            draggable={false}
            eventHandlers={{
              mousedown: handleMouseDown, // Khi bấm giữ để xoay
            }}
          ></Marker>
          <Marker
            ref={camRef}
            icon={getIconMark[device.typeAndFeature][0]}
            position={device.position}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
              drag: handleMarkerDrag,
            }}
          ></Marker>
        </div>
      )}
      {device.type === "vms" && (
        <Marker
          icon={getIconMark[device.typeAndFeature][0]}
          position={device.position}
          draggable={true}
          eventHandlers={{ dragend: handleMarkerDragEnd }}
        ></Marker>
      )}
      {device.type === "cab" && (
        <Marker
          icon={getIconMark[device.typeAndFeature][0]}
          position={device.position}
          draggable={true}
          eventHandlers={{ dragend: handleMarkerDragEnd }}
        ></Marker>
      )}
    </>
  ) : null;
}

export default memo(MapsDragMarkerD);
