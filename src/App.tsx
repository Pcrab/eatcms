import React, {useEffect, useState} from "react";
import CONSTANTS from "./utils/constants";
import {useNavigate, useRoutes} from "react-router-dom";
import {indexRoute} from "./route";

export enum UserType {
  Admin = "admin",
  Reviewer = "reviewer",
}

export interface user {
  userName: string;
  type: UserType;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const UserContext = React.createContext<{ user: user | null, setUser: (_: user | null) => void }>(
  {
    user: {userName: "", type: UserType.Reviewer},
    setUser: () => {
      return;
    }
  }
);

function useUser() {
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState<user | null>(null);
  const navigate = useNavigate();

  // 判断是否已经登录，并根据结果设置 user
  async function checkLoginStatus() {
    if (CONSTANTS.testing) {
      if (CONSTANTS.testingLogin) {
        return;
      }
      if (CONSTANTS.testingAdmin) {
        setUser({userName: "测试超管", type: UserType.Admin});
      } else {
        setUser({userName: "测试审核", type: UserType.Reviewer});
      }
    } else {
      const userName = localStorage.getItem("userName");
      const roles = localStorage.getItem("role");
      const token = localStorage.getItem("token");
      if (!userName || !roles || !token) {
        setUser(null);
      } else {
        if (roles.indexOf("admin") !== -1) {
          setUser({userName, type: UserType.Admin});
        } else if (roles.indexOf("reviewer") !== -1) {
          setUser({userName, type: UserType.Reviewer});
        } else {
          setUser(null);
        }
      }
    }
  }

  useEffect(() => {
    const checkLogin = async () => {
      await checkLoginStatus();
    };
    checkLogin().then(() => {
      setChecked(true);
    });
  }, []);

  useEffect(() => {
    if (checked) {
      if (user) {
        console.log("welcome.");
        navigate("/main", {state: {type: user.type}});
      } else {
        console.log("please login.");
        navigate("/login");
      }
    }
  }, [user, checked]);

  return {
    SetUserContext: UserContext,
    user,
    setUser,
  };
}

function App() {
  const {SetUserContext, user, setUser} = useUser();
  const route = useRoutes(indexRoute());

  return (
    <div className="App h-full">
      <SetUserContext.Provider value={{user: user, setUser: setUser}}>
        {route}
      </SetUserContext.Provider>
    </div>
  );
}

export default App;
