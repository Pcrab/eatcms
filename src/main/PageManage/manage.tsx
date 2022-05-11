import React, {HTMLProps, useState, useEffect} from "react";
import {Table} from "antd";

import Pagination from "../../partials/Pagination";
import Images from "../../partials/Images";
import CONSTANTS, {sendImages} from "../../utils/constants";
import PopEditor from "../../partials/PopEditor";
import axios from "axios";

interface LocationObject {
  latitude: number,
  longitude: number,
}

interface BaseObject {
  _id: string,
  name: string,
  location: LocationObject;
  detail: string;
  oneword: string;
  order: number;
  hotvalue: number;
  pic: string[];
  card_pic: string;
}

function emptyBaseObject(): BaseObject {
  return {
    _id: "",
    name: "",
    location: {
      latitude: 0,
      longitude: 0,
    },
    detail: "",
    oneword: "",
    order: 0,
    hotvalue: 0,
    pic: [],
    card_pic: "",
  };
}

interface CityObject extends BaseObject {
  province: string;
  yiqing_policy: string;
}

function emptyCityObject(): CityObject {
  return {
    ...emptyBaseObject(),
    province: "",
    yiqing_policy: "",
  };
}

interface ScenenicObject extends BaseObject {
  city_id: string;
  yiqing_policy: string;
}

function emptyScenicObject(): ScenenicObject {
  return {
    ...emptyBaseObject(),
    city_id: "",
    yiqing_policy: "",
  };
}

interface FoodObject extends BaseObject {
  city_id: string;
  scenenic_id: string;
}

function emptyFoodObject(): FoodObject {
  return {
    ...emptyBaseObject(),
    city_id: "",
    scenenic_id: "",
  };
}

interface EditProps extends HTMLProps<HTMLDivElement> {
  type: "city" | "scenenic" | "food";
  opened: boolean,
  onClose: () => void,
  object: CityObject | ScenenicObject | FoodObject,
  onOk: () => void;
}

