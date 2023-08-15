"use client";
import { Tabs } from "flowbite-react";
import AdIdeas from "../../components/AdIdeas";
import ManageContexts from "../../components/ManageContexts";
import useSWR from "swr";
import { Fetcher } from "../../lib/fetcher";
import { Context } from "@prisma/client";
import { useLocalStorage } from "../../lib/hooks/useLocalStorage";
import LoadingOverlay from "../../components/LoadingOverlay";

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
    <section className='relative flex-row'>
      <LoadingOverlay loading={isLoading} />
      <div className='mb-8 flex'>
        <div className='grow'>
          <h1 className='text-2xl font-semibold tracking-tight'>Pro Peak AI Tool</h1>
          <p>Simple AI Tool for Generating Marketing Ideas</p>
        </div>
        <ManageContexts onChange={setContextId} value={contextId} context={context} />
      </div>
      <div>
        <Tabs.Group>
          <Tabs.Item title='Ad Ideas'>
            <AdIdeas contextId={context?.id} />
          </Tabs.Item>
          <Tabs.Item title='Basic Ad Titles'></Tabs.Item>
        </Tabs.Group>
      </div>
    </section>
  );
}
