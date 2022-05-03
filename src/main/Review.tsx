import React, {useEffect} from "react";
import {Carousel, Divider, Image, Table} from "antd";
import Pagination from "../partials/Pagination";
import {testArticleDetail, testArticles} from "../utils/constants";
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
                fallback="data:image/png;base64,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"/>
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
