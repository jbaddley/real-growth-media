import useSWR from "swr";
import { Fetcher } from "../../../../../lib/fetcher";
import { ArticleContentExpanded } from "../../../../../lib/types/ArticleContentExpanded";
import { Button, Label, Modal, Select, Spinner, TextInput, Textarea } from "flowbite-react";
import { useEffect, useRef } from "react";
import { ArticleContent } from "@prisma/client";
import { ArticleContentFields } from "../../../../../lib/types/ArticleContentFields";
import { useForm } from "react-hook-form";

export default function ContentEditor({
  open,
  categorySlug,
  articleSlug,
  contentId,
  onClose,
}: {
  categorySlug: string;
  open: boolean;
  articleSlug: string;
  contentId?: string;
  onClose: () => void;
}) {
  const { register, getValues, setValue } = useForm();
  const {
    mutate,
    data: { data: content } = {},
    isLoading,
  } = useSWR(
    !contentId ? null : `/api/category/${categorySlug}/article/${articleSlug}/article-content/${contentId}`,
    (u) => Fetcher.get<ArticleContentExpanded>(u)
  );

  const handleSaveContent = async (values: ArticleContentFields) => {
    await Fetcher.put<ArticleContent, ArticleContentFields>(
      `/api/category/${categorySlug}/article/${articleSlug}/article-content/${contentId}`,
      values
    );
    mutate();
    onClose();
  };

  useEffect(() => {
    setValue("title", content?.title?.title);
    setValue("content", content?.content?.content);
    setValue("type", content?.type?.type);
    setValue("hero", content?.hero?.url);
    setValue("callToAction", content?.callToAction?.text);
  }, [content]);

  const handleSubmit = () => {
    handleSaveContent(getValues());
  };

  if (!content || (!isLoading && !content)) {
    return <div>No Content Found</div>;
  }

  if (isLoading) {
    return (
      <div>
        <Spinner size={"xl"} aria-label='Loading article content' />
        <span className='pl-3'>Loading...</span>
      </div>
    );
  }

  return (
    <Modal size={"7xl"} show={open} onClose={onClose}>
      <Modal.Header>Edit Content</Modal.Header>
      <Modal.Body>
        <form>
          <div className='mb-2 block'>
            <Label htmlFor='title'>Title</Label>
            <TextInput id='title' {...register("title", { required: true })} />
          </div>
          <div className='mb-2 block'>
            <Label htmlFor='hero'>Hero</Label>
            <TextInput id='hero' {...register("hero")} />
          </div>
          <div className='mb-2 block'>
            <Label htmlFor='content'>Content</Label>
            <Textarea rows={6} {...register("content")} />
          </div>
          <div className='mb-2 block'>
            <Label htmlFor='callToAction'>Call to Action</Label>
            <TextInput id='callToAction' {...register("callToAction")} />
          </div>
          <div className='mb-2 block'>
            <Label htmlFor='articleType'>Article Type</Label>
            <Select id='articleType' {...register("articleType")}>
              <option value='article'>Article</option>
              <option value='vsl'>VSL</option>
              <option value='advertorial'>Advertorial</option>
            </Select>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Save</Button>
        <Button color='gray' onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
