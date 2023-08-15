"use client";

import { useCallback, useMemo, useState } from "react";
import { Fetcher } from "../lib/fetcher";
import useSWR from "swr";
import { AdCopy, AdTitle } from "@prisma/client";
import LoadingOverlay from "./LoadingOverlay";
import { Pagination, TextInput } from "flowbite-react";
import { FaTrash } from "react-icons/fa";
import Button from "./Button";
import { useLocalStorage } from "../lib/hooks/useLocalStorage";
import { buildQS } from "../lib/query";

interface BasicTitleCopyProps {
  contextId: string;
}

export default function BasicTitleCopy({ contextId }: BasicTitleCopyProps) {
  const [titleId, setTitleId] = useLocalStorage<string | undefined>("pp-titleId");
  const [brand, setBrand] = useLocalStorage<string | undefined>("pp-brand");
  const [model, setModel] = useLocalStorage<string | undefined>("pp-model");
  const [currentPage, setCurrentPage] = useLocalStorage<number>("pp-copyPageNum", 1);
  const [generatingCopyIdeas, setGeneratingCopyIdeas] = useState<boolean>(false);
  const [generatingTitleIdeas, setGeneratingTitleIdeas] = useState<boolean>(false);

  const query = useMemo(() => {
    return buildQS({
      brand,
      model,
    });
  }, [brand, model]);

  const {
    data: titles = [],
    isLoading: titlesAreLoading,
    mutate: mutateTitles,
  } = useSWR(["titles", contextId], async () => {
    console.log({ contextId });
    setTitleId(undefined);
    setCurrentPage(1);
    if (!contextId) {
      return [];
    }
    const { data } = await Fetcher.get<AdTitle[]>(`/api/ai/contexts/${contextId}/titles`);
    return data || [];
  });

  const {
    data: copyIdeas,
    isLoading: copyIdeasAreLoading,
    mutate: mutateCopyIdeas,
  } = useSWR(["copyIdeas", contextId, titleId, query], async () => {
    if (!titleId) {
      return [];
    }
    const { data } = await Fetcher.get<AdCopy[]>(`/api/ai/contexts/${contextId}/titles/${titleId}/copy`);
    return data;
  });

  const title = useMemo(() => {
    if (!titleId) {
      return null;
    }
    return titles?.find((t) => t.id === titleId);
  }, [titleId, titles]);

  const copy = useMemo(() => {
    return copyIdeas?.[currentPage - 1];
  }, [copyIdeas, currentPage]);

  const handleGetCopy = (id: string) => {
    return () => {
      setCurrentPage(1);
      setTitleId(id);
    };
  };

  const handleGenerateCopy = useCallback(() => {
    setGeneratingCopyIdeas(true);
    Fetcher.get<AdCopy[]>(`/api/ai/contexts/${contextId}/titles/${titleId}/copy/generate?${query}`).then((c) => {
      mutateCopyIdeas();
      setGeneratingCopyIdeas(false);
    });
  }, [titleId, query]);

  const handleGetTitles = useCallback(() => {
    setGeneratingTitleIdeas(true);
    Fetcher.get<AdTitle[]>(`/api/ai/contexts/${contextId}/titles/generate?${query}`).then((c) => {
      mutateTitles();
      setGeneratingTitleIdeas(true);
    });
  }, [contextId, query]);

  const totalPages = useMemo(() => {
    return copyIdeas?.length;
  }, [copyIdeas, titleId]);

  const handleDeleteTitle = (id: string) => async (e) => {
    e.stopPropagation(0);
    await Fetcher.delete(`/api/ai/contexts/${contextId}/titles/${id}`);
    mutateTitles();
  };

  return (
    <div>
      <div className='mb-4 flex'>
        <Button color='gray' onClick={handleGetTitles}>
          {titles.length ? "More" : "Generate"} Ad Title Ideas
        </Button>
        <TextInput
          placeholder='brand'
          value={brand}
          name='brand'
          onChange={({ target: { value } }) => setBrand(value)}
        />
        <TextInput
          placeholder='model'
          value={model}
          name='model'
          onChange={({ target: { value } }) => setModel(value)}
        />
      </div>
      <div className='flex h-screen'>
        <div className='relative w-1/4 overflow-y-auto bg-gray-200'>
          <LoadingOverlay loading={titlesAreLoading || generatingTitleIdeas} loadingText={"Generating Title Ideas"} />
          {titles?.map(({ id, headline, preHeadline, subHeadline }) => (
            <div
              key={id}
              onClick={handleGetCopy(id)}
              className={`cursor-pointer p-4 hover:bg-gray-300 ${titleId === id ? "bg-gray-400" : ""}`}
            >
              <p className='text-xs italic'>{preHeadline}</p>
              <p className='bold text-base'>{headline}</p>
              <p className='ml-4 text-xs'>{subHeadline}</p>
              <div className='mt-4 text-right'>
                <FaTrash onClick={handleDeleteTitle(id)} />
              </div>
            </div>
          ))}
        </div>

        <div className='relative w-3/4 overflow-y-auto bg-gray-100 p-8'>
          <LoadingOverlay loading={copyIdeasAreLoading || generatingCopyIdeas} loadingText={"Generating Copy Ideas"} />
          <div>
            <h1 className='mb-4 text-2xl'>
              <p className='text-base italic'>{title?.preHeadline}</p>
              <p className='bold text-2xl'>{title?.headline}</p>
              <p className='text-base'>{title?.subHeadline}</p>
            </h1>
            {copyIdeas?.length ? (
              <>
                <div className='h-64'>
                  <div>{copy ? copy.content : "Select a Page"}</div>
                </div>
                <div className='flex'>
                  <div className='flex grow align-middle'>
                    <div className='p-3 align-middle leading-7'>
                      {currentPage} of {copyIdeas?.length}
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      onPageChange={(page) => {
                        setCurrentPage(page);
                      }}
                      layout='navigation'
                      totalPages={totalPages}
                    />
                  </div>
                  <div>{titleId && <Button onClick={handleGenerateCopy}>More Copy Ideas</Button>}</div>
                </div>
              </>
            ) : (
              <div>{titleId && <Button onClick={handleGenerateCopy}>Generate Copy Ideas</Button>}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
