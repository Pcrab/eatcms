import React, {useState} from "react";
import {Layout, Menu, MenuProps} from "antd";

import {user, UserType} from "./App";
import Admin from "./main/Admin";
import Review from "./main/Review";
import Header from "./partials/Header";

import {ReactComponent as AdminSvg} from "./icons/admin.svg";
import {ReactComponent as ReviewSvg} from "./icons/review.svg";
import {ReactComponent as UserManageSvg} from "./icons/userManage.svg";
import {ReactComponent as PageManageSvg} from "./icons/pageManage.svg";
import Footer from "./partials/Footer";
import {Route, Routes, useNavigate} from "react-router-dom";
import SpotDetail from "./main/PageManage/SpotDetail";
import UserList from "./main/UserManage/UserList";

const {Content, Sider} = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const iconClass = "h-5 w-6";

interface item {
  label: string,
  key: string,
  icon?: React.ReactNode,
  children?: item[],
  content?: React.ReactNode,
}

const items: item[] = [
  {
    label: "超级管理员",
    key: "Admin",
    icon: <AdminSvg className={iconClass}/>,
    content: <Admin/>,
  },
  {
    label: "审核",
    key: "Review",
    icon: <ReviewSvg className={iconClass}/>,
    content: <Review/>,
  },
  {
    label: "用户管理",
    key: "UserManage",
    icon: <UserManageSvg className={iconClass}/>,
    children: [
      {
        label: "用户列表",
        key: "UserList",
        content: <UserList/>,
      }
    ],
  },
  {
    label: "页面管理",
    key: "PageManage",
    icon: <PageManageSvg className={iconClass}/>,
    children: [
      {
        label: "景点详情页配置",
        key: "SpotDetail",
        content: <SpotDetail/>,
      }
    ],
  }
];

const defaultContent = <div className="flex flex-col w-full h-full items-center justify-center">
  <div className="text-center text-2xl font-bold">请选择一项操作。</div>
</div>;

interface mainProps {
  user: user,
  children?: React.ReactNode,
}

function Main(mainProps: mainProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

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

  const mainItems = mainProps.user.type === UserType.Admin ? items : items.slice(1);
  const menuItems: MenuItem[] = [];
  mainItems.forEach(item => {
    menuItems.push(getItem(item.label, item.key, item.icon, item.children));
  });
  const routeItems: React.ReactNode[] = [];
  mainItems.forEach(item => {
    function addContent(item: item) {
      if (item.content) {
        routeItems.push(<Route key={item.key} path={`/${item.key}`} element={item.content}></Route>);
      }
      if (item.children) {
        item.children.forEach(child => addContent(child));
      }
    }

    addContent(item);
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
          navigate(`/${e.key}`);
        }
        }></Menu>
      </Sider>
      <Layout>
        <Header/>
        <Content className="mx-4 my-0">
          <Routes>
            <Route path="/" element={defaultContent}/>
            {routeItems}
          </Routes>
        </Content>
        <Footer/>
      </Layout>
    </Layout>
  </>;
}

export default Main;