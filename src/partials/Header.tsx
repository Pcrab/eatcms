import React, {useContext} from "react";

import {UserOutlined} from "@ant-design/icons";

import {UserContext} from "../App";

function Header() {
  const User = useContext(UserContext);
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    User.setUser(null);
  }
  return <>
    <div className="flex justify-end items-center mr-8 my-4 text-base">
      <div className="flex items-center">
        <UserOutlined className="mr-2" />
        <div>欢迎登陆：{User.user?.userName}</div>
      </div>
      <button className="ml-5 px-2 py-1 rounded-md bg-red-300 hover:bg-red-800 hover:text-white duration-200" onClick={() => logout()} >退出登录</button>
    </div>
  </>;
}

export default Header;