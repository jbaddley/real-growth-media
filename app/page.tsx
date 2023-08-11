"use client";

import { useCallback, useEffect, useState } from "react";
import { Fetcher } from "./lib/fetcher";

import { Tabs } from "flowbite-react";
import BasicTitleCopy from "./components/BasicTitleCopy";
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

export default function Home() {
  const [context, setContext] = useState<string>(globalThis.localStorage.getItem("pro-peak-ai-context") || "");

  const handleChangeContext = ({ target: { value } }) => {
    setContext(value);
  };

  return (
    <section className='flex-row'>
      <div className='container h-48 flex-none'>
        <h1 className='text-2xl font-semibold tracking-tight'>Pro Peak AI Tool</h1>
        <h2>Advanced AI Tool For Marketing</h2>
        <textarea value={context} onChange={handleChangeContext}></textarea>
      </div>
      <div className='container'>
        <Tabs.Group>
          <Tabs.Item title='Basic Ad Titles'>
            <BasicTitleCopy context={context} />
          </Tabs.Item>
          <Tabs.Item title='Basic Ad Titles'>
            <BasicTitleCopy context={context} />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </section>
  );
}
