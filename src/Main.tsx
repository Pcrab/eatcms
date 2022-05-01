import React, {useState} from "react";
import {Layout, Menu, MenuProps} from "antd";

import {user, UserType} from "./App";
import Admin from "./main/Admin";
import Review from "./main/Review";
import Header from "./partials/Header";

import {ReactComponent as UserManageSvg} from "./icons/userManage.svg";
import {ReactComponent as AdminSvg} from "./icons/admin.svg";
import {ReactComponent as ReviewSvg} from "./icons/review.svg";
import Footer from "./partials/Footer";

const {Content, Sider} = Layout;

type MenuItem = Required<MenuProps>["items"][number];

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
    key: "admin",
    icon: <AdminSvg className={iconClass}/>,
    content: <Admin/>,
  },
  {
    label: "审核",
    key: "review",
    icon: <ReviewSvg className={iconClass}/>,
    content: <Review/>,
  },
  {
    label: "用户管理",
    key: "userManage",
    icon: <UserManageSvg className={iconClass}/>,
    children: [
      {
        label: "用户列表",
        key: "userList",
      }
    ],
  },
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
  const [pageContent, setPageContent] = useState(defaultContent);

  const mainItems = mainProps.user.type === UserType.Admin ? items : items.slice(1);
  const menuItems: MenuItem[] = [];
  mainItems.forEach(item => {
    menuItems.push(getItem(item.label, item.key, item.icon, item.children));
  });


  function onCollapse(collapsed: boolean) {
    console.log(collapsed);
    setCollapsed(collapsed);
  }

  function selectKey(key: string) {
    console.log(key);
    function checkKey(item: item, key: string) {
      if (item.key === key) {
        setPageContent(<>{item.content}</>);
        return true;
      }
      item.children?.forEach(child => {
        checkKey(child, key);
      });
      return false;
    }

    mainItems.forEach(item => {
      if (checkKey(item, key)) {
        return;
      }
    });
  }

  return <>
    <Layout className="min-h-full">
      <Sider collapsible collapsed={collapsed} onCollapse={(collapsed) => onCollapse(collapsed)}>
        <div className="h-8 m-4 bg-gray-500"></div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={menuItems}
          onSelect={(key) => selectKey(key.key)}></Menu>
      </Sider>
      <Layout>
        <Header/>
        <Content className="mx-4 my-0">
          {pageContent}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  </>;
}

export default Main;