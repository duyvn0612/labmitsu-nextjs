import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Tree } from "antd";
import { useDispatch } from "react-redux";
import { resetSelectCamera, updateSelectCamera } from "@/redux/slice/cctvSlice";
const { DirectoryTree } = Tree;
const TreeViewTrafficAnt = ({ data, type }) => {
  const dispatch = useDispatch();
  const [treeData, setTreeData] = useState([]);

  // Hàm chuyển đổi cấu trúc địa chỉ thành Tree structure
  const processData = (jsonData) => {
    if (!jsonData) return [];

    // Chuyển đổi cấu trúc tỉnh -> quận -> phường -> camera
    const provinces = Object.keys(jsonData).map((provinceName) => {
      const districts = Object.keys(jsonData[provinceName]).map(
        (districtName) => {
          const wards = Object.keys(jsonData[provinceName][districtName]).map(
            (wardName) => {
              const cameras =
                jsonData[provinceName][districtName][wardName].Cameras;
              // Kiểm tra nếu có cameras trong phường
              if (cameras && cameras.length > 0) {
                return {
                  title: wardName,
                  key: `${provinceName}-${districtName}-${wardName}`,
                  children: cameras.map((camera) => ({
                    // Thêm biểu tượng SVG trước tiêu đề cho các camera
                    title: (
                      <span className="inline-flex items-baseline gap-1">
                        <Image
                          src={"/images/recordCam.svg"}
                          width={0}
                          height={0}
                          style={{ width: "25px", height: "auto" }}
                          alt="recordCam"
                        />
                        <span>{camera.nameCam}</span>
                      </span>
                    ),
                    key: camera.id,
                    linkViewVideo: camera.linkViewVideo,
                    isLeaf: true,
                  })),
                };
              }
              return {
                title: wardName,
                key: `${provinceName}-${districtName}-${wardName}`,
                isLeaf: true,
              }; // Không có camera, node leaf
            }
          );

          return {
            title: districtName,
            key: `${provinceName}-${districtName}`,
            children: wards,
          };
        }
      );

      return {
        title: provinceName,
        key: provinceName,
        children: districts,
      };
    });

    return provinces;
  };

  // Gọi hàm khi component được render và dữ liệu từ API thay đổi
  useEffect(() => {
    if (data) {
      setTreeData(processData(data));
    }
    return () => {
      dispatch(resetSelectCamera());
    };
  }, [data]);
  // Hàm xử lý khi chọn camera từ Tree
  const onSelectCamera = (keys, event) => {
    const { node } = event;

    if (node.isLeaf && node.linkViewVideo) {
      const { key, linkViewVideo } = node;
      dispatch(updateSelectCamera({ key, linkViewVideo, active: false }));

      // if (!selectedCameras.find((cam) => cam.key === node.key)) {
      //   setSelectedCameras([...selectedCameras, cameraData]);
      // }
    }
  };
  return (
    <DirectoryTree
      showIcon={false}
      height={600}
      className="h-full rounded-md border pt-3"
      treeData={treeData}
      onSelect={onSelectCamera}
    />
  );
};

export default TreeViewTrafficAnt;
