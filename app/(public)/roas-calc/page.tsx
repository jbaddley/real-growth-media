"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import RoasCalc, { StorageInput, defaultInput } from "../../components/RoasCalc";
import { Button, Tabs } from "flowbite-react";
import useSWR from "swr";
import { Fetcher } from "../../lib/fetcher";
import { Contact } from "@prisma/client";

const defaultTabs: Record<string, StorageInput> = {
  defaultTab: {
    displayName: "ROAS Calc Default",
    input: {},
  },
};

const getInitial = (): Record<string, StorageInput> => {
  const stored = globalThis.localStorage.getItem("pp-roas-calc");
  if (!stored) {
    return defaultTabs;
  }
  return JSON.parse(stored);
};

export default function () {
  const email = useMemo(() => {
    const search = new URLSearchParams(globalThis.window.location.search);
    return search.get("email");
  }, [globalThis.window.location.search]);

  const { data: contact, isLoading } = useSWR(["contact", email], async () => {
    if (!email) {
      return undefined;
    }
    const { data } = await Fetcher.get<Contact>(`/api/webhooks/contacts?`);
    return data;
  });

  const [tabs, setTabs] = useState<Record<string, StorageInput>>(getInitial());
  const [activeTab, setActiveTab] = useState<string>();

  const handleAddTab = useCallback(() => {
    const count = Object.keys(tabs).length;
    const name = `tab${count}`;
    const newTabs = { ...tabs };
    newTabs[name] = {
      input: defaultInput,
      displayName: `ROAS Calc ${count + 1}`,
    };
    setTabs(newTabs);
    setActiveTab(name);
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem("pp-roas-calc", JSON.stringify(tabs));
  }, [tabs]);

  const handleChange = (name: string, storageInput: StorageInput) => {
    const newTabs = { ...tabs };
    newTabs[name] = storageInput;
    setTabs(newTabs);
  };

  const handleDelete = (name: string) => {
    const newTabs = { ...tabs };
    delete newTabs[name];
    setTabs(newTabs);
    setActiveTab(Object.keys(newTabs)[0]);
  };

  const handleCopy = (name: string) => {
    const newTabs = { ...tabs };
    const copy = { ...newTabs[name] };
    copy.displayName = `${copy.displayName} (Copy)`;
    const count = Object.keys(tabs).length;
    copy.name = `tab${count + 1}`;
    newTabs[copy.name] = copy;
    setTabs(newTabs);
    setActiveTab(copy.name);
  };
  const getVideo = () => {
    if (isLoading) {
      return null;
    }
    if (contact?.watchedRoas) {
      return <h1>{contact.email}: YOU WATCHED THE VIDEO</h1>;
    }
    return <h1>YOU DIDN'T WATCH THE VIDEO</h1>;
  };

  return (
    <div className='p-2'>
      {getVideo()}
      <Tabs.Group>
        {Object.entries(tabs).map(([key, value]) => (
          <Tabs.Item active={key === activeTab} title={value.displayName}>
            <RoasCalc
              onChange={handleChange}
              onDelete={handleDelete}
              onCopy={handleCopy}
              name={key}
              storageInputs={tabs[key]}
              copyNames={Object.keys(tabs)
                .filter((tab) => tab !== key)
                .map((key) => tabs[key])}
            />
          </Tabs.Item>
        ))}
        <Tabs.Item title={<Button onClick={handleAddTab}>+</Button>} />
      </Tabs.Group>
    </div>
  );
}
