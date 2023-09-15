"use client";
import { Tabs, TextInput } from "flowbite-react";
import emojis from "../../lib/emoticons";
import _ from "lodash";
import { useMemo, useState } from "react";

function CopyEmojis({
  list = [],
  onCopy,
}: {
  onCopy: (emoticon: string) => void;
  list: { title: string; value: string }[];
}) {
  const handleCopy = (emoticon: string) => () => {
    onCopy?.(emoticon);
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
  const [copied, setCopied] = useState<string>();
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
    <div>
      <div className='text-right text-2xl'>
        <span>{!!copied ? `Just copied: ${copied}` : "Click an emoji to copy"}</span>
      </div>
      <Tabs.Group className='m-4'>
        {Object.entries(emojis).map(([key, values]) => (
          <Tabs.Item title={_.startCase(key)} key={key}>
            <CopyEmojis onCopy={setCopied} list={values} />
          </Tabs.Item>
        ))}
        <Tabs.Item title='Search'>
          <TextInput onChange={({ target: { value } }) => setSearch(value)} />
          <CopyEmojis onCopy={setCopied} list={searchResults} />
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}
