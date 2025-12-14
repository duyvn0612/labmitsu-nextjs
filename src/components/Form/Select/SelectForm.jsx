import React from "react";
import { Form, message, Select } from "antd";
export default function SelectForm({
  label,
  name,
  ruleRequired = true,
  dataOpts = [],
}) {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: ruleRequired, message: "Không được bỏ trống ô này" }]}
    >
      <Select
        showSearch
        placeholder="Search to Select"
        optionFilterProp="label"
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
        options={dataOpts}
      />
    </Form.Item>
  );
}
