"use client";
import { Tabs, TextInput } from "flowbite-react";
import emojis from "../../lib/emoticons";
import _ from "lodash";
import { useMemo, useState } from "react";

function CopyEmojis({ list = [] }: { list: { title: string; value: string }[] }) {
  const handleCopy = (emoticon: string) => () => {
    navigator.clipboard.writeText(emoticon).then(
      () => {
        console.log(`Copied ${emoticon}`);
      },
      () => {
        console.error(`Failed to copy ${emoticon}`);
      }
    );
  };
  return (
    <div className='flex max-w-full flex-wrap overflow-auto'>
      {list.map(({ title, value }) => (
        <div className='emoji-item m-4 cursor-pointer text-3xl' title={title} onClick={handleCopy(value)}>
          {value}
        </div>
      ))}
    </div>
  );
}

export default function Emojis() {
  const [search, setSearch] = useState<string>();
  const searchResults = useMemo(() => {
    if (!search) {
      return [];
    }
    const s = search?.toLowerCase();
    return Object.values(emojis).reduce((p, c) => {
      return [...p, ...c.filter(({ title }) => title.includes(s))];
    }, []);
  }, [search, emojis]);
  return (
    <Tabs.Group className='m-4'>
      {Object.entries(emojis).map(([key, values]) => (
        <Tabs.Item title={_.startCase(key)} key={key}>
          <CopyEmojis list={values} />
        </Tabs.Item>
      ))}
      <Tabs.Item title='Search'>
        <TextInput onChange={({ target: { value } }) => setSearch(value)} />
        <CopyEmojis list={searchResults} />
      </Tabs.Item>
    </Tabs.Group>
  );
}
