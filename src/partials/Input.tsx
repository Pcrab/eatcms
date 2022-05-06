import React from "react";
import {Input as AntdInput} from "antd";

import {InputProps} from "antd";

function Input(props: InputProps) {

  let inputOnChange: boolean | undefined;

  return <>
    <AntdInput
      {...props}
      onCompositionStart={() => inputOnChange = true}
      onChange={(e) => {
        console.log("change");
        if (!inputOnChange) {
          props.onChange && props.onChange(e);
        }
      }}
      onCompositionEnd={(e) => {
        console.log("end");
        inputOnChange = undefined;
        props.onChange && props.onChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
      }}
    />
  </>;
}

export default Input;