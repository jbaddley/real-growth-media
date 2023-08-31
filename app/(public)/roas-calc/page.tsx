"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import RoasCalc, { StorageInput, defaultInput } from "../../components/RoasCalc";
import { Button, Tabs } from "flowbite-react";

interface ROASInput {
  costPerLead?: number;
  conversionRate?: number;
  leadsPerMonth?: number;
  netCustomerValuePerMonth?: number;
  averageCustomerValuePerMonth?: number;
  expertCostPerMonth?: number;
}

interface ROASOutput {
  totalMarketingInvestment?: number;
  totalReturn?: number;
  roas?: number;
  roasPercent?: number;
  roasX?: number;
  numCustomersPerMonth?: number;
  payBackPeriod?: number;
  customerValue?: number;
  costPerCustomerAcquisition?: number;
}

function roasCalc({
  costPerLead = 100,
  conversionRate = 0.1,
  leadsPerMonth = 10,
  netCustomerValuePerMonth = 5000,
  averageCustomerValuePerMonth = 1,
  expertCostPerMonth = 0,
}: ROASInput): ROASOutput {
  const totalMarketingInvestment = expertCostPerMonth + costPerLead * leadsPerMonth;
  const customerValue = netCustomerValuePerMonth * averageCustomerValuePerMonth;
  const numCustomersPerMonth = Math.floor(conversionRate * leadsPerMonth);
  const totalReturn = customerValue * numCustomersPerMonth;
  const roas = totalReturn - totalMarketingInvestment;
  const roasPercent = roas / totalMarketingInvestment;
  const costPerCustomerAcquisition = totalMarketingInvestment / numCustomersPerMonth;
  const roasX = customerValue / costPerCustomerAcquisition;
  const payBackPeriod = costPerCustomerAcquisition / netCustomerValuePerMonth;
  return {
    totalMarketingInvestment,
    customerValue,
    numCustomersPerMonth,
    totalReturn,
    roas,
    roasPercent,
    costPerCustomerAcquisition,
    roasX,
    payBackPeriod,
  };
}
export default function () {
  const [tabs, setTabs] = useState<Record<string, StorageInput>>(
    JSON.parse(localStorage.getItem("pp-roas-calc") || "{}")
  );
  const [activeTab, setActiveTab] = useState<string>();

  const handleAddTab = useCallback(() => {
    const name = `tab_${Object.keys(tabs).length}`;
    const newTabs = { ...tabs };
    newTabs[name] = {
      input: defaultInput,
      displayName: "New Unnamed",
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
