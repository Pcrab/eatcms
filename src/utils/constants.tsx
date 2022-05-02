const remoteBaseUrl = "http://127.0.0.1/";

const CONSTANTS = {
  loginUrl: remoteBaseUrl + "",
  resetPwdUrl: remoteBaseUrl + "",
  createUserUrl: remoteBaseUrl + "",

  testing: true,
  testingLogin: false,
  testingAdmin: false,

  copyRight: "TEST COPYRIGHT 2022",

  loginRoute: "/login",
  mainRoute: "/main",
};

export const testUsers = (number: number) => {
  const users = [];
  for (let i = 0; i < number; i++) {
    users.push({
      id: i.toString(),
      nickName: "test" + i,
    });
  }
  return users;
};

export default CONSTANTS;