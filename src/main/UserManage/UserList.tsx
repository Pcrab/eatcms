import {Table} from "antd";
import React, {useEffect} from "react";
import {testUsers} from "../../utils/constants";
import Pagination from "../../partials/Pagination";

interface UserObject {
  id: string;
  nickName: string;
}


function UserList() {

  const [users, setUsers] = React.useState<UserObject[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  useEffect(() => {
    refreshUser();
  }, [page, pageSize]);

  function refreshUser() {
    console.log(`refresh user at page ${page} with size ${pageSize}`);
    setUsers(testUsers(pageSize));
    setTotal(22);
  }

  function handleChange(page: number, pageSize: number) {
    setPage(page);
    setPageSize(pageSize);
    console.log(page, pageSize);
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
          deleteUser(record.id);
        }}>删除</div>
      ),
    }
  ];

  function deleteUser(id: string) {
    console.log(`user deleted: ${id}`);
  }

  return <>
    <div className="flex flex-col w-full h-full">
      <div>
        <Table
          className="mb-4"
          rowSelection={{
            type: "checkbox",
          }}
          columns={columns}
          dataSource={users.map((user) => ({...user, key: user.id}))}
          pagination={false}
        />
        {pagination}
      </div>
    </div>
  </>;
}

export default UserList;
