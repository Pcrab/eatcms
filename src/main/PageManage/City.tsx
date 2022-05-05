import React, {HTMLProps, useState, useEffect, useRef} from "react";
import {Divider,Input,  Table} from "antd";
import Pagination from "../../partials/Pagination";
import PopWindow from "../../partials/PopWindow";
import {testCities} from "../../utils/constants";

const {TextArea} = Input;

interface LocationObject {
  latitude: number,
  longitude: number,
}

interface CityObject {
  name: string;
  location: LocationObject;
  detail: string;
  oneword: string;
  order: number;
  hotvalue: number;
  pic: string[];
}

interface ImgProps extends HTMLProps<HTMLImageElement> {
  index: number;
  deleteImg: (index: number) => void;
}

function Img(props: ImgProps) {
  return <div className="relative mb-8 w-40 h-40 mr-6">
    <img alt="上传的图片" key={props.src} src={props.src} className="object-cover w-40 h-40 rounded-xl"/>
    <div onClick={() => {
      props.deleteImg(props.index);
    }} className="absolute w-6 h-6 leading-6 text-white text-center rounded-3xl text-xl cursor-pointer"
    style={{top: "-0.75rem", right: "-0.75rem", backgroundColor: "rgba(0,0,0,0.5)"}}>X
    </div>
  </div>;
}

interface EditProps extends HTMLProps<HTMLDivElement> {
  city: CityObject | null;
  onOk: (city?: CityObject) => void;
}

function Edit(props: EditProps) {
  const isEditing = !!props.city;
  const [name, setName] = useState(props.city ? props.city.name : "");
  const [location, setLocation] = useState(props.city ? props.city.location : {latitude: 0, longitude: 0});
  const [longitude, setLongitude] = useState(props.city ? props.city.location.longitude : 0);
  const [latitude, setLatitude] = useState(props.city ? props.city.location.latitude : 0);
  const [detail, setDetail] = useState(props.city ? props.city.detail : "");
  const [oneword, setOneword] = useState(props.city ? props.city.oneword : "");
  const [order, setOrder] = useState(props.city ? props.city.order : 0);
  const [hotvalue, setHotvalue] = useState(props.city ? props.city.hotvalue : 0);
  const [pic, setPic] = useState<string[]>(props.city ? props.city.pic : []);

  const [pendingImgs, setPendingImgs] = useState<string[]>([]);

  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocation({latitude, longitude});
  }, [latitude, longitude]);

  function deleteImg(index: number) {
    console.log(index);
    if (index < pic.length) {
      console.log("pic");
      const newPic: string[] = [];
      pic.forEach((item, i) => {
        if (i !== index) {
          newPic.push(item);
        }
      });
      setPic(newPic);
    } else {
      console.log("pending");
      const newPendingImgs: string[] = [];
      pendingImgs.forEach((item, i) => {
        if (i !== index - pic.length) {
          newPendingImgs.push(item);
        }
      });
      setPendingImgs(newPendingImgs);
    }
  }

  function tryUpload() {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }

  function uploadImg(files: FileList | null) {
    if (!files) {
      return;
    }
    const newImgs: string[] = [];
    pendingImgs.forEach((item) => {
      newImgs.push(item);
    });
    for (let i = 0; i < files.length; i++) {
      if (pic.length + pendingImgs.length >= 9) {
        break;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        newImgs.push(e.target.result);
        setPendingImgs(newImgs);
      };
      const file = files.item(i);
      if (!file) {
        continue;
      }
      console.log(file);
      reader.readAsDataURL(file);
    }
  }

  function approve() {
    return;
  }

  function cancel() {
    return;
  }

  return <>
    <div className="mt-10" style={{width: "60%"}}>

      <div className="flex mb-8">
        <div className="text-2xl w-36">城市名称：</div>
        <Input className="text-xl" value={name} onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="flex h-5 items-center justify-between mb-8 mx-auto">
        <div className="flex mr-5">
          <div className="text-lg mr-4">经度：</div>
          <Input size={"small"} placeholder="longitude" className="text-lg w-40" type="number" value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}/>
        </div>
        <div className="flex ml-5">
          <div className="text-lg mr-4">纬度：</div>
          <Input size={"small"} placeholder="latitude" className="text-lg w-40" type="number" value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}/>
        </div>
      </div>
      <div className="flex text-lg mb-8">
        <div className="whitespace-nowrap mr-5">一句话简介：</div>
        <Input value={oneword} onChange={(e) => setOneword(e.target.value)}/>
      </div>
      <TextArea className="mb-8" rows={6} autoSize={false} placeholder="城市详细介绍" value={detail}
        onChange={(e) => setDetail(e.target.value)} style={{resize: "none"}}/>
      <div className="flex h-5 items-center justify-between mb-8 mx-auto">
        <div className="flex mr-5">
          <div className="text-lg mr-4">城市排名：</div>
          <Input size={"small"} placeholder="order" className="text-lg w-40" type="number" value={order}
            onChange={(e) => setOrder(parseInt(e.target.value))}/>
        </div>
        <div className="flex ml-5">
          <div className="text-lg mr-4">城市热力值：</div>
          <Input size={"small"} placeholder="hotvalue" className="text-lg w-40" type="number" value={hotvalue}
            onChange={(e) => setHotvalue(parseInt(e.target.value))}/>
        </div>
      </div>
      <div className="flex justify-center items-center flex-wrap">
        {pic.map((item, index) => {
          console.log(item);
          return <>
            <Img src={item} key={`origin-${index.toString()}`} index={index} deleteImg={() => {deleteImg(index);}}/>
          </>;
        })}
        {pendingImgs.map((item, index) => {
          console.log(item);
          return <>
            <Img src={item} key={`pending-${index.toString()}`} index={index + pic.length} deleteImg={(index) => {deleteImg(index);}}/>
          </>;
        })}
        {
          pic.length + pendingImgs.length < 9 &&
          <div className="w-40 h-40 relative flex items-center justify-center mb-8 rounded border-2 text-lg
          border-gray-300 text-gray-500 bg-gray-100 duration-200 hover:border-gray-500 hover:text-gray-700 hover:font-bold"
          onClick={() => {tryUpload();}}>
            <div className="m-auto">上传</div>
            <input hidden={true} ref={fileInput} type="file" onChange={() => {
              if (fileInput.current) {
                uploadImg(fileInput.current.files);
              }
            }} multiple={true} accept="image/*"/>
          </div>
        }
      </div>
    </div>
    <Divider/>
    <div className="mt-6">
      <button
        className="bg-green-100 font-bold text-xl px-6 py-2 rounded-xl mx-10 hover:bg-green-800 hover:text-white duration-300"
        onClick={() => {
          approve();
        }}>{isEditing ? "修改" : "发布"}
      </button>
      <button
        className="bg-red-100 font-bold text-xl px-6 py-2 rounded-xl mx-10 hover:bg-red-800 hover:text-white duration-300"
        onClick={() => {
          cancel();
        }}>返回
      </button>
    </div>
  </>;
}

