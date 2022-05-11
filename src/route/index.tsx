import React from "react";
import {ReactComponent as ReviewSvg} from "../icons/review.svg";
import Review from "../main/Review";
import {ReactComponent as UserManageSvg} from "../icons/userManage.svg";
import UserList from "../main/UserManage/UserList";
import {ReactComponent as PageManageSvg} from "../icons/pageManage.svg";
import Login, {LoginType} from "../Login";
import Main from "../Main";
import {RouteObject} from "react-router-dom";
import Manage from "../main/PageManage/manage";

const iconClass = "h-5 w-6";

const defaultContent = <div className="flex flex-col w-full h-full items-center justify-center">
  <div className="text-center text-2xl font-bold">请选择一项操作。</div>
</div>;

interface PageObject {
  label: string,
  key: string,
  icon?: React.ReactNode,
  children?: PageObject[],
  content?: React.ReactNode,
}

export const items: PageObject[] = [
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
        content: <UserList/>,
      },
    ],
  },
  {
    label: "页面管理",
    key: "pageManage",
    icon: <PageManageSvg className={iconClass}/>,
    children: [
      {
        label: "城市详情",
        key: "city",
        content: <Manage type={"city"}/>,
      },
      {
        label: "景点详情",
        key: "scenenic",
        content: <Manage type={"scenenic"}/>,
      },
      {
        label: "美食详情",
        key: "food",
        content: <Manage type={"food"}/>,
      },
    ],
  }
];

function mainRoute(): RouteObject[] {
  const routeItems: RouteObject[] = [];
  items.forEach(item => {
    function addContent(item: PageObject ) {
      if (item.content) {
        routeItems.push({
          path: item.key,
          element: item.content,
        });
      }
      if (item.children) {
        item.children.forEach(child => addContent(child));
      }
    }

    addContent(item);
  });
  return routeItems;
}


export function indexRoute(): RouteObject[] {
  const mainChildren = mainRoute();
  mainChildren.push({
    path: "",
    element: defaultContent,
  });
  return  [
    {
      path: "/Login",
      element: <Login type={LoginType.Login}/>,
    },
    {
      path: "/Main",
      element: <Main/>,
      children: mainChildren,
    },
    {
      path: "/",
      element: <></>,
    }
  ];
}