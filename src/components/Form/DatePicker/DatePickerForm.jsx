import React from "react";
import { Form, DatePicker } from "antd";
import { useDispatch } from "react-redux";
import { updateScheduleVms } from "@/redux/slice/formVmsSlice";
const { RangePicker } = DatePicker;
export default function DatePickerForm({
  label,
  name,
  ruleRequires = true,
  disabled = false,
}) {
  const dispatch = useDispatch();
  const handleScheduleChange = (date, [schStart, schEnd]) => {
    dispatch(updateScheduleVms({ schStart, schEnd }));
  };
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: ruleRequires, message: "Không được bỏ trống ô này" }]}
    >
      <RangePicker
        format="DD/MM/YYYY HH:mm:ss"
        showTime
        disabled={disabled}
        onChange={handleScheduleChange}
        allowEmpty
      />
    </Form.Item>
  );
}