function City() {
  const [cities, setCities] = React.useState<CityObject[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [city, setCity] = React.useState<CityObject | null>(null);
  const [opened, setOpened] = React.useState(false);

  function refresh() {
    console.log(`refresh at page ${page} with size ${pageSize}`);
    setCities(testCities(pageSize));
    setTotal(22);
    return;
  }

  useEffect(() => {
    refresh();
  }, [page, pageSize]);

  useEffect(() => {
    if (city) {
      setOpened(true);
    }
  }, [city]);

  const columns = [
    {
      title: "城市名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "简要介绍",
      dataIndex: "oneword",
      key: "oneword",
    },
    {
      title: "城市热力值",
      dataIndex: "hotvalue",
      key: "hotvalue",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      align: "right" as const,
      render: (text: string, object: CityObject) => (
        <div className="text-red-800 font-bold cursor-pointer" onClick={() => {
          setCity(object);
        }}>编辑</div>
      ),
    }
  ];

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
        dataSource={cities.map((city) => ({...city, key: city.name}))}
        pagination={false}
      />
      {pagination}
      <div className="flex justify-end mb-4 flex-grow">
        <button className="font-bold h-8 px-4 rounded-md mr-4 duration-200 bg-red-300 hover:bg-red-800 hover:text-white"
          onClick={() => {
            setCity(null);
            setOpened(true);
          }}>新增城市
        </button>
      </div>
      <PopWindow opened={opened} onClose={() => {
        setOpened(false);
      }}>
        <Edit city={city} onOk={() => {
          refresh();
          setOpened(false);
        }}/>
      </PopWindow>
    </div>
  </>;
}

export default City;