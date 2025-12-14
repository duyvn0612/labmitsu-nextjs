"use client";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Form, Switch, Button, message } from "antd";
import InputContent from "@/components/Form/InputForm/InputContent";
import DatePickerForm from "@/components/Form/DatePicker/DatePickerForm";
import SelectForm from "@/components/Form/Select/SelectForm";
import LocationSelect from "@/components/Form/LocationSelect/LocationSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  updateLocationVms,
  updateNameVms,
  updateRouteVms,
  updateTitleVms1,
  updateTitleVms2,
  updateTitleVms3,
  updateModeVms,
} from "@/redux/slice/formVmsSlice";
import { regexLatLng } from "@/lib/DataForm";
import { v4 as uuid } from "uuid";
import { addVms } from "@/redux/middlewares/apiVmsSlice";
export default function FormAddVms() {
  const dispatch = useDispatch();
  const formVmsData = useSelector((state) => state.formVmsData);
  const { locationVms, modeVms } = formVmsData;
  const [form] = Form.useForm();
  // console.log(locationVms);

  useEffect(() => {
    form.setFieldsValue({
      locationVms: `${locationVms.lat}, ${locationVms.lng}`,
      modeVms: modeVms,
    });
  }, [locationVms]);

  const onFinish = async (values) => {
    values.id = uuid();
    values.locationVms = locationVms;
    if (!modeVms) {
      const { scheduleVms } = values;
      const formattedRange = scheduleVms.map((date) =>
        dayjs(date).format("HH:mm:ss DD/MM/YYYY")
      );
      values.scheduleVms = {
        timeStart: formattedRange[0],
        timeEnd: formattedRange[1],
      };
    }
    console.log(values);
    try {
      const res = await dispatch(addVms(values));
      message.success(res.payload.message);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <div className="grid grid-cols-2 grid-rows-6 gap-2">
          <div>
            <InputContent
              label={"Tên bảng điện tử :"}
              name={"nameVms"}
              place={"Nhập tên bảng điện tử"}
              onChange={(e) => {
                dispatch(updateNameVms(e.target.value));
              }}
            />
          </div>
          <div className="col-start-1 row-start-2">
            <InputContent
              label={"Nội dung 1 :"}
              name={"titleVms1"}
              place={"Nhập nội dung 1"}
              ruleRequired={!modeVms}
              disabled={modeVms}
              onChange={(e) => dispatch(updateTitleVms1(e.target.value))}
            />
          </div>
          <div className="col-start-1 row-start-3">
            <InputContent
              label={"Nội dung 2 :"}
              name={"titleVms2"}
              place={"Nhập nội dung 2"}
              ruleRequired={!modeVms}
              disabled={modeVms}
              onChange={(e) => dispatch(updateTitleVms2(e.target.value))}
            />
          </div>
          <div className="col-start-1 row-start-4">
            <InputContent
              label={"Nội dung 3 :"}
              name={"titleVms3"}
              place={"Nhập nội dung 3"}
              ruleRequired={!modeVms}
              disabled={modeVms}
              onChange={(e) => dispatch(updateTitleVms3(e.target.value))}
            />
          </div>
          <div>
            <InputContent
              label={"Vị trí bảng điện tử :"}
              name={"nameVms"}
              place={"Nhập Vị trí bảng điện tử"}
            />
          </div>
          {/* <div className="col-start-1 row-start-5">
            <InputContent
              label={"Tọa độ biển VMS :"}
              name={"locationVms"}
              place={"Nhập vào tọa độ"}
              value={locationVms}
              rules={{
                pattern: regexLatLng,
                message: "Tọa độ không đúng định dạng lat, lng",
              }}
              onChange={(e) => {
                if (regexLatLng.test(e.target.value)) {
                  const arr = e.target.value.replace(" ", "").split(",");
                  dispatch(updateLocationVms({ lat: arr[0], lng: arr[1] }));
                }
              }}
            />
          </div>
          <div className="col-start-1 row-start-6">
            <InputContent
              label={"Tuyến đường :"}
              name={"routeVms"}
              place={"Nhập vào tuyến đường"}
              ruleRequired={false}
              onChange={(e) => dispatch(updateRouteVms(e.target.value))}
            />
          </div> */}
          <div className="col-start-2 row-start-1">
            <Form.Item
              className="flex justify-center items-center"
              label="Chế độ :"
              name="modeVms"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Auto"
                unCheckedChildren="Normal"
                onChange={() => {
                  // setModeAMVms(!modeVms);
                  dispatch(updateModeVms(!modeVms));
                }}
              />
            </Form.Item>
          </div>
          <div className="col-start-2 row-start-2">
            <DatePickerForm
              label={"Lịch chạy :"}
              name={"scheduleVms"}
              ruleRequires={!modeVms}
              disabled={modeVms}
            />
          </div>
          {/* <div className="row-span-3 col-start-2 row-start-3">
            <LocationSelect device={"vms"} />
          </div> */}
          {/* <div className="row-start-6">
            <SelectForm label="Camera :" name="camVms" ruleRequired={false} />
          </div> */}
          <div>
            <Form.Item className="flex justify-end">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </>
  );
}
