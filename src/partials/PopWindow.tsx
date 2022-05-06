import React, {useEffect} from "react";
import {Divider} from "antd";

export interface PopWindowProps extends React.HTMLProps<HTMLDivElement>{
  opened: boolean;
  onClose: () => void;
  innerClassName?: string;
  onDisplayed?: () => void;
  onDisappeared?: () => void;
  onFinished?: () => void;
}

function PopWindow(props: PopWindowProps) {

  const [active, setActive] = React.useState(false);
  const [aniClassName, setAniClassName] = React.useState("enter");

  function onDisplayed() {
    if (props.onDisplayed) {
      props.onDisplayed();
    }
  }

  function onDisappeared() {
    if (props.onDisappeared) {
      props.onDisappeared();
    }
  }

  function onFinished() {
    if (props.onFinished) {
      props.onFinished();
    }
  }

  function onTransitionEnd() {
    setAniClassName(props.opened ? "enter-done" : "exit-done");
    if (!props.opened) {
      setActive(false);
      onDisappeared();
    } else {
      onDisplayed();
    }
    onFinished();
  }

  useEffect(() => {
    console.log("executed");
    if (props.opened && !active) {
      console.log("open");
      setActive(true);
      setAniClassName("enter");
      setTimeout(() => {
        setAniClassName("enter-active");
      });
    } else if (!props.opened && active) {
      setAniClassName("exit");
      setTimeout(() => {
        setAniClassName("exit-active");
      });
    }
  }, [props.opened]);

  if (props.opened || active) {
    return <>
      <div className={`absolute top-0 left-0 w-full h-full ${aniClassName} ${props.className}`}
        style={{backgroundColor: "rgba(0,0,0,0.65)"}}
        onTransitionEnd={() => {
          onTransitionEnd();
        }}
        onClick={() => {
          props.onClose();
        }}>
        <div className={"flex mx-auto my-24 pr-6 py-8 rounded-3xl bg-white " + props.innerClassName}
          style={{height: "80vh", width: "80vw"}}
          onClick={(e) => {
            e.stopPropagation();
          }
          }>
          <div className="overflow-auto flex-grow items-center pr-8 py-6 flex flex-col mx-auto">
            {props.children}
            <Divider/>
          </div>
        </div>
      </div>
    </>;
  } else {
    return <></>;
  }
}

export default PopWindow;