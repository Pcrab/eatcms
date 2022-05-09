import React, {useEffect} from "react";
import {Carousel, Divider, Image, Table, Tag} from "antd";
import Pagination from "../partials/Pagination";
import CONSTANTS from "../utils/constants";
import PopWindow from "../partials/PopWindow";
import axios from "axios";

interface ArticleObject {
  _id: string;
  isLegal: boolean;
  content: string;
  title: string;
  pic: string[];
  mark: string;
}

interface ArticleProps {
  article: ArticleObject;
  onSubmit: () => void;
}

function Article(props: ArticleProps) {
  const article = props.article;
  if (!article) {
    return <></>;
  }

  async function setNote(isLegal: boolean) {
    await axios.post(CONSTANTS.setNoteUrl, {
      _id: article._id,
      isLegal,
    },{
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")|| "",
      }
    });
  }

  async function approve() {
    console.log(`approve article ${article?._id}`);
    await setNote(true);
    props.onSubmit();
  }

  async function reject() {
    console.log(`reject article ${article?._id}`);
    await setNote(false);
    props.onSubmit();
  }

  return <>
    <div className="text-center font-bold text-5xl mb-4">{article.title}</div>
    <div className="mb-6 text-lg">标签：{article.mark}</div>
    {
      article.pic &&
      <Carousel className="rounded-2xl" autoplay={false}
        style={{backgroundColor: "rgba(0,0,0,0.1)", width: "35rem", height: "35rem"}}>
        {
          article.pic.map((image) => (
            <div className="m-auto" key={image}>
              <Image className="object-contain" src={image} width={"35rem"} height={"35rem"}
                preview={false}
                fallback={CONSTANTS.fallbackImg}/>
            </div>
          ))
        }
      </Carousel>
    }
    <div className="text-left mt-6 text-lg" style={{width: "40rem"}}>
      <pre className="whitespace-pre-line">{article.content}</pre>
    </div>
    <Divider/>
    <div className="mt-6">
      <button
        className="bg-red-100 font-bold text-xl px-6 py-2 rounded-xl mx-10 hover:bg-red-800 hover:text-white duration-300"
        onClick={() => {
          reject();
        }}>封禁
      </button>
      <button
        className="bg-green-100 font-bold text-xl px-6 py-2 rounded-xl mx-10 hover:bg-green-800 hover:text-white duration-300"
        onClick={() => {
          approve();
        }}>通过
      </button>
    </div>
  </>;
}

function Review() {
  const [articles, setArticles] = React.useState<ArticleObject[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [article, setArticle] = React.useState<ArticleObject>({} as ArticleObject);
  const [opened, setOpened] = React.useState(false);

  useEffect(() => {
    refreshArticle().then(() => {
      console.log("refreshed");
    });
  }, [page, pageSize]);

  async function refreshArticle() {
    console.log(`refresh user at page ${page} with size ${pageSize}`);
    const res = await axios.get(CONSTANTS.getAllNotesUrl + `/${page}/${pageSize}`, {
      headers: {
        "Authorization": localStorage.getItem("token") || "",
      }
    });
    console.log(res.data);
    setArticles(res.data.data);
    setTotal(res.data.total);
  }

  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      render: (text: string) => {
        const maxLength = 35;
        const suffix = "...";
        if (text.length >= maxLength) {
          text = text.substring(0, maxLength - suffix.length) + suffix;
        }
        return text;
      },
    },
    {
      title: "标签",
      dataIndex: "mark",
      key: "mark",
    },
    {
      title: "状态",
      dataIndex: "isLegal",
      key: "isLegal",
      render: (isLegal: boolean) => {
        return isLegal ?
          <Tag color="green">正常</Tag>  :
          <Tag color="red">已封禁</Tag>;
      }
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      align: "center" as const,
      render: (text: string, record: ArticleObject) => (
        <div className="text-red-800 flex items-center justify-center font-bold cursor-pointer" onClick={() => {
          console.log(record);
          setArticle(record);
          setOpened(true);
        }}>预览</div>
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
        dataSource={articles.map((article) => ({...article, key: article._id}))}
        pagination={false}
      />
      {pagination}
      <PopWindow opened={opened} onClose={() => {
        setOpened(false);
      }}>
        <Article article={article} onSubmit={() => {
          refreshArticle().then();
          setOpened(false);
        }}/>
      </PopWindow>
    </div>
  </>;
}

export default Review;
