"use client";
import { TextInput, Label, Button, Modal } from "flowbite-react";
import { useForm } from "react-hook-form";
import { Article, ArticleContent } from "@prisma/client";
import { useParams } from "next/navigation";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import { startCase } from "lodash";
import useSWR from "swr";
import { Fetcher } from "../../../../../lib/fetcher";
import ContentTable from "./ContentTable";
import { useState } from "react";
import ContentEditor from "./ContentEditor";

const CreateArticleContent = () => {
  const { articleSlug, categorySlug } = useParams();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editContentId, setEditContentId] = useState<string>();
  const { register, handleSubmit } = useForm();
  const url = `/api/category/${categorySlug}/article/${articleSlug}/article-content`;

  const { data: { data: articleContent } = {}, mutate } = useSWR(url, (u) => Fetcher.get<ArticleContent[]>(u));

  const handleAddContent = async () => {
    await Fetcher.post<ArticleContent, Partial<ArticleContent>>(url, {});
    mutate();
  };

  const handleEdit = (id: string) => {
    setOpenModal(true);
    setEditContentId(id);
  };

  const handleSaveCTAUrl = async (article: Partial<Article>) => {
    await Fetcher.put<ArticleContent, Partial<Article>>(
      `/api/category/${categorySlug}/article/${articleSlug}`,
      article
    );
  };

  return (
    <div className='m-5 mx-auto max-w-4xl rounded border bg-white p-7 shadow-md'>
      <Breadcrumbs
        items={[
          { label: "Category", path: "/category" },
          { label: startCase(categorySlug), path: `/category/${categorySlug}` },
          { label: "Article", path: `/category/${categorySlug}/article` },
          { label: startCase(articleSlug), path: `/${articleSlug}` },
        ]}
      />
      <div className='my-4'>
        <form onSubmit={handleSubmit(handleSaveCTAUrl)}>
          <Label>Affiliate Link</Label>
          <div className='flex'>
            <TextInput {...register("callToActionUrl")} />
            <Button className='mx-3' type='submit'>
              Save
            </Button>
          </div>
        </form>
      </div>
      <div>
        {articleContent?.length ? (
          <div>
            <ContentTable
              onEdit={handleEdit}
              content={articleContent}
              previewLink={`/${categorySlug}/${articleSlug}`}
            />
          </div>
        ) : (
          <Button onClick={handleAddContent}>Add Content</Button>
        )}

        <ContentEditor
          onClose={() => {
            mutate();
            setOpenModal(false);
          }}
          open={openModal}
          contentId={editContentId}
          articleSlug={articleSlug}
          categorySlug={categorySlug}
        />
      </div>
    </div>
  );
};

export default CreateArticleContent;
