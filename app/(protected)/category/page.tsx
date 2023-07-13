"use client";
import { TextInput, Label, Button, ListGroup } from "flowbite-react";
import { useForm } from "react-hook-form";
import { Category } from "@prisma/client";
import { Fetcher } from "../../lib/fetcher";
import { useCategories } from "../../lib/hooks/use-category";
import { redirect } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import { kebabCase } from "lodash";

const CreateCategory = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { categories, isLoading } = useCategories();

  const createCategory = async (category: Partial<Category>) => {
    try {
      const res = await Fetcher.post<Category, Partial<Category>>("/api/category", category);
      if (res.status !== "ok") {
        throw new Error(res.message);
      }
      console.log({ category: res.data });
      redirect(`/category/${category.slug}`);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Category", path: "/category" }]} />
      <div className='flex flex-row gap-4'>
        <section>
          <ListGroup>
            {categories.map((cat: Category) => (
              <ListGroup.Item key={cat.id} href={`/category/${cat.slug}`}>
                <p>{cat.title}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </section>
        <form onSubmit={handleSubmit(createCategory)} className='w-full max-w-xl rounded-lg bg-white p-6 shadow-md'>
          <div className='form-group'>
            <Label htmlFor='title' className='form-label'>
              Title
            </Label>
            <TextInput
              onBlur={(e) => setValue("slug", kebabCase(e.target.value))}
              type='text'
              id='title'
              {...register("title", { required: true })}
            />
          </div>
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
      </div>
    </>
  );
};

export default CreateCategory;
