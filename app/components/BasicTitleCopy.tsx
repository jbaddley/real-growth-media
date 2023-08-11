"use client";

import { useCallback, useEffect, useState } from "react";
import { Fetcher } from "../lib/fetcher";

interface Ad {
  id: number;
  title: string;
  copy: string[];
  loading?: boolean;
}

interface Context {
  context?: string;
  title?: string;
}

interface BasicTitleCopyProps {
  context: string;
}

export default function BasicTitleCopy({ context }: BasicTitleCopyProps) {
  const [ads, setAds] = useState<Ad[]>(JSON.parse(globalThis.localStorage.getItem("pro-peak-ai-ads") || "[]"));
  const [ad, setAd] = useState<Ad>(JSON.parse(globalThis.localStorage.getItem("pro-peak-ai-ad") || "{}"));

  const handleGetCopy = (id: number, title: string) => {
    return () => {
      setAd({ id, title, loading: true, copy: [] });
      Fetcher.post<string[], Context>(`/api/ai/titles/${id}/copy`, { context, title }).then((c) => {
        setAd({ id, title, copy: c.data });
      });
    };
  };

  const handleGetTitles = useCallback(() => {
    Fetcher.post<Ad[], Context>("/api/ai/titles", { context }).then((c) => {
      setAds(c.data);
    });
  }, [context]);

  useEffect(() => {
    const currentContext = globalThis.localStorage.getItem("pro-peak-ai-context");
    if (context !== currentContext) {
      localStorage.setItem("pro-peak-ai-context", context);
    }
  }, [context]);

  useEffect(() => {
    localStorage.setItem("pro-peak-ai-ads", JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem("pro-peak-ai-ad", JSON.stringify(ad));
  }, [ad]);

  return (
    <div>
      <button onClick={handleGetTitles}>Regenerate Ad Titles</button>
      <div className='flex h-screen'>
        <div className='w-1/4 overflow-y-auto bg-gray-200'>
          {ads.map(({ id, title }) => (
            <div
              key={id}
              onClick={handleGetCopy(id, title)}
              className={`cursor-pointer p-4 hover:bg-gray-300 ${ad?.id === id ? "bg-gray-400" : ""}`}
            >
              {title}
            </div>
          ))}
        </div>

        <div className='w-3/4 overflow-y-auto bg-gray-100 p-8'>
          <div>
            <h1 className='mb-4 text-2xl'>{ad.title}</h1>
            {ad.loading
              ? "Loading"
              : ad.copy?.map((c) => (
                  <div key={c} className='mb-4'>
                    <p className='mb-4 mt-4'>{c}</p>
                    <hr />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
