import React, {HTMLProps, useRef} from "react";

interface ImgProps extends HTMLProps<HTMLImageElement> {
  deleteImg: () => void;
  key?: string;
}

function Img(props: ImgProps) {
  return <div key={props.key} className="relative mb-8 w-40 h-40 mr-6">
    <img alt="上传的图片" key={props.src} src={props.src} className="object-cover w-40 h-40 rounded-xl"/>
    <div onClick={() => {
      props.deleteImg();
    }} className="absolute w-6 h-6 leading-6 text-white text-center rounded-3xl text-xl cursor-pointer"
    style={{top: "-0.75rem", right: "-0.75rem", backgroundColor: "rgba(0,0,0,0.5)"}}>X
    </div>
  </div>;
}

interface ImagesProps extends HTMLProps<HTMLDivElement> {
  images: string[];
  setImages: (images: string[]) => void;
  pendingImages: string[];
  setPendingImages: (images: string[]) => void;
  cover: string;
  setCover: (cover: string) => void;
}

function Images(props: ImagesProps) {

  const fileInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  function tryUpload() {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }

  function tryUploadCover() {
    if (coverInput.current) {
      coverInput.current.click();
    }
  }

  function uploadImg(files: FileList | null) {
    if (!files) {
      return;
    }
    const newImages: string[] = [];
    props.pendingImages.forEach((item) => {
      newImages.push(item);
    });
    for (let i = 0; i < files.length; i++) {
      if (props.images.length + props.pendingImages.length >= 9) {
        break;
      }
      const file = files.item(i);
      if (!file) {
        continue;
      }
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push(reader.result as string);
        props.setPendingImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  }

  function uploadCover(files: FileList | null) {
    if (!files) {
      return;
    }
    const newCover = files.item(0);
    if (!newCover) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      props.setCover(reader.result as string);
    };
    reader.readAsDataURL(newCover);
  }

  function deleteImg(index: number) {
    console.log(index);
    if (index < props.images.length) {
      console.log("pic");
      const newImages: string[] = [];
      props.images.forEach((item, i) => {
        if (i !== index) {
          newImages.push(item);
        }
      });
      props.setImages(newImages);
    } else {
      console.log("pending");
      const newPendingImgs: string[] = [];
      props.pendingImages.forEach((item, i) => {
        if (i !== index - props.images.length) {
          newPendingImgs.push(item);
        }
      });
      props.setPendingImages(newPendingImgs);
    }
  }

  return <>
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap my-5">
        {props.images.map((item, index) => {
          return <>
            <Img src={item} key={`origin-${index}`} deleteImg={() => {deleteImg(index);}}/>
          </>;
        })}
        {props.pendingImages.map((item, index) => {
          return <>
            <Img src={item} key={`pending-${index}`} deleteImg={() => {deleteImg(index + props.images.length);}}/>
          </>;
        })}
        {
          props.images.length + props.pendingImages.length < 9 &&
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
      {
        props.cover
          ? <Img src={props.cover} deleteImg={() => {props.setCover("");}} />
          : <div className="w-60 h-32 relative flex items-center justify-center mb-8 rounded border-2 text-lg
      border-gray-300 text-gray-500 bg-gray-100 duration-200 hover:border-gray-500 hover:text-gray-700 hover:font-bold" onClick={() => {tryUploadCover();}}>
            <div className="m-auto">上传封面图</div>
            <input hidden={true} ref={coverInput} type="file" onChange={() => {
              if (coverInput.current) {
                uploadCover(coverInput.current.files);
              }
            }} accept="image/*"/>
          </div>
      }
    </div>
  </>;
}

export default Images;