"use client";

import { useState } from "react";
import { Tabs } from "flowbite-react";
import BasicTitleCopy from "../../components/BasicTitleCopy";

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
