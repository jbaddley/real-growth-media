"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import RoasCalc, { StorageInput, defaultInput } from "../../components/RoasCalc";
import { Button, Modal, Tabs } from "flowbite-react";
import useSWR from "swr";
import { Fetcher } from "../../lib/fetcher";
import { Contact } from "@prisma/client";
const videoSrc = "https://storage.googleapis.com/msgsndr/nrw8M8zQccEYIjAMiR22/media/64f0ef8a1181e8f643212216.mp4";
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
  const [open, setOpen] = useState<boolean>(false);

  const email = useMemo(() => {
    const search = new URLSearchParams(globalThis.window.location.search);
    return search.get("email");
  }, [globalThis.window.location.search]);

  const { data: contact, isLoading } = useSWR(["contact", email], async () => {
    if (!email) {
      return undefined;
    }
    const { data } = await Fetcher.get<Contact>(`/api/webhooks/contacts?email=${email}`);
    return data;
  });

  useEffect(() => {
    if (!isLoading && contact?.watchedRoas !== "100%") {
      setOpen(true);
    }
  }, [contact, isLoading]);
  const [tabs, setTabs] = useState<Record<string, StorageInput>>(getInitial());
  const [activeTab, setActiveTab] = useState<string>();

  const handleAddTab = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      const count = Object.keys(tabs).length;
      const name = `tab${count}`;
      const newTabs = { ...tabs };
      newTabs[name] = {
        input: defaultInput,
        displayName: `ROAS Calc ${count + 1}`,
      };
      setTabs(newTabs);
      setActiveTab(name);
    },
    [tabs]
  );

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

  const activeTabIndex = useMemo(() => {
    return Object.keys(tabs).findIndex((tab) => tab === activeTab);
  }, [tabs, activeTab]);

  const handleCaptureEnded = async () => {
    await Fetcher.post("/api/webhooks/contacts", { email, watchedRoas: "100%" });
    setOpen(false);
  };

  return (
    <div className='p-2'>
      <Tabs.Group tabIndex={activeTabIndex}>
        {Object.entries(tabs).map(([key, value]) => (
          <Tabs.Item key={key} active={key === activeTab} title={value.displayName}>
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
      <Modal show={open} onClose={() => setOpen(false)} size={"5xl"}>
        <Modal.Header>Quick Demo!</Modal.Header>
        <Modal.Body>{open && <video src={videoSrc} controls autoFocus onEnded={handleCaptureEnded} />}</Modal.Body>
      </Modal>
    </div>
  );
}
