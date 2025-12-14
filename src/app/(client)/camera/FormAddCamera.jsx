"use client";
import React, { useEffect } from "react";
import { Form, Radio, Checkbox, Button, message } from "antd";
import InputContent from "@/components/Form/InputForm/InputContent";
import SelectForm from "@/components/Form/Select/SelectForm";
import LocationSelect from "@/components/Form/LocationSelect/LocationSelect";
import { regexLatLng } from "@/lib/DataForm";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import {
  updateFeatureCam,
  updateLocationCam,
  updateNameCam,
  updateTypeCam,
} from "@/redux/slice/formCamSlice";
import { addCamera } from "@/redux/middlewares/apiCamSlice";
export default function FormAddCamera() {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { nameCam, locationCam, typeCam, featureCam, angleCam } = useSelector(
    (state) => state.formCamData
  );

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      nameCam: nameCam,
      locationCam: `${locationCam.lat}, ${locationCam.lng}`,
      typeCam: typeCam,
      featureCam: featureCam,
    });
  }, [locationCam]);
  const onFinish = async (values) => {
    values.id = uuid();
    values.angleCam = angleCam;
    values.locationCam = locationCam;
    console.log(values);
    try {
      const res = await dispatch(addCamera(values));
      messageApi.open({
        type: "success",
        content: res.payload.message,
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-2 grid-rows-6 gap-2">
          <div>
            <InputContent
              label={"Tên Camera :"}
              name={"nameCam"}
              place={"Nhập vào tên Camera"}
              onChange={(e) => dispatch(updateNameCam(e.target.value))}
            />
          </div>
          <div className="col-start-1 row-start-2">
            <SelectForm
              label={"Phân loại Camera :"}
              name={"classCam"}
              dataOpts={[{ value: "Giao thông", label: "Giao thông" }]}
            />
          </div>
          <div className="row-span-3 col-start-1 row-start-3">
            <LocationSelect device={"cam"} />
          </div>
          <div className="col-start-1 row-start-6">
            <InputContent
              label={"RTSP :"}
              name={"rtspCam"}
              place={"Nhập vào link RTSP"}
            />
          </div>
          <div className="col-start-2 row-start-1">
            <Form.Item label={"Loại Camera"} name={"typeCam"}>
              <Radio.Group
                block
                onChange={(e) => {
                  dispatch(updateTypeCam(e.target.value));
                }}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio value="camFixed"> Cố định </Radio>
                <Radio value="camDome"> Quay quét </Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <div className="col-start-2 row-start-2">
            <Form.Item label="Tính năng :" name={"featureCam"}>
              <Checkbox.Group
                onChange={(values) => {
                  dispatch(updateFeatureCam(values));
                }}
                options={["Ghi hình", "Camera AI", "Hoạt động"]}
              ></Checkbox.Group>
            </Form.Item>
          </div>
          <div className="col-start-2 row-start-3">
            <InputContent
              label={"URL LAN :"}
              ruleRequired={false}
              place={"URL LAN"}
              name={"urlLanCam"}
            />
          </div>
          <div className="col-start-2 row-start-4">
            <InputContent
              label={"Tuyến đường :"}
              ruleRequired={false}
              place={"Nhập vào tuyến đường"}
              name={"routeCam"}
            />
          </div>
          <div className="col-start-2 row-start-5">
            <InputContent
              label={"Tọa độ Camera :"}
              place={"Nhập vào tọa độ Camera"}
              name={"locationCam"}
              value={locationCam}
              rules={{
                pattern: regexLatLng,
                message: "Tọa độ không đúng định dạng lat, lng",
              }}
              onChange={(e) => {
                if (regexLatLng.test(e.target.value)) {
                  const arr = e.target.value.replace(" ", "").split(",");
                  dispatch(updateLocationCam({ lat: arr[0], lng: arr[1] }));
                }
              }}
            />
          </div>
          <div className="row-start-6"></div>
        </div>
        <Form.Item className="flex justify-end">
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
