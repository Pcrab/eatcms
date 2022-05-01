import React, {useState} from "react";
import {Layout, Menu, MenuProps} from "antd";
import CONSTANTS from './utils/constants';

import Admin from './main/Admin';
import Review from './main/Review'

import {ReactComponent as UserManageSvg} from './icons/userManage.svg';
import {ReactComponent as AdminSvg} from "./icons/admin.svg";
import {ReactComponent as ReviewSvg} from "./icons/review.svg";

const {Header, Content, Footer, Sider} = Layout;

type MenuItem = Required<MenuProps>['items'][number];

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
    label: '超级管理员',
    key: 'admin',
    icon: <AdminSvg className={iconClass}/>,
    content: <Admin/>,
  },
  {
    label: '审核',
    key: 'review',
    icon: <ReviewSvg className={iconClass}/>,
    content: <Review/>,
  },
  {
    label: '用户管理',
    key: 'userManage',
    icon: <UserManageSvg className={iconClass}/>,
    children: [
      {
        label: 'test',
        key: 'test',
      }
    ],
  },
]
const menuItems: MenuItem[] = [];
items.forEach(item => {
  menuItems.push(getItem(item.label, item.key, item.icon, item.children))
});

function Main() {
  const [collapsed, setCollapsed] = useState(false);
  const [pageContent, setPageContent] = useState(<></>);

  function onCollapse(collapsed: boolean) {
    console.log(collapsed)
    setCollapsed(collapsed);
  }

  function selectKey(key: string) {
    console.log(key)
    function checkKey(item: item, key: string) {
      if (item.key === key) {
        setPageContent(<>{item.content}</>)
        return true;
      }
      item.children?.forEach(child => {
        checkKey(child, key)
      })
    }
    items.forEach(item => {
      checkKey(item, key)
    })
  }

  return <>
    <Layout className="min-h-full">
      <Sider collapsible collapsed={collapsed} onCollapse={(collapsed) => onCollapse(collapsed)}>
        <div className="h-8 m-4 bg-gray-500"></div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={menuItems}
              onSelect={(key) => selectKey(key.key)}></Menu>
      </Sider>
      <Layout>
        <Header className="h-8 m-4 p-0 bg-white"></Header>
        <Content className="mx-4 my-0">
          {pageContent}
        </Content>
        <Footer className="text-center">{CONSTANTS.copyRight}</Footer>
      </Layout>
    </Layout>
  </>
}

export default Main