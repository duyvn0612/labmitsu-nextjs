import { Icon } from "leaflet";
const vmsIcon = new Icon({
  iconUrl: "/images/vms.svg",
  iconSize: [60, 65],
});
const camFixedIcon = new Icon({
  iconUrl: "/images/camfixed.svg",
  iconSize: [35, 35],
  className: "custom-cam-icon",
});
const sectorCam = new Icon({
  iconUrl: "/images/camera-sector.svg",
  iconSize: [45, 35],
  className: "custom-sector-icon",
});
const sectorAICam = new Icon({
  iconUrl: "/images/ai-camera-sector.svg",
  iconSize: [45, 35],
});
const camAIFixedIcon = new Icon({
  iconUrl: "/images/camaifixed.svg",
  iconSize: [35, 35],
});
const camDomeIcon = new Icon({
  iconUrl: "/images/cameraDome.svg",
  iconSize: [35, 35],
});
const camAIDomeIcon = new Icon({
  iconUrl: "/images/cameraAIDome.svg",
  iconSize: [35, 35],
});

const cabinetIcon = new Icon({
  iconUrl: "/images/cabinettct.svg",
  iconSize: [45, 45],
});

export {
  vmsIcon,
  camAIDomeIcon,
  camAIFixedIcon,
  camFixedIcon,
  camDomeIcon,
  sectorAICam,
  sectorCam,
  cabinetIcon,
};
