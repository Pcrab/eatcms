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
  city?: string;
  province?: string;
  country?: string;
  create_time?: string;
  isLegal?: boolean;
}

function UserList() {

  const [users, setUsers] = React.useState<UserObject[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [selected, setSelected] = React.useState<UserObject[]>([]);
  const [userID, setUserID] = React.useState("");

  const [singleVisible, setSingleVisible] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [text, setText] = React.useState("");

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
        console.log(res.data.total);
        console.log(res.data.data);
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
    getCheckboxProps: (record: UserObject) => ({
      disabled: record.role.indexOf("admin") !== -1,
      name: record._id,
    }),
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "用户名",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "城市",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "省份",
      dataIndex: "province",
      key: "province",
    },
    {
      title: "国家",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "身份",
      dataIndex: "role",
      key: "role",
      render: (tags: string[]) => {
        if (tags.indexOf("admin") !== -1) {
          return <Tag color="volcano">管理</Tag>;
        } else {
          return <>
            {
              tags.map((tag: string) => {
                if (tag === "reviewer") {
                  return <Tag color="geekblue" key="reviewer">审核</Tag>;
                } else {
                  return <Tag color="green" key="user">用户</Tag>;
                }
              })
            }
          </>;
        }
      }
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "create_time",
    },
    {
      title: "状态",
      dataIndex: "isLegal",
      key: "isLegal",
      render: (isLegal: boolean) => {
        if (isLegal === false) {
          return <Tag color="volcano">封禁</Tag>;
        } else {
          return <Tag color="green">正常</Tag>;
        }
      }
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      align: "right" as const,
      render: (text: string, record: UserObject) =>{
        if (record.role.indexOf(UserType.Admin) === -1) {
          return <div className="text-red-800 font-bold cursor-pointer" onClick={() => {
            setText(`确认删除用户${record.userName}吗？`);
            setUserID(record._id);
            setSingleVisible(true);
          }}>删除</div>;
        } else {
          return <></>;
        }
      }
    }
  ];

  function deleteUser(id: string) {
    console.log(`user deleted: ${id}`);
    refreshUser();
  }

  function deleteUsers() {
    console.log(`users deleted: ${selected.map(user => user._id)}`);
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
              "bg-red-300 hover:bg-red-800 hover:text-white" :
              "bg-gray-300 text-gray-500")
          } onClick={() => {
            setText("确认删除所选中的这些用户吗？");
            setVisible(true);
          }}>批量删除
          </button>
        </div>
      </div>
      <Modal title="删除用户" visible={singleVisible} text={text} onCancel={() => {
        setSingleVisible(false);
      }} onOk={
        () => {
          deleteUser(userID);
          setSingleVisible(false);
        }
      }/>
      <Modal title="批量删除用户" visible={visible} text={text} onCancel={() => {
        setVisible(false);
      }} onOk={
        () => {
          deleteUsers();
          setVisible(false);
        }
      }/>
    </div>
  </>;
}

export default UserList;
