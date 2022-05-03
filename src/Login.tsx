import {Button, Form, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import React, {useContext, useEffect, useState} from "react";
import CONSTANTS from "./utils/constants";
import {UserContext, UserType} from "./App";
import axios from "axios";

export enum LoginType {
  Login = 0,
  ResetPWD,
}

interface loginProps {
  type: LoginType,
}

function Login(loginProps: loginProps) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const User = useContext(UserContext);
  const [errMsg, setErrMsg] = useState("");
  const [type, setType] = useState(loginProps.type);
  const [content, setContent] = useState({
    content: (<></>),
    url: "",
    title: "",
  });

  useEffect(() => {
    setContent(buildFormContent(type));
  }, [type]);

  function changeType(type: LoginType) {
    setErrMsg("");
    setUserName("");
    setPassword("");
    setType(type);
  }

  function buildFormContent(type: LoginType) {
    let title = "";
    const divClassName = "text-right text-blue-900 font-bold cursor-pointer";
    const content: JSX.Element[] = [];
    let text = "";
    let url = "";
    if (type === LoginType.Login) {
      title = "登录账户";
      content.push(
        <div className={divClassName} key="resetPWD" onClick={() => changeType(LoginType.ResetPWD)}>
          忘记密码？
        </div>);
      text = "登录";
      url += CONSTANTS.loginUrl;
    } else if (type === LoginType.ResetPWD) {
      title = "重置密码";
      content.push(<div className={divClassName} key="returnLogin"
        onClick={() => changeType(LoginType.Login)}>返回登陆</div>);
      text = "重置";
      url += CONSTANTS.resetPwdUrl;
    }

    const btnClassName = "text-blue-900 font-bold login-form-button w-full bg-blue-200";
    content.push(<Form.Item key="btn" className="mt-4">
      <Button className={btnClassName} type="primary" htmlType="submit">{text}
      </Button>
    </Form.Item>);

    return {
      title: title,
      content: <>
        {content}
      </>,
      url: url,
    };
  }

  function handleSubmit() {
    setErrMsg("");
    if (!userName || !password) {
      return;
    }

    if (type === LoginType.Login) {
      axios.post(CONSTANTS.loginUrl, {
        userName: userName,
        password: password,
      }).then((res) => {
        if (res.data.code === 0) {
          console.log(res.data.token);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userName", userName);
          localStorage.setItem("role", JSON.stringify(res.data.role));
          if (res.data.role.indexOf("admin") === -1) {
            User.setUser({
              userName: userName,
              type: UserType.Reviewer,
            });
          } else {
            User.setUser({
              userName: userName,
              type: UserType.Admin,
            });
          }
        } else {
          setErrMsg(res.data.mess);
        }
      }).catch((err) => {
        setErrMsg(err.message);
      });
    } else if (type === LoginType.ResetPWD) {
      setType(LoginType.Login);
    }
  }

  return <div className="flex flex-col mt-24 mx-auto w-96 items-center justify-center">
    <h1 className="text-center font-bold text-3xl mb-10">{content.title}</h1>
    <Form
      name={"login"}
      className={"login-form"}
      initialValues={{remember: true}}
      onSubmitCapture={() => handleSubmit()}
      encType={"application/json"}
    >
      <Form.Item
        name="username"
        rules={[{required: true, message: "请输入用户名！"}]}
      >
        <Input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          prefix={<UserOutlined className="site-form-item-icon"/>}
          placeholder="用户名"/>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{required: true, message: "请输入密码！"}]}
      >
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          prefix={<LockOutlined className="site-form-item-icon"/>}
          placeholder="密码"/>
      </Form.Item>
      {content.content}
    </Form>
    <div className="text-center text-red-700 text-lg font-bold text-center">{errMsg}</div>
  </div>;

}

export default Login;
