const remoteBaseUrl = "http://127.0.0.1/";

const CONSTANTS = {
  loginUrl: remoteBaseUrl + "",
  resetPwdUrl: remoteBaseUrl + "",
  createUserUrl: remoteBaseUrl + "",

  testing: true,
  testingLogin: false,
  testingAdmin: true,

  copyRight: "TEST COPYRIGHT 2022",

  loginRoute: "/login",
  mainRoute: "/main",
};

export const testUsers = (number: number) => {
  const users = [];
  for (let i = 0; i < number; i++) {
    users.push({
      id: i.toString(),
      nickName: "test" + i,
    });
  }
  return users;
};

export const testArticles = (number: number) => {
  const articles = [];
  for (let i = 0; i < number; i++) {
    articles.push({
      id: i.toString(),
      title: "testTitle" + i,
      author: "testAuthor" + i,
      // images: [
      //   "http://127.0.0.1:8000/1.jpg",
      //   "http://127.0.0.1:8000/2.jpg",
      //   "http://127.0.0.1:8000/3.jpg",
      //   "http://127.0.0.1:8000/4.jpg",
      // ],
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

export default CONSTANTS;