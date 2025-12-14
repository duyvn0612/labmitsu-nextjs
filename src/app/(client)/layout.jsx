"use client";
import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Dropdown, Avatar } from "antd";
import { menuAntItems, AdminItems } from "@/lib/MenuItems";
import { Image } from "antd";

const { Header, Sider, Content, Footer } = Layout;

const LayoutClient = React.memo(({ children }) => {
  const [collapsed, setCollapsed] = useState(true);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ height: "100vh", overflow: "auto" }}
      >
        <Menu
          triggerSubMenuAction="click"
          theme="light"
          mode="vertical"
          inlineIndent={12}
          defaultSelectedKeys={["1"]}
          items={menuAntItems}
          style={{ height: "100%" }}
        />
      </Sider>

      <Layout style={{ height: "100vh" }}>
        <Header
          style={{
            height: 50,
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 14,
              width: 50,
              height: 50,
            }}
          />
          <div className="grow flex justify-around items-center">
            <Image
              preview={false}
              width={50}
              height={50}
              src="/images/LogoUTC.jpg"
              alt="tctlogo"
            />

            <h1 className="text-2xl uppercase text-cyan-700 font-semibold">
              hệ thống giám sát bảng điện tử
            </h1>
            <Dropdown menu={{ items: AdminItems }} trigger={["click"]}>
              <Avatar
                className="cursor-pointer"
                size="large"
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 8,
            background: "#f0f2f5",
          }}
        >
          {children}
        </Content>

        <Footer
          style={{
            paddingBlock: 10,
            textAlign: "center",
            background: "#fff",
            height: 50,
            flexShrink: 0,
          }}
        >
          TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI
        </Footer>
      </Layout>
    </Layout>
  );
});

LayoutClient.displayName = "LayoutClient";
export default LayoutClient;
