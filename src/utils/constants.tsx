import axios from "axios";

const remoteBaseUrl = "http://81.68.152.160:3000";

// noinspection SpellCheckingInspection
const CONSTANTS = {
  loginUrl: remoteBaseUrl + "/admin/login",
  allUserUrl: remoteBaseUrl + "/api/allUser",
  setUserUrl: remoteBaseUrl + "/api/setuser",

  uploadImgUrl: remoteBaseUrl + "/api/upload",

  addObjectUrl: remoteBaseUrl + "/api/add",
  getAllObjectUrl: remoteBaseUrl + "/csf/getall",

  getAllNotesUrl: remoteBaseUrl + "/api/allNotes",
  setNoteUrl: remoteBaseUrl + "/api/setnote",

  resetPwdUrl: remoteBaseUrl + "",
  createUserUrl: remoteBaseUrl + "",

  testing: false,
  testingLogin: true,
  testingAdmin: true,

  copyRight: "TEST COPYRIGHT 2022",

  fallbackImg: "data:image/png;base64,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",

  loginRoute: "/login",
  mainRoute: "/main",
};

export function buildBlob(file: string): Blob | null {
  const arr = file.split(",");
  const reg = arr[0].match(/:(.*?);/);
  if (reg) {
    const mime = reg[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  } else {
    return null;
  }
}

export const testArticles = (number: number) => {
  const articles = [];
  for (let i = 0; i < number; i++) {
    articles.push({
      id: i.toString(),
      title: "testTitle" + i,
      author: "testAuthor" + i,
    });
  }
  return articles;
};

export const testArticleDetail = (id: string) => {
  return {
    id: id,
    title: "testTitle" + id,
    author: "testAuthor" + id,
    content: [
      "文案的撰写要有自己的风格，我撰写文案从会有几个模块着手，到店背景，菜品环境，服务。到店背景会写一下什么原因到这家餐厅来消费，例如是，闺蜜相约，或者是商务聚餐，或者只是一般的工作午餐，让整个点评有了故事感，内容会让人觉得真实可信；菜品，点什么菜就评论什么菜，配上图片，写自己的更真实感受就好。参考一下其他的美食博主是怎么样描述菜品，不能只是说哇，很好吃。可以从摆盘出品，口味，原料搭配，制作工艺，创意几方面来描述菜品，或者你对某个菜的文化或者制作工艺有了解也可以分享一下。环境方面的评论可以讲整个装修的风格是怎样的？比如，现代简约式，或者传统的中式，家庭式的小馆子，也可以从整个餐厅的布局动线是否合理来描述一下，还有景观位，餐具摆放是否有美感；服务方面可以从等位入座，点菜，用餐，结账，某个环节来描述一下当天的体验。",
      "做美食博主很重要的基本功就是图片拍摄，我一直都没有用相机来拍美食图片，因为经常是会跟朋友同事去吃饭，拿着一个相机看起来很夸张的样子，所有的图片都是手机拍的，好在现在的手机拍出的照片本身也质量很高，但要注意的几点，第一是要有足够的光线，如果能靠窗边有自然光最好，一些餐厅灯光还特别昏暗，这就对拍摄带来了很大的挑战，最好的办法是请旁边的人帮着打开手机的手电筒，用手电筒补光来拍照，这样好像在菜品上打了个射灯，拍摄效果会特好，不要采用闪光灯，闪光灯拍出来的会有一些失真颜色；构图方面，拍菜品，1:1的比例会比较好，因为一般的盘子是圆的，这样的比例会看起来比较协调，主题居中就好，如果是拍景观就用现在的主流16:9，看起来比较现代时尚，可以用相机自带九宫格三分位构图，主题放在黄金分割点上好。"
    ],
    images: [
      "http://127.0.0.1:8000/1.jpg",
      "http://127.0.0.1:8000/2.jpg",
      "http://127.0.0.1:8000/3.jpg",
      "http://127.0.0.1:8000/4.jpg",
    ]
  };
};

export const testCity = (id: string) => {
  return {
    name: "testCityName" + id,
    location: {
      longitude: 123.123,
      latitude: 321.321,
    },
    detail: "test City Detail here!!!! very short...",
    oneword: "test Oneword",
    order: 10,
    hotvalue: 300,
    pic: [
      "http://127.0.0.1:8000/1.jpg",
      "http://127.0.0.1:8000/2.jpg",
      "http://127.0.0.1:8000/3.jpg",
      "http://127.0.0.1:8000/4.jpg",
    ]
  };
};

export const testCities = (number: number) => {
  const cities = [];
  for (let _i = 0; _i < number; _i++) {
    cities.push(testCity(_i.toString()));
  }
  return cities;
};

interface SendImagesObject {
  images: string[];
  pendingImages: string[];
  setImages: (pic: string[]) => void;
  setPendingImages: (pendingImages: string[]) => void;
  cover: string;
  setCover: (cover: string) => void;
  onSuccess?: (pic: string[], card_pic: string) => void;
  onFail?: (err: string) => void;
  onFinish?: () => void;
}

export async function sendImages(obj: SendImagesObject) {
  let cover = "";
  const pending = [...obj.pendingImages];
  const newPending: string[] = [];
  const urls = [...obj.images];
  const initRequest = await axios.get(CONSTANTS.uploadImgUrl, {
    headers: {
      "Authorization": localStorage.getItem("token") || ""
    }
  });
  const data = initRequest.data;

  if (obj.cover.indexOf("data") === 0) {
    pending.push(obj.cover);
  }

  for (const item of [...pending]) {
    const blob = buildBlob(item);
    if (blob) {
      const fileName = `${Date.now()}.${blob.type.split("/")[1]}`;
      const formData = new FormData();
      formData.append("key", "city/${filename}");
      formData.append("policy", data.policy);
      formData.append("OSSAccessKeyId", data.accessid);
      formData.append("success_action_status", "200");
      formData.append("signature", data.signature);
      formData.append("file", blob, fileName);
      const result = await axios.post(data.host, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (result.status === 200) {
        const name = data.host + "/city/" + fileName;
        if (item === obj.cover) {
          obj.setCover(name);
          cover = name;
        } else {
          urls.push(name);
        }
      } else {
        newPending.push(item);
      }
    } else {
      console.log("build blob failed");
      if (item !== cover) {
        newPending.push(item);
      }
    }
  }
  obj.setImages([...urls]);
  obj.setPendingImages([...newPending]);
  if (obj.onFinish) {
    obj.onFinish();
  }
  if (newPending.length !== 0) {
    if (obj.onFail) {
      obj.onFail("部分图片上传失败，请重试");
    }
  } else {
    // 全都上传完成，可以发送到后台
    console.log(`send: ${urls}`);

    if (obj.onSuccess) {
      console.log(urls, cover);
      obj.onSuccess(urls, cover);
    }
  }
}

export default CONSTANTS;

