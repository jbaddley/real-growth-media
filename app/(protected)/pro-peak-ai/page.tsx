"use client";
import { Tabs } from "flowbite-react";
import BasicTitleCopy from "../../components/BasicTitleCopy";
import ManageContexts from "../../components/ManageContexts";
import useSWR from "swr";
import { useState } from "react";
import { Fetcher } from "../../lib/fetcher";
import { Context } from "@prisma/client";
import { useLocalStorage } from "../../lib/hooks/useLocalStorage";

export default function ProPeakAIPage() {
  const [contextId, setContextId] = useLocalStorage<string>("contextId");

  const { data: context, isLoading } = useSWR(["context", contextId], async () => {
    if (!contextId) {
      return undefined;
    }
    const { data } = await Fetcher.get<Context>(`/api/ai/contexts/${contextId}`);
    return data;
  });
  return (
    <section className='flex-row'>
      <div className='mb-8 flex'>
        <div className='grow'>
          <h1 className='text-2xl font-semibold tracking-tight'>Pro Peak AI Tool</h1>
          <p>Simple AI Tool for Generating Marketing Ideas</p>
        </div>
        <ManageContexts onChange={setContextId} value={contextId} context={context} />
      </div>
      <div>
        <Tabs.Group>
          <Tabs.Item title='Basic Ad Titles'>
            <BasicTitleCopy contextId={context?.id} />
          </Tabs.Item>
          <Tabs.Item title='Basic Ad Titles'></Tabs.Item>
        </Tabs.Group>
      </div>
    </section>
  );
}
