App ID: jqjZmXd6up4YXUYFZPkF
API key: YLmQe5Dk-gi4B08iiiT\_\_p75Rwi5dFfo2mXeUZ2jgjM

function LocationMarker({ device, position }) {
const dispatch = useDispatch();
const markerPosition = position;
const getIconMark = {
vms: vmsIcon,
camFixed: camFixedIcon,
camDome: camDomeIcon,
cab: vmsIcon,
};
const map = useMap();

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
    if (device === "vms") dispatch(updateLocationVms(newPosition));
    if (device === "camFixed" || device === "camDome")
      dispatch(updateLocationCam(newPosition));

    adjustMapIfNeeded(newPosition); // Kiểm tra và điều chỉnh bản đồ nếu cần
    map.setView(newPosition, map.getZoom()); // Căn giữa bản đồ vào vị trí mới

};

return markerPosition === null ? null : (
<div>
<div>
<Marker
icon={getIconMark[device]}
position={markerPosition}
draggable={true} // Cho phép kéo marker
eventHandlers={{
            dragend: handleMarkerDragEnd, // Lắng nghe sự kiện thả marker
          }} ></Marker>
</div>
</div>
);
}