function Edit(props: EditProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [detail, setDetail] = useState("");
  const [oneword, setOneword] = useState("");
  const [pic, setPic] = useState<string[]>([]);
  const [card_pic, setCardPic] = useState("");
  const [order, setOrder] = useState(0);
  const [hotvalue, setHotvalue] = useState(0);

  const [province, setProvince] = useState("");
  const [city_id, setCityId] = useState("");
  const [yiqing_policy, setYiqingPolicy] = useState("");
  const [scenenic_id, setScenenicId] = useState("");

  const [prefix, setPrefix] = useState("");

  const [pendingImages, setPendingImages] = useState<string[]>([]);

  useEffect(() => {
    console.log(props.object);
    setName(props.object?.name || "");
    setLocation(props.object?.location || {latitude: 0, longitude: 0});
    setLongitude(props.object?.location?.longitude || 0);
    setLatitude(props.object?.location?.latitude || 0);
    setDetail(props.object?.detail || "");
    setOneword(props.object?.oneword || "");
    setPic(props.object?.pic || []);
    setCardPic(props.object?.card_pic || "");
    setOrder((props.object as CityObject)?.order || 0);
    setHotvalue((props.object as CityObject)?.hotvalue || 0);

    setPrefix(props.type === "city" ? "城市" : props.type === "scenenic" ? "景点" : "美食");

    if (props.type === "city") {
      setProvince((props.object as CityObject)?.province || "");
      setYiqingPolicy((props.object as CityObject)?.yiqing_policy || "");
    } else if (props.type === "scenenic") {
      setCityId((props.object as ScenenicObject)?.city_id || "");
      setYiqingPolicy((props.object as ScenenicObject)?.yiqing_policy || "");
    } else {
      setScenenicId((props.object as FoodObject)?.scenenic_id || "");
      setCityId((props.object as FoodObject)?.city_id || "");
    }
  }, [props.object]);

  useEffect(() => {
    setLocation({latitude, longitude});
  }, [latitude, longitude]);

  function inputLatitude(e: React.ChangeEvent<HTMLInputElement>) {
    const tmp = Number(e.target.value);
    if (tmp < -90) {
      setLatitude(-90);
    } else if (tmp > 90) {
      setLatitude(90);
    } else {
      setLatitude(tmp);
    }
  }

  function inputLongitude(e: React.ChangeEvent<HTMLInputElement>) {
    const tmp = Number(e.target.value);
    if (tmp < -180) {
      setLongitude(-180);
    } else if (tmp > 180) {
      setLongitude(180);
    } else {
      setLongitude(tmp);
    }
  }

  function sendObject(pic: string[], card_pic: string) {
    console.log(pic, card_pic);

    const object: any = {
      name,
      location,
      detail,
      oneword,
      pic,
      card_pic,
      order,
      hotvalue,
    };
    if (props.object._id) {
      object._id = props.object._id;
    }
    if (props.type === "city") {
      object["province"] = province;
      object["yiqing_policy"] = yiqing_policy;
    } else if (props.type === "scenenic") {
      object["city_id"] = city_id;
      object["yiqing_policy"] = yiqing_policy;
    } else if (props.type === "food") {
      object["scenenic_id"] = scenenic_id;
      object["city_id"] = city_id;
    }

    axios.post(CONSTANTS.addObjectUrl + props.type, object, {
      headers: {
        "Authorization": localStorage.getItem("token") || "",
      }
    }).then((res) => {
      props.onOk();
      console.log(res);
    });
  }

  async function send() {
    await sendImages({
      images: pic,
      pendingImages: pendingImages,
      cover: card_pic,
      setImages: (pic) => {
        setPic(pic);
      },
      setPendingImages: (pendingImages) => {
        setPendingImages(pendingImages);
      },
      setCover: (cover) => {
        setCardPic(cover);
      },
      onSuccess: (pic, card_pic) => {
        console.log("success");
        sendObject(pic, card_pic);
      },
    });
  }

  const inputClass = " border-gray-200 border-2 px-2 rounded-md ";

  return <>
    <PopEditor okText={props.object._id !== "" ? "修改" : "发布"} cancelText={"取消"} onOk={async () => {await send();}} opened={props.opened} onClose={() => {props.onClose();}}>
      <div className="mt-10" style={{width: "60%"}}>
        <div className="flex items-center mb-8">
          <div className="text-2xl whitespace-nowrap">{prefix}名称：</div>
          <input className={"w-full h-10 text-xl " + inputClass} value={name} onChange={(e) => {setName(e.target.value);}}/>
        </div>
        <div className="flex h-5 items-center justify-between mb-8 mx-auto">
          <div className="flex mr-5">
            <div className="text-lg mr-4">经度：</div>
            <input placeholder="longitude" className={"text-lg w-40 " + inputClass} type="number" value={longitude}
              onChange={(e) => inputLongitude(e)}/>
          </div>
          <div className="flex ml-5">
            <div className="text-lg mr-4">纬度：</div>
            <input placeholder="latitude" className={"text-lg w-40" + inputClass} type="number" value={latitude}
              onChange={(e) => inputLatitude(e)}/>
          </div>
        </div>
        <div className="flex items-center text-lg mb-8">
          <div className="whitespace-nowrap mr-5">一句话简介：</div>
          <input className={"w-full h-10 " + inputClass} value={oneword} onChange={(e) => setOneword(e.target.value)}/>
        </div>
        <textarea className={"mb-8 w-full p-2 " + inputClass} maxLength={600} rows={8} placeholder="城市详细介绍" value={detail}
          onChange={(e) => setDetail(e.target.value)} style={{resize: "none"}}/>
        <div className="flex h-5 items-center justify-between mb-8 mx-auto">
          <div className="flex">
            <div className="text-lg whitespace-nowrap mr-4">{prefix}排名：</div>
            <input placeholder="order" className={"text-lg w-32 " + inputClass} type="number" value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}/>
          </div>
          <div className="flex">
            <div className="text-lg whitespace-nowrap mr-4">{prefix}热力值：</div>
            <input placeholder="hotvalue" className={"text-lg w-32 " + inputClass} type="number" value={hotvalue}
              onChange={(e) => setHotvalue(parseInt(e.target.value))}/>
          </div>
        </div>
        {props.type === "city" &&
          <div className="flex">
            <div className="text-lg whitespace-nowrap mr-4">省市：</div>
            <input placeholder="province" className={"text-lg w-32 " + inputClass} type="text" value={province}
              onChange={(e) => setProvince(e.target.value)}/>
          </div>
        }
        {
          (props.type === "city" || props.type === "scenenic") &&
          <textarea className={"my-8 w-full p-2 " + inputClass} maxLength={600} rows={8} placeholder="疫情政策" value={yiqing_policy}
            onChange={(e) => setYiqingPolicy(e.target.value)} style={{resize: "none"}}/>
        }
        <div className="flex justify-center items-center flex-wrap">
          <Images images={pic} setImages={(images) => {setPic(images);}}
            pendingImages={pendingImages} setPendingImages={(pendingImages) => {setPendingImages(pendingImages);}}
            cover={card_pic} setCover={(cover) => {setCardPic(cover);}}/>
        </div>
      </div>
    </PopEditor>
  </>;
}

