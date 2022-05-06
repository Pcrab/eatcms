import React, {HTMLProps, useState, useEffect} from "react";
import {Input,  Table} from "antd";

import Pagination from "../../partials/Pagination";
import Images from "../../partials/Images";
import {sendImages, testCities} from "../../utils/constants";
import PopEditor from "../../partials/PopEditor";

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

interface EditProps extends HTMLProps<HTMLDivElement> {
  opened: boolean,
  onClose: () => void,
  city: CityObject | null;
  onOk: () => void;
}

function Edit(props: EditProps) {
  const isEditing = !!props.city;
  const [name, setName] = useState("");
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [detail, setDetail] = useState("");
  const [oneword, setOneword] = useState("");
  const [order, setOrder] = useState(0);
  const [hotvalue, setHotvalue] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const [pendingImages, setPendingImages] = useState<string[]>([]);

  useEffect(() => {
    setName(props.city?.name || "");
    setLocation(props.city?.location || {latitude: 0, longitude: 0});
    setLongitude(props.city?.location?.longitude || 0);
    setLatitude(props.city?.location?.latitude || 0);
    setDetail(props.city?.detail || "");
    setOneword(props.city?.oneword || "");
    setOrder(props.city?.order || 0);
    setHotvalue(props.city?.hotvalue || 0);
    setImages(props.city?.pic || []);
  }, [props.city]);

  useEffect(() => {
    setLocation({latitude, longitude});
  }, [latitude, longitude]);

  function sendCity() {return;}

  async function send() {
    await sendImages({
      images: images,
      pendingImages: pendingImages,
      setImages: (pic) => {
        setImages(pic);
      },
      setPendingImages: (pendingImages) => {
        setPendingImages(pendingImages);
      },
      onSuccess: () => {
        sendCity();
      },
    });
  }

  function uploadImg(files: FileList | null) {
    if (!files) {
      return;
    }
    const newImages: string[] = [];
    pendingImages.forEach((item) => {
      newImages.push(item);
    });
    for (let i = 0; i < files.length; i++) {
      if (images.length + pendingImages.length >= 9) {
        break;
      }
      const file = files.item(i);
      if (!file) {
        continue;
      }
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push(reader.result as string);
        setPendingImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  }

  return <>
    <PopEditor okText={isEditing ? "修改" : "发布"} cancelText={"取消"} onOk={async () => {await send();}} opened={props.opened} onClose={() => {props.onClose();}}>
      <div className="mt-10" style={{width: "60%"}}>
        <div className="flex mb-8">
          <div className="text-2xl whitespace-nowrap">城市名称：</div>
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
        <TextArea className="mb-8" maxLength={600} rows={8} autoSize={false} placeholder="城市详细介绍" value={detail}
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
          <Images images={images} setImages={(images) => {setImages(images);}}
            pendingImages={pendingImages} setPendingImages={(pendingImages) => {setPendingImages(pendingImages);}}
            onUpload={(files) => {uploadImg(files);}}
          />
        </div>
      </div>
    </PopEditor>
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
      <Edit onOk={() => {refresh();}} city={city} opened={opened} onClose={() => {setOpened(false);}}/>
    </div>
  </>;
}

export default City;