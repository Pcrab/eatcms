import React, {useState} from "react";
import {Layout, Menu, MenuProps} from "antd";

import Header from "./partials/Header";
import Footer from "./partials/Footer";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {items} from "./route";
import {UserType} from "./App";

const {Content, Sider} = Layout;

type MenuItem = Required<MenuProps>["items"][number];

export interface LocationState {
  type?: UserType;
}

function Main() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  const mainItems = state.type === UserType.Admin ? items : items.slice(1);
  const menuItems: MenuItem[] = [];
  mainItems.forEach(item => {
    menuItems.push(getItem(item.label, item.key, item.icon, item.children));
  });

  function onCollapse(collapsed: boolean) {
    console.log(collapsed);
    setCollapsed(collapsed);
  }

  return <>
    <Layout className="min-h-full">
      <Sider collapsible collapsed={collapsed} onCollapse={(collapsed) => onCollapse(collapsed)}>
        <div className="h-8 m-4 bg-gray-500"></div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={menuItems} onClick={(e) => {
          console.log(e.key);
          navigate(`${e.key}`, {state: {type: state.type}});
        }
        }></Menu>
      </Sider>
      <Layout>
        <Header/>
        <Content className="mx-4 my-0">
          <Outlet/>
        </Content>
        <Footer/>
      </Layout>
    </Layout>
  </>;
}

export default Main;