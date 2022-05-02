import {Modal as AntdModal} from "antd";
import React from "react";

interface ModalProps {
  visible: boolean;
  title: string;
  text: string;
  onOk: () => void;
  onCancel: () => void;
}

function Modal(props: ModalProps) {
  return <>
    <AntdModal
      title={props.title}
      visible={props.visible}
      onOk={() => {props.onOk();}}
      onCancel={() => {props.onCancel();}}
    >
      <p>{props.text}</p>
    </AntdModal>
  </>;
}

export default Modal;