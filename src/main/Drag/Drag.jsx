import React from "react";
import styles from "./drag.module.css";
import axios from "axios";
import { DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

let initDragChildModel = ["助农", "商城", "直播"];
let initDragChildModel2 = ["城市绝美", "城市绝味"];
let initDragModel = [
  {
    id: "module1",
    name: "横向方块",
    children: initDragChildModel
  },
  {
    id: "fangyi",
    name: "防疫政策",
  },
  {
    id: "fengwu",
    name: "城市风物",
    children: initDragChildModel2
  },
  {
    id: "tuijian",
    name: "相关推荐"
  }
];

let initDropModel = [];
function LzcDrag(props) {
  const [dragModel, setDragModel] = React.useState(initDragModel);
  const [dragChildModel, setDragChildModel] = React.useState(initDragChildModel);
  const [dragChildModel2, setDragChildModel2] = React.useState(initDragChildModel2);
  const [dropModel, setDropModel] = React.useState([]);
  // Drop相关
  const handelDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 添加被拖拽元素到dropModel
    const draggedId = e.dataTransfer.getData("text/plain");
    let copyDragModel = JSON.parse(JSON.stringify(initDragModel));
    let appendDropModel = copyDragModel.filter((item, index) => {
      if (item.id == draggedId) return true;
    });
    initDropModel = [...initDropModel, ...appendDropModel];
    setDropModel(initDropModel);
    // 从dragModel中删去被拖走的元素
    let copyDragModelNow = JSON.parse(JSON.stringify(dragModel));
    let newDragModel = copyDragModelNow.filter((item, index) => {
      if (item.id != draggedId) return true;
    });
    setDragModel(newDragModel);
  };
  const handelDropOver = (e) => {
    e.preventDefault();  //必须阻止，否则不能监听drop
  };

  // Drag相关
  const handelDragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.dataTransfer.dropEffect = "move";  // 有 copy、move、和 auto 三种，分别是把鼠标指针,显示为复制样式（带+号）、移动样式，或自动设置样式
  };


  const dragChildEndEvent = (props) => {
    const { active, over } = props;
    // console.log("active", active);
    const activeIndex = dragChildModel.indexOf(active.id);
    const overIndex = dragChildModel.indexOf(over.id);
    // console.log(over);
    // dragChildModel.map((item, index) => {
    //     if (item.id = active.id) {
    //         activeIndex = index
    //     }
    //     if(item.id=over.id){
    //         overIndex=index
    //     }
    // })
    console.log(activeIndex, overIndex);
    setDragChildModel(dragChildModel => {
      return arrayMove(dragChildModel, activeIndex, overIndex);
    });
  };


  const dragChildEndEvent2 = (props) => {
    const { active, over } = props;
    const activeIndex = dragChildModel2.indexOf(active.id);
    const overIndex = dragChildModel2.indexOf(over.id);
    console.log(activeIndex, overIndex);
    setDragChildModel2(dragChildModel => {
      return arrayMove(dragChildModel, activeIndex, overIndex);
    });
  };

  // 操作按钮相关
  const reset = (e) => {
    setDragModel(initDragModel);
    setDropModel([]);
    initDropModel = [];
  };

  const confirm = async (e) => {
    let copyDropModel = JSON.parse(JSON.stringify(dropModel));
    if (copyDropModel.length != initDragModel.length) {  //pxw 
      // console.log("请添加完全", copyDropModel.length, initDragModel.length);
      alert("请选择完全");
      return;
    }
    let reqArr = copyDropModel.map((item, index) => {
      let objItem = JSON.parse(JSON.stringify(item));
      objItem.order = index + 1;
      if (objItem.id == "module1") {
        // let copyDragChildModel = JSON.parse(JSON.stringify(dragChildModel))
        objItem.children = dragChildModel;
      } else if (objItem.id == "fengwu") {
        // let copyDragChildModel = JSON.parse(JSON.stringify(dragChildModel))
        objItem.children = dragChildModel2;
      }
      return objItem;
    });
    await reqDrag(reqArr);
  };

  // 发送请求将文件顺序发给后台
  const reqDrag = (reqArr) => {
    axios.post("http://81.68.152.160:3000/api/managepage", {
      pageid: "citydetail",
      config: reqArr
    }, {
      headers: { Authorization: localStorage.getItem("token") || "" }
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };


  // 对二级元素的处理
  const renderChild = (item) => {
    if (!item.children) {
      return (<span>{item.name}</span>);
    } else {
      if (item.id == "module1") {
        return (
          <div className={styles.childbox1}>
            <DndContext onDragEnd={dragChildEndEvent}>
              <SortableContext items={dragChildModel}>
                {
                  dragChildModel.map(val => (<Item id={val} key={val} />))
                }
              </SortableContext>
            </DndContext>
          </div>
        );
      } else if (item.id = "fengwu") {
        return (
          <div className={styles.childbox2}>
            <DndContext onDragEnd={dragChildEndEvent2}>
              <SortableContext items={dragChildModel2}>
                {
                  dragChildModel2.map(val => (<Item2 id={val} key={val} />))
                }
              </SortableContext>
            </DndContext>
          </div>
        );
      }
    }
  };


  // 孩子项
  function Item(props) {
    const { id } = props;
    const { setNodeRef, listeners, transform, transition } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
    };
    return (
      <div ref={setNodeRef} {...listeners} style={style} className={styles.childitem}>{id}</div>
    );
  }

  function Item2(props) {
    const { id } = props;
    const { setNodeRef, listeners, transform, transition } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
    };
    return (
      <div ref={setNodeRef} {...listeners} style={style} className={styles.childitem2}><span>{id}</span></div>
    );
  }




  return (
    <>
      <div className={styles.container}>
        {/* 拖放前的展示区 */}
        <div className={styles.dragArea}>
          {/* 可以拖拽的小块 */}
          {
            dragModel.map((item, index) => {
              return (
                <div className={styles.dragitem}
                  draggable={true}
                  key={item.id}
                  onDragStart={e => handelDragStart(e)}
                  id={item.id}>
                  {
                    renderChild(item)
                  }
                </div>
              );
            })
          }
        </div>
        {/* 放置区 */}
        <div className={styles.dropArea} onDrop={e => handelDrop(e)} onDragOver={e => handelDropOver(e)}>
          {
            dropModel.map((item, index) => {
              return (
                <div className={styles.dropitem}
                  key={item.id}
                  id={item.id}>
                  {renderChild(item)}
                </div>
              );
            })
          }
        </div>
      </div>

      {/*操作按钮 */}
      <div className={styles.operateor}>
        <button onClick={e => reset(e)}  className={styles.operateor_item} >重置</button>
        <button onClick={e => confirm(e)}  className={styles.operateor_item}>确定</button>
      </div>
    </>
  );
}


export default LzcDrag;