import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@apollo/client";
import { ADD_COMPANY } from "../../graphql/mutation";
import { UploadOutlined } from "@ant-design/icons";
import { Divider, Form, Input, Button, Select, Upload, message } from "antd";
// === json data ===
import Cities from "../../data/cities.json";

const { Option } = Select;

function addcompany() {
  const API = process.env.API_URL1;
  const [form] = Form.useForm();

  const [state, setState] = useState({
    imageUrl: null,
    loading: false,
  });
  // === add company ===
  const [addCom] = useMutation(ADD_COMPANY);

  // ====== file management =======
  function beforeUpload(file) {
    const isPng = file.type === "image/png";
    if (!isPng) {
      message.error("You can only upload PNG file!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isPng && isLt2M;
  }
  const handleChange = async (info) => {
    if (info.file.status === "uploading") {
      setState({ ...state, loading: true });
      return;
    }
    // === delete old upload from server when upload new photo ===
    if (state.imageUrl) {
      await axios
        .delete(API + "/image/delete/" + state.imageUrl)
        .catch((err) => console.log(err));
    }
    if (info.file.status === "done") {
      // Get this imgurl from response in real world.
      setState({
        imageUrl: info.file.response,
        loading: false,
      });
      // console.log(info.file);
    }
  };

  // ====== upload dragger props ======
  const upload = {
    action: API + "/upload/image",
    name: "image",
    maxCount: 1,
    beforeUpload: beforeUpload,
    onChange: handleChange,
    onRemove: async (data) => {
      // console.log(data.response);
      await axios
        .delete(API + "/image/delete/" + data.response)
        .catch((err) => console.log(err));

      setState({
        imageUrl: null,
        loading: false,
      });
    },
  };

  // === add new company ===
  const onFinish = (values) => {
    const { website } = values;
    const newCom = {
      ...values,
      website: website ? website : "N/A",
      logo: state.imageUrl,
    };
    // console.log(newCom);
    addCom({
      variables: newCom,
    }).then(async (res) => {
      await setState({ loading: true });
      await setState({ loading: false });
      await form.resetFields();
      await message.success(res.data.add_company.message);
    });
  };
  return (
    <div className="opp-container">
      <Divider orientation="left">Add Company</Divider>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Company Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your company name",
            },
          ]}
        >
          <Input placeholder="Input company's name..." />
        </Form.Item>
        <Form.Item
          label="City"
          name="city"
          rules={[
            {
              required: true,
              message: "Please select a city!",
            },
          ]}
        >
          <Select showSearch placeholder="Select city...">
            {Cities.map((res, i) => (
              <Option key={i} value={res}>
                {res.toUpperCase()}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Website (Optional)" name="website">
          <Input placeholder="Input website..." />
        </Form.Item>
        <Form.Item
          label="Recruiter Position"
          name="user_position"
          rules={[
            {
              required: true,
              message: "Please input your position",
            },
          ]}
        >
          <Input placeholder="Your position..." />
        </Form.Item>
        <Form.Item
          label="About Company"
          name="about"
          rules={[
            {
              required: true,
              message: "Please input your company name",
            },
          ]}
        >
          <Input.TextArea
            placeholde="Input about..."
            maxLength="300"
            showCount
          />
        </Form.Item>
        <Form.Item
          name="logo"
          valuePropName="file"
          rules={[
            {
              required: true,
              message: "Please input logo!",
            },
          ]}
        >
          <Upload {...upload} name="image">
            <Button className="upload-logo-btn" icon={<UploadOutlined />}>
              Upload Company Logo
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            loading={state.loading ? true : false}
            htmlType="submit"
          >
            Add Company
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default addcompany;
