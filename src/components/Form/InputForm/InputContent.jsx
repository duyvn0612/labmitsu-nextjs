import React from "react";
import { Form, Input } from "antd";
export default function InputContent({
  label,
  name,
  ruleRequired = true,
  place,
  disabled = false,
  value = null,
  onChange,
  rules = {},
}) {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[
        { ...rules },
        {
          required: ruleRequired,
          message: "Không được bỏ trống ô này",
        },
      ]}
    >
      <Input
        disabled={disabled}
        placeholder={place}
        value={value}
        onChange={onChange}
      />
    </Form.Item>
  );
}
