"use client";

import { useCallback, useMemo, useState } from "react";
import { Fetcher } from "../lib/fetcher";
import useSWR from "swr";
import { AdCopy, BrandIdea } from "@prisma/client";
import LoadingOverlay from "./LoadingOverlay";
import { Pagination, TextInput } from "flowbite-react";
import { FaTrash } from "react-icons/fa";
import Button from "./Button";
import { useLocalStorage } from "../lib/hooks/useLocalStorage";

interface BrandIdeasProps {
  contextId: string;
}

export default function BrandIdeasPage({ contextId }: BrandIdeasProps) {
  const [brandId, setBrandId] = useLocalStorage<string | undefined>("pp-brandId");
  const [prompt, setPrompt] = useLocalStorage<string>("pp-brand-prompt");
  const [generatingBrandIdeas, setGeneratingBrandIdeas] = useState<boolean>(false);

  const {
    data: brands = [],
    isLoading: brandsAreLoading,
    mutate: mutateBrands,
  } = useSWR(["brands", contextId], async () => {
    if (!contextId) {
      return [];
    }
    const { data } = await Fetcher.get<BrandIdea[]>(`/api/ai/contexts/${contextId}/brands`);
    return data || [];
  });

  const brand = useMemo(() => {
    if (!brandId) {
      return null;
    }
    return brands?.find((t) => t.id === brandId);
  }, [brandId, brands]);

  const handleGetBrands = useCallback(() => {
    setGeneratingBrandIdeas(true);
    Fetcher.post<BrandIdea[], { prompt?: string; promptId?: string }>(`/api/ai/contexts/${contextId}/brands/generate`, {
      prompt,
    }).then((c) => {
      mutateBrands();
      setGeneratingBrandIdeas(false);
    });
  }, [contextId, prompt]);

  const handleDeleteBrand = (id: string) => async (e) => {
    e.stopPropagation(0);
    await Fetcher.delete(`/api/ai/contexts/${contextId}/brands/${id}`);
    mutateBrands();
  };

  return (
    <div className='overflow-hidden'>
      <div className='mb-4 flex'>
        <div>
          <TextInput value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <Button color='gray' onClick={handleGetBrands}>
            Generate Ad Brand Ideas
          </Button>
        </div>
      </div>
      <div className='flex'>
        <div className='relative overflow-y-auto bg-gray-100'>
          <LoadingOverlay loading={brandsAreLoading || generatingBrandIdeas} loadingText={"Generating Brand Ideas"} />
          {brands?.map(({ id, content }) => (
            <div key={id} className={`cursor-pointer p-4 hover:bg-gray-200 ${brandId === id ? "bg-gray-300" : ""}`}>
              <p className='bold text-base'>{content}</p>
              <div className='mt-4 text-right'>
                <FaTrash onClick={handleDeleteBrand(id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
