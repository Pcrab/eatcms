import {Table, Tag} from "antd";
import React, {useEffect} from "react";
import CONSTANTS from "../../utils/constants";
import Pagination from "../../partials/Pagination";
import Modal from "../../partials/Modal";
import axios from "axios";
import {UserType} from "../../App";

interface UserObject {
  _id: string;
  userName: string;
  role: string[];
  create_time?: string;
  isLegal?: boolean;
}

function UserList() {

  const [users, setUsers] = React.useState<UserObject[]>([]);
  const [user, setUser] = React.useState<UserObject | null>(null);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [selected, setSelected] = React.useState<UserObject[]>([]);

  const [visible, setVisible] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [text, setText] = React.useState("");
  const [action, setAction] = React.useState("");

  function onOk() {
    if (action === "resumeUser") {
      resumeUser(user);
    } else if (action === "resumeUsers") {
      resumeUsers();
    } else if (action === "blockUser") {
      blockUser(user);
    } else if (action === "blockUsers") {
      blockUsers();
    }
    setVisible(false);
  }

  useEffect(() => {
    refreshUser();
  }, [page, pageSize]);

  function refreshUser() {
    console.log(`refresh user at page ${page} with size ${pageSize}`);
    axios.get(CONSTANTS.allUserUrl + `/${page}/${pageSize}`, {

      headers: {
        "Authorization": `${localStorage.getItem("token")}`
      }
    }).then(res => {
      if (res.data.code === 0) {
        const users = res.data.data.map((user: any) => {
          return {
            id: user._id,
            userName: user.userName || user.nickName || "fakeUserName",
            ...user
          };
        });
        setTotal(res.data.total);
        setUsers(users);
      } else {
        console.log(res.data.mess);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  function handleChange(page: number, pageSize: number) {
    setPage(page);
    setPageSize(pageSize);
    console.log(page, pageSize);
  }

  function handleSelect(selectedRows: UserObject[]) {
    setSelected(selectedRows);
    console.log(selectedRows);
    return;
  }

  const pagination = <Pagination onChange={(page, pageSize) => {
    handleChange(page, pageSize);
  }} defaultPageSize={pageSize} total={total}/>;

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: UserObject[]) => {
      handleSelect(selectedRows);
    },
    getCheckboxProps: (record: UserObject) => {
      console.log(record);
      return {
        disabled: record.role.indexOf("admin") !== -1,
        name: record._id,
      };
    },
    selectedRowKeys: selected.map(user => user._id)
  };

  function showModal(title: string, text: string, action: string) {
    setTitle(title);
    setText(text);
    setAction(action);
    setVisible(true);
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "?????????",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "??????",
      dataIndex: "role",
      key: "role",
      render: (tags: string[]) => {
        if (tags.indexOf("admin") !== -1) {
          return <Tag color="volcano">??????</Tag>;
        } else {
          return <>
            {
              tags.map((tag: string) => {
                if (tag === "reviewer") {
                  return <Tag color="geekblue" key="reviewer">??????</Tag>;
                } else {
                  return <Tag color="green" key="user">??????</Tag>;
                }
              })
            }
          </>;
        }
      }
    },
    {
      title: "????????????",
      dataIndex: "create_time",
      key: "create_time",
    },
    {
      title: "??????",
      dataIndex: "isLegal",
      key: "isLegal",
      render: (isLegal: boolean) => {
        if (!isLegal) {
          return <Tag color="volcano">??????</Tag>;
        } else {
          return <Tag color="green">??????</Tag>;
        }
      }
    },
    {
      title: "??????",
      dataIndex: "action",
      key: "action",
      align: "center" as const,
      render: (text: string, record: UserObject) => {
        if (record.role.indexOf(UserType.Admin) === -1) {
          return <div className="flex justify-center">
            <div className="text-red-800 mr-4 font-bold cursor-pointer" onClick={() => {
              setUser(record);
              showModal("????????????", `?????????????????? ${record.userName} ??????`, "blockUser");
            }}>??????
            </div>
            <div className="text-green-800 font-bold cursor-pointer" onClick={() => {
              setUser(record);
              showModal("????????????", `?????????????????? ${record.userName} ??????`, "resumeUser");
            }}>??????
            </div>
          </div>;
        } else {
          return <></>;
        }
      }
    }
  ];

  async function setUserLegal(_id: string, isLegal: boolean) {
    await axios.post(CONSTANTS.setUserUrl, {
      _id,
      isLegal,
    }, {
      headers: {
        Authorization: localStorage.getItem("token")||"",
      }
    });
  }

  function resumeUser(user: UserObject | null) {
    if (user) {
      console.log(`user deleted: ${user._id}`);
      setUserLegal(user._id, true).then();
      refreshUser();
    } else {
      console.log("user not found");
    }
  }

  function resumeUsers() {
    console.log(`users deleted: ${selected.map(user => user._id)}`);
    selected.forEach((user) => {
      setUserLegal(user._id, true).then();
    });
    setSelected([]);
    refreshUser();
  }

  function blockUser(user: UserObject | null) {
    if (user) {
      console.log(`user blocked: ${user._id}`);
      setUserLegal(user._id, false).then();
      refreshUser();
    } else {
      console.log("user not found");
    }
  }

  function blockUsers() {
    console.log(`users blocked: ${selected.map(user => user._id)}`);
    selected.forEach((user) => {
      setUserLegal(user._id, false).then();
    });
    setSelected([]);
    refreshUser();
  }

  return <>
    <div className="flex flex-col w-full h-full">
      <Table
        className="mb-4"
        rowSelection={{
          type: "checkbox",
          ...rowSelection
        }}
        columns={columns}
        dataSource={users.map((user) => ({...user, key: user._id}))}
        pagination={false}
      />
      <div className="flex">
        {pagination}
        <div className="flex justify-end mb-4 flex-grow">
          <button disabled={selected.length === 0} className={"font-bold h-8 px-4 rounded-md mr-4 duration-200 " + (
            selected.length !== 0 ?
              "bg-blue-300 hover:bg-blue-800 hover:text-white" :
              "bg-gray-300 text-gray-500")
          } onClick={() => {
            showModal("??????????????????", "???????????????????????????????????????", "blockUsers");
          }}>????????????
          </button>
          <button disabled={selected.length === 0} className={"font-bold h-8 px-4 rounded-md mr-4 duration-200 " + (
            selected.length !== 0 ?
              "bg-red-300 hover:bg-red-800 hover:text-white" :
              "bg-gray-300 text-gray-500")
          } onClick={() => {
            showModal("??????????????????", "???????????????????????????????????????", "resumeUsers");
          }}>????????????
          </button>
        </div>
      </div>
      <Modal title={title} visible={visible} text={text} onCancel={() => {
        setVisible(false);
      }} onOk={
        () => {
          onOk();
        }
      }/>
    </div>
  </>;
}

export default UserList;
