import {Table} from "antd";
import React, {useEffect} from "react";
import {testUsers} from "../../utils/constants";
import Pagination from "../../partials/Pagination";
import Modal from "../../partials/Modal";

interface UserObject {
  id: string;
  nickName: string;
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
    setUsers(testUsers(pageSize));
    setTotal(22);
    setSelected([]);
    setUserID("");
  }

  function handleChange(page: number, pageSize: number) {
    setPage(page);
    setPageSize(pageSize);
    console.log(page, pageSize);
  }

  function handleSelect(selectedRows: UserObject[]) {
    setSelected(selectedRows);
    return;
  }

  const pagination = <Pagination onChange={(page, pageSize) => {
    handleChange(page, pageSize);
  }} defaultPageSize={pageSize} total={total}/>;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "昵称",
      dataIndex: "nickName",
      key: "nickName",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      align: "right" as const,
      render: (text: string, record: UserObject) => (
        <div className="text-red-800 font-bold cursor-pointer" onClick={() => {
          setText(`确认删除用户${record.nickName}吗？`);
          setUserID(record.id);
          setSingleVisible(true);
        }}>删除</div>
      ),
    }
  ];

  function deleteUser(id: string) {
    console.log(`user deleted: ${id}`);
    refreshUser();
  }

  function deleteUsers() {
    console.log(`users deleted: ${selected.map(user => user.id)}`);
    refreshUser();
  }

  return <>
    <div className="flex flex-col w-full h-full">
      <Table
        className="mb-4"
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys, selectedRows) => {
            handleSelect(selectedRows);
          }
        }}
        columns={columns}
        dataSource={users.map((user) => ({...user, key: user.id}))}
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
