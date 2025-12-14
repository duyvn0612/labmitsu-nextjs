// Giả sử bạn đã tải dữ liệu JSON từ file của mình
import React, { useState } from "react";
import { Select, Form } from "antd";
import { useDispatch } from "react-redux";
import {
  updateDistrictVms,
  updateProvincesVms,
  updateWardVms,
} from "@/redux/slice/formVmsSlice";
import {
  updateDistrictCam,
  updateProvincesCam,
  updateWardCam,
} from "@/redux/slice/formCamSlice";
const { Option } = Select;
const data = require("../../../../public/data/dataVN.json"); // Dữ liệu JSON

// Function để chuyển đổi dữ liệu
const getDistricts = (provinceFullname) => {
  const province = data.find((p) => p.FullName === provinceFullname);
  return province ? province.District : [];
};

const getWards = (provinceFullname, districtFullname) => {
  const districts = getDistricts(provinceFullname);
  const district = districts.find((d) => d.FullName === districtFullname);
  return district ? district.Ward : [];
};
const LocationSelect = ({ device }) => {
  const dispatch = useDispatch();
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Xử lý khi chọn tỉnh
  const handleProvinceChange = (provinceFullname) => {
    if (device === "vms") dispatch(updateProvincesVms(provinceFullname));
    if (device === "cam") dispatch(updateProvincesCam(provinceFullname));

    setSelectedProvince(provinceFullname);
    setDistricts(getDistricts(provinceFullname)); // Cập nhật Quận/Huyện theo tỉnh
    setSelectedDistrict(null); // Reset quận/huyện khi thay đổi tỉnh
    setWards([]); // Reset phường/xã
  };

  // Xử lý khi chọn quận/huyện
  const handleDistrictChange = (districtFullname) => {
    if (device === "vms") dispatch(updateDistrictVms(districtFullname));
    if (device === "cam") dispatch(updateDistrictCam(districtFullname));

    setSelectedDistrict(districtFullname);
    setWards(getWards(selectedProvince, districtFullname)); // Cập nhật Phường/Xã theo quận/huyện
  };

  const handleWardChange = (wardFullname) => {
    if (device === "vms") dispatch(updateWardVms(wardFullname));
    if (device === "cam") dispatch(updateWardCam(wardFullname));
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Select Tỉnh */}
      <Form.Item
        label="Tỉnh/Thành phố :"
        name="provinces"
        rules={[
          {
            required: true,
            message: "Tỉnh/Thành phố không được bỏ trống",
          },
        ]}
      >
        <Select
          showSearch
          placeholder="Chọn Tỉnh/Thành phố"
          onChange={handleProvinceChange}
        >
          {data.map((province) => (
            <Option key={province.Code} value={province.FullName}>
              {province.FullName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {/* Select Quận/Huyện */}
      <Form.Item
        label="Quận/Huyện :"
        name="district"
        rules={[
          {
            required: true,
            message: "Quận/Huyện không được bỏ trống",
          },
        ]}
      >
        <Select
          showSearch
          placeholder="Chọn Quận/Huyện"
          onChange={handleDistrictChange}
          disabled={!selectedProvince}
        >
          {districts.map((district) => (
            <Option key={district.Code} value={district.FullName}>
              {district.FullName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {/* Select Phường/Xã */}
      <Form.Item
        label="Phường/Xã :"
        name="ward"
        rules={[
          {
            required: true,
            message: "Phường/Xã không được bỏ trống",
          },
        ]}
      >
        <Select
          showSearch
          placeholder="Chọn Phường/Xã"
          onChange={handleWardChange}
          disabled={!selectedDistrict}
        >
          {wards.map((ward) => (
            <Option key={ward.Code} value={ward.FullName}>
              {ward.FullName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
};

export default LocationSelect;
