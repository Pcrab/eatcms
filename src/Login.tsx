import {Form, Input, Button} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import React, {useContext, useEffect, useState} from "react";
import CONSTANTS from "./utils/constants";
import {SetUserContext, user} from "./App";

export enum LoginType {
  Login = 0,
  ResetPWD,
  CreateUser,
}

interface loginProps {
  type: LoginType,
}

function Login(loginProps: loginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useContext(SetUserContext);
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
    setUsername("");
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
    } else if (type === LoginType.CreateUser) {
      title = "创建用户";
      text = "创建";
      url += CONSTANTS.createUserUrl;
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
    if (!username || !password) {
      return;
    }
    setErrMsg("error!");
    fetch(content.url, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          if (type === LoginType.Login) {
            setUser(data as user);
          } else if (type === LoginType.ResetPWD) {
            setType(LoginType.Login);
          }
        });
      } else {
        response.text().then((data) => {
          setErrMsg(data);
        });
      }
    });
    return;
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
