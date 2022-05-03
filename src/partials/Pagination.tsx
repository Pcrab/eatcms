import React from "react";
import {Pagination as AntdPagination} from "antd";

function showTotal(total: number, range: [number, number]) {
  return `共 ${total} 项中的 ${range[0]}-${range[1]}`;
}

interface PaginationProps {
  total: number;
  defaultPageSize: number;
  onChange: (page: number, pageSize: number) => void;
}

function Pagination(props: PaginationProps) {
  const [current, setCurrent] = React.useState(1);
  return <>
    <AntdPagination
      current={current}
      defaultCurrent={1}
      defaultPageSize={props.defaultPageSize}
      // hideOnSinglePage={true}
      onChange={(page, pageSize) => {
        setCurrent(page);
        props.onChange(page, pageSize);
      }}
      responsive={true}
      showSizeChanger
      showTotal={showTotal}
      total={props.total}
    />
  </>;
}

export default Pagination;