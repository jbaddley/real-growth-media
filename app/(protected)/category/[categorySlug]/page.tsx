"use client";
import { TextInput, Label, Button, ListGroup } from "flowbite-react";
import { useForm } from "react-hook-form";
import { Article } from "@prisma/client";
import { Fetcher } from "../../../lib/fetcher";
import { useArticles } from "../../../lib/hooks/use-articles";
import { kebabCase, startCase } from "lodash";
import { redirect, useParams, useRouter } from "next/navigation";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { IoCloseCircleSharp } from "react-icons/io5";
import TwoColumnLeft from "../../../components/TwoColumnLeft";

const CreateArticle = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const { categorySlug } = useParams();

  const { articles, isLoading, mutate } = useArticles(categorySlug);

  const createArticle = async (article: Partial<Article>) => {
    article.slug = kebabCase(article.slug);
    try {
      const res = await Fetcher.post<Article, Partial<Article>>(`/api/category/${categorySlug}/article`, article);
      if (res.status !== "ok") {
        throw new Error(res.message);
      }
      const redirectTo = `/category/${categorySlug}/article/${res.data.slug}`;
      router.replace(redirectTo);
    } catch (error) {
      console.error("Failed to create article:", error);
    }
  };

  const handleDelete = (article: Article) => async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await Fetcher.delete<Article>(`/api/category/${categorySlug}/article/${article.slug}`);
    mutate();
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Category", path: "/category" },
          { label: startCase(categorySlug), path: `/category/${categorySlug}` },
        ]}
      />
      <TwoColumnLeft>
        <ListGroup>
          {articles.map((article: Article) => (
            <ListGroup.Item
              style={{ position: "relative" }}
              key={article.id}
              href={`/category/${categorySlug}/article/${article.slug}`}
            >
              <p>{startCase(article.slug)}</p>{" "}
              <IoCloseCircleSharp
                style={{ position: "absolute", top: -6, right: -6 }}
                onClick={handleDelete(article)}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
        <form onSubmit={handleSubmit(createArticle)} className='w-full max-w-xl rounded-lg bg-white p-6 shadow-md'>
          <div className='form-group'>
            <Label htmlFor='slug' className='form-label'>
              Slug
            </Label>
            <TextInput type='text' id='slug' {...register("slug", { required: true })} />
          </div>
          <Button type='submit' className='btn btn-primary'>
            Submit
          </Button>
        </form>
      </TwoColumnLeft>
    </>
  );
};

export default CreateArticle;
