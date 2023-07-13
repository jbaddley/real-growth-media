"use client";
import { ListGroup } from "flowbite-react";
import { Article } from "@prisma/client";
import { useParams } from "next/navigation";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { startCase } from "lodash";
import TwoColumnLeft from "../../../../components/TwoColumnLeft";
import { useArticles } from "../../../../lib/hooks/use-articles";
import { IoCloseCircleSharp } from "react-icons/io5";

const Articles = () => {
  const { categorySlug } = useParams();
  const { articles } = useArticles(categorySlug);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Category", path: "/category" },
          { label: startCase(categorySlug), path: `/category/${categorySlug}` },
          { label: "Article", path: `/category/${categorySlug}/article` },
        ]}
      />
      <TwoColumnLeft>
        <ListGroup>
          {articles.map((article: Article) => (
            <ListGroup.Item
              className='relative'
              key={article.id}
              href={`/category/${categorySlug}/article/${article.slug}`}
            >
              <p>{startCase(article.slug)}</p>{" "}
              <IoCloseCircleSharp style={{ position: "absolute", top: -6, right: -6 }} />
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div>Cool Right?</div>
      </TwoColumnLeft>
    </>
  );
};

export default Articles;
