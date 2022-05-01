import React, {useEffect, useState} from "react";
import Main from "./Main";
import Login, {LoginType} from "./Login";
import CONSTANTS from "./utils/constants";

export enum UserType {
  Admin = "admin",
  Reviewer = "reviewer",
}

export interface user {
  userName: string;
  type: UserType;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const UserContext = React.createContext<{user: user | null, setUser: (_: user | null) => void }>(
  {
    user: {userName: "", type: UserType.Reviewer},
    setUser: () => {
      return;
    }
  }
);

function useUser() {
  const [page, setPage] = useState(<></>);
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState<user | null>(null);

  // 判断是否已经登录，并根据结果设置 isLogin
  async function checkLoginStatus() {
    if (CONSTANTS.testing) {
      if (CONSTANTS.testingLogin) {
        return;
      }
      if (CONSTANTS.testingAdmin) {
        setUser({userName: "测试超管", type: UserType.Admin});
      }
      setUser({userName: "测试审核", type: UserType.Reviewer});
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
        setPage(<Main user={user}/>);
      } else {
        console.log("please login.");
        setPage(<Login type={LoginType.Login}/>);
      }
    }
  }, [user, checked]);

  return {
    SetUserContext: UserContext,
    user,
    setUser,
    page,
  };
}

function App() {
  const {SetUserContext, user, setUser, page} = useUser();
  return (
    <div className="App h-full">
      <SetUserContext.Provider value={{user: user, setUser: setUser}}>
        {page}
      </SetUserContext.Provider>
    </div>
  );
}

export default App;
