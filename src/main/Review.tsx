import React, {useEffect} from "react";
import {Carousel, Divider, Image, Table} from "antd";
import Pagination from "../partials/Pagination";
import CONSTANTS, {testArticleDetail, testArticles} from "../utils/constants";
import PopWindow from "../partials/PopWindow";

interface ArticleObject {
  id: string;
  title: string;
  author: string;
}

interface ArticleDetailObject extends ArticleObject {
  content: string[];
  images?: string[];
}

interface ArticleProps {
  article: ArticleDetailObject | null;
  onSubmit: () => void;
}

function Article(props: ArticleProps) {
  const article = props.article;
  if (!article) {
    return <></>;
  }

  function approve() {
    console.log(`approve article ${article?.id}`);
    props.onSubmit();
  }

  function reject() {
    console.log(`reject article ${article?.id}`);
    props.onSubmit();
  }

  return <>
    <div className="text-center font-bold text-5xl mb-4">{article.title}</div>
    <div className="mb-6 text-lg">作者：{article.author}</div>
    {
      article.images &&
      <Carousel className="rounded-2xl" autoplay={false}
        style={{backgroundColor: "rgba(0,0,0,0.1)", width: "35rem", height: "35rem"}}>
        {
          article.images.map((image) => (
            <div className="m-auto" key={image}>
              <Image className="object-scale-down" src={image} width={"35rem"} height={"35rem"}
                preview={false}
                fallback={CONSTANTS.fallbackImg}/>
            </div>
          ))
        }
      </Carousel>
    }
    <div className="text-left mt-6 text-lg" style={{width: "40rem"}}>
      {article.content.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
    <Divider/>
    <div className="mt-6">
      <button
        className="bg-green-100 font-bold text-xl px-6 py-2 rounded-xl mx-10 hover:bg-green-800 hover:text-white duration-300"
        onClick={() => {
          approve();
        }}>通过
      </button>
      <button
        className="bg-red-100 font-bold text-xl px-6 py-2 rounded-xl mx-10 hover:bg-red-800 hover:text-white duration-300"
        onClick={() => {
          reject();
        }}>拒绝
      </button>
    </div>
  </>;
}

function Review() {
  const [articles, setArticles] = React.useState<ArticleObject[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [article, setArticle] = React.useState<ArticleDetailObject | null>(null);
  const [opened, setOpened] = React.useState(false);

  useEffect(() => {
    refreshArticle();
  }, [page, pageSize]);

  function refreshArticle() {
    console.log(`refresh user at page ${page} with size ${pageSize}`);
    setArticles(testArticles(pageSize));
    setTotal(22);
    // setArticle(null);
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "文章名称",
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
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      align: "right" as const,
      render: (text: string, record: ArticleObject) => (
        <div className="text-red-800 font-bold cursor-pointer" onClick={() => {
          console.log(record);
          setArticle(testArticleDetail(record.id));
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
        dataSource={articles.map((article) => ({...article, key: article.id}))}
        pagination={false}
      />
      {pagination}
      <PopWindow opened={opened} onClose={() => {
        setOpened(false);
      }}>
        <Article article={article} onSubmit={() => {
          refreshArticle();
          setOpened(false);
        }}/>
      </PopWindow>
    </div>
  </>;
}

export default Review;
