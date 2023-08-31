"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import RoasCalc, { StorageInput, defaultInput } from "../../components/RoasCalc";
import { Button, Tabs } from "flowbite-react";

const defaultTabs: Record<string, StorageInput> = {
  defaultTab: {
    displayName: "ROAS Calc Default",
    input: {},
  },
};

const getInitial = (): Record<string, StorageInput> => {
  const stored = localStorage.getItem("pp-roas-calc");
  if (!stored) {
    return defaultTabs;
  }
  return JSON.parse(stored);
};

export default function () {
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

  const handleChange = (name: string, displayName: string) => {
    const newTabs = { ...tabs };
    newTabs[name].displayName = displayName;
    setTabs(newTabs);
  };

  const handleDelete = (name: string) => {
    const newTabs = { ...tabs };
    delete newTabs[name];
    setTabs(newTabs);
    setActiveTab(Object.keys(newTabs)[0]);
  };

  return (
    <div className='px-4'>
      <Tabs.Group>
        {Object.entries(tabs).map(([key, value]) => (
          <Tabs.Item active={key === activeTab} title={value.displayName}>
            <RoasCalc
              onChange={handleChange}
              onDelete={handleDelete}
              name={key}
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