interface ManageProps {
  type: "city" | "scenenic" | "food";
}

function Manage(props: ManageProps) {
  const [objects, setObjects] = React.useState<CityObject[] | ScenenicObject[] | FoodObject[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [object, setObject] = React.useState<CityObject | ScenenicObject | FoodObject>(emptyCityObject());
  const [opened, setOpened] = React.useState(false);

  const [type, setType] = React.useState(props.type);

  function refresh() {
    console.log(`refresh at page ${page} with size ${pageSize}`);
    axios.get(CONSTANTS.getAllObjectUrl + props.type + (props.type === "city" ? "s" : "") + `/${page}/${pageSize}`)
      .then(res => {
        console.log(res.data);
        setObjects(res.data.data);
        setTotal(res.data.total);
      })
      .catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    setPageSize(10);
    setPage(1);
  }, [props.type]);

  useEffect(() => {
    refresh();
  }, [page, pageSize, props]);


  const columns = [];
  columns.push({
    title: "名称",
    dataIndex: "name",
    key: "name",
  });
  columns.push({
    title: "简要介绍",
    dataIndex: "oneword",
    key: "oneword",
  });
  if (props.type === "city") {
    columns.push({
      title: "省市",
      dataIndex: "province",
      key: "province",
    });
  }
  columns.push({
    title: "操作",
    dataIndex: "action",
    key: "action",
    align: "center" as const,
    render: (text: string, object: CityObject | ScenenicObject | FoodObject) => (
      <div className="flex justify-center items-center">
        {
          props.type === "city" &&
          <div className="text-blue-800 font-bold cursor-pointer mr-5" onClick={() => {
            setType("scenenic");
            setObject({
              ...emptyScenicObject(),
              city_id: object._id,
            });
            setOpened(true);
          }}>
            新增景点
          </div>
        }
        {
          props.type === "scenenic" &&
          <div className="text-blue-800 font-bold cursor-pointer mr-5" onClick={() => {
            setType("food");
            setObject({
              ...emptyFoodObject(),
              city_id: (object as ScenenicObject).city_id,
              scenenic_id: object._id,
            });
            setOpened(true);
          }}>
            新增美食
          </div>
        }
        <div className="text-red-800 font-bold cursor-pointer" onClick={() => {
          setType(props.type);
          setObject(object);
          setOpened(true);
        }}>编辑</div>
      </div>
    ),
  });

  function handleChange(page: number, pageSize: number) {
    setPage(page);
    setPageSize(pageSize);
    console.log(page, pageSize);
  }

  const pagination = <Pagination onChange={(page, pageSize) => {
    handleChange(page, pageSize);
  }} defaultPageSize={pageSize} total={total}/>;

  return <>
    <div>
      <Table
        className="mb-4"
        columns={columns}
        dataSource={objects.map((object) => ({...object, key: object._id}))}
        pagination={false}
      />
      {pagination}
      {
        props.type === "city" &&
        <div className="flex justify-end mb-4 flex-grow">
          <button className="font-bold h-8 px-4 rounded-md mr-4 duration-200 bg-red-300 hover:bg-red-800 hover:text-white"
            onClick={() => {
              setType("city");
              setObject(emptyCityObject());
              setOpened(true);
            }}>新增城市
          </button>
        </div>
      }
      <Edit onOk={() => {refresh();}} type={type} object={object} opened={opened} onClose={() => {setOpened(false);}}/>
    </div>
  </>;
}

export default Manage;
