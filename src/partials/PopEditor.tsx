import React from "react";
import PopWindow, {PopWindowProps} from "./PopWindow";
import {Divider} from "antd";

interface PopEditorProps extends PopWindowProps {
  okText: string;
  cancelText: string;
  onOk: () => void;
  onCancel?: () => void;
}

function PopEditor(props: PopEditorProps) {
  return <PopWindow opened={props.opened} onClose={() => {
    if (props.onCancel) {
      props.onCancel();
    }
    props.onClose();
  }}>
    {props.children}
    <Divider/>
    <div className="mt-6">
      <button
        className="bg-green-100 font-bold text-xl px-6 py-2 rounded-xl mx-10 hover:bg-green-800 hover:text-white duration-300"
        onClick={() => {
          props.onOk();
          // props.onClose();
        }}>{props.okText}
      </button>
      <button
        className="bg-red-100 font-bold text-xl px-6 py-2 rounded-xl mx-10 hover:bg-red-800 hover:text-white duration-300"
        onClick={() => {
          if (props.onCancel) {
            props.onCancel();
          }
          props.onClose();
        }}>{props.cancelText}
      </button>
    </div>
  </PopWindow>;
}

export default PopEditor;