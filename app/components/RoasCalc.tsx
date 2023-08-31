"use client";
import { Dropdown, TextInput } from "flowbite-react";
import { useCallback, useMemo, useState } from "react";
import { FaBars } from "react-icons/fa";
import { NumericFormat } from "react-number-format";

interface ROASInput {
  costPerLead?: number;
  conversionRate?: number;
  leadsPerMonth?: number;
  netCustomerValuePerMonth?: number;
  averageCustomerLength?: number;
  expertCostPerMonth?: number;
}

interface ROASOutput {
  totalMarketingInvestment?: number;
  totalReturn?: number;
  monthlyReturn?: number;
  monthlyReturnNet?: number;
  roas?: number;
  roasPercent?: number;
  roasX?: number;
  numCustomersPerMonth?: number;
  payBackPeriod?: number;
  profitPeriod?: number;
  customerValue?: number;
  costPerCustomerAcquisition?: number;
}

function roasCalc({
  costPerLead = 0,
  conversionRate = 0,
  leadsPerMonth = 0,
  netCustomerValuePerMonth = 0,
  averageCustomerLength = 0,
  expertCostPerMonth = 0,
}: ROASInput): ROASOutput {
  const totalMarketingInvestment = expertCostPerMonth + costPerLead * leadsPerMonth;
  const customerValue = netCustomerValuePerMonth * averageCustomerLength;
  const numCustomersPerMonth = Math.floor((conversionRate / 100) * leadsPerMonth);
  const totalReturn = customerValue * numCustomersPerMonth;
  const monthlyReturn = netCustomerValuePerMonth * numCustomersPerMonth;
  const monthlyReturnNet = monthlyReturn - totalMarketingInvestment;
  const roas = totalReturn - totalMarketingInvestment;
  const roasPercent = Math.round((roas / totalMarketingInvestment) * 100);
  const costPerCustomerAcquisition = totalMarketingInvestment / numCustomersPerMonth;
  const roasX = customerValue / costPerCustomerAcquisition;
  const payBackPeriod = Math.ceil(costPerCustomerAcquisition / netCustomerValuePerMonth);
  const profitPeriod = averageCustomerLength - payBackPeriod;
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
    profitPeriod,
    monthlyReturn,
    monthlyReturnNet,
  };
}

export interface StorageInput {
  input: ROASInput;
  name?: string;
  displayName: string;
}

export const defaultInput: ROASInput = {
  costPerLead: 50,
  conversionRate: 10,
  leadsPerMonth: 20,
  netCustomerValuePerMonth: 5000,
  averageCustomerLength: 1,
  expertCostPerMonth: 0,
};

const getStorage = (name: string): StorageInput => {
  const data = JSON.parse(globalThis.localStorage.getItem("pp-roas-calc") || "{}");
  return data[name] || { input: defaultInput, displayName: name };
};

const setStorage = (name: string, input: StorageInput) => {
  const data = JSON.parse(localStorage.getItem("pp-roas-calc") || "{}");
  data[name] = input;
  return localStorage.setItem("pp-roas-calc", JSON.stringify(data, null, 2));
};

function OutputDisplay({ label, ...nfProps }: { label: string; prefix?: any; value?: any; suffix?: any }) {
  return (
    <div className='columns-3'>
      <p className='text-right'>{label}: </p>
      <NumericFormat
        thousandSeparator=','
        decimalScale={1}
        renderText={(value) => (
          <p>
            <b>{value}</b>
          </p>
        )}
        displayType='text'
        {...nfProps}
      />
    </div>
  );
}

export default function ({
  name,
  storageInputs,
  copyNames,
  onChange,
  onDelete,
}: {
  name: string;
  storageInputs: StorageInput;
  copyNames: Partial<StorageInput>[];
  onChange: (name: string, storageInput: StorageInput) => void;
  onDelete: (name: string) => void;
}) {
  const { input: roasInputs } = storageInputs;
  const roasOutputs = useMemo(() => {
    setStorage(name, storageInputs);
    return roasCalc(roasInputs);
  }, [storageInputs, name]);

  const handleChange = (fieldName: string) => (values, e) => {
    const value = values.floatValue;
    onChange(name, { ...storageInputs, input: { ...storageInputs.input, [fieldName]: +value } });
  };

  const handleChangeDisplayName = useCallback(
    ({ target: { value } }) => {
      onChange(name, { ...storageInputs, displayName: value });
    },
    [name]
  );

  const handleCopy = (copyName: string) => {
    return () => {
      const copy = getStorage(copyName);
      onChange(name, { displayName: storageInputs.displayName, input: copy.input });
    };
  };

  const handleReset = () => onChange(name, { displayName: storageInputs.displayName, input: defaultInput });
  const handleDelete = () => {
    onDelete(name);
  };

  return (
    <div style={{ maxWidth: 1200 }} className='m-4'>
      <div className='flex space-x-4'>
        <div className='flex-grow'>
          <TextInput value={storageInputs.displayName} onChange={handleChangeDisplayName} />
        </div>
        <Dropdown label='Copy'>
          {copyNames.map(({ name, displayName }) => (
            <Dropdown.Item key={name} value={name} className='capitalize' onClick={handleCopy(name)}>
              {displayName}
            </Dropdown.Item>
          ))}
        </Dropdown>
        <Dropdown label={<FaBars size={20} />} arrowIcon={false}>
          <Dropdown.Item onClick={handleReset}>Reset</Dropdown.Item>
          <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
        </Dropdown>
      </div>
      <div className='mb-4'>
        <div className='my-4 columns-3'>
          <div>
            <label>Net Customer Value Per Month</label>
            <NumericFormat
              prefix={"$"}
              customInput={TextInput}
              thousandSeparator=','
              value={roasInputs.netCustomerValuePerMonth}
              name='netCustomerValuePerMonth'
              onValueChange={handleChange("netCustomerValuePerMonth")}
            />
          </div>
          <div>
            <label>Average Customer Length in Months</label>
            <NumericFormat
              customInput={TextInput}
              thousandSeparator=','
              value={roasInputs.averageCustomerLength}
              name='averageCustomerLength'
              onValueChange={handleChange("averageCustomerLength")}
              suffix={" months"}
            />
          </div>
          <div>
            <label>Net Average Lifetime Customer Value</label>
            <p>
              <NumericFormat
                thousandSeparator=','
                displayType='text'
                prefix='$'
                value={roasOutputs.customerValue}
                name='customerValue'
              />
            </p>
          </div>
        </div>

        <div className='my-4 columns-3'>
          <div>
            <label>Cost Per Lead</label>
            <NumericFormat
              thousandSeparator=','
              prefix={"$"}
              customInput={TextInput}
              value={roasInputs.costPerLead}
              name='costPerLead'
              onValueChange={handleChange("costPerLead")}
            />
          </div>
          <div>
            <label>Conversion Rate</label>
            <NumericFormat
              customInput={TextInput}
              value={roasInputs.conversionRate}
              name='conversionRate'
              onValueChange={handleChange("conversionRate")}
              suffix='%'
            />
          </div>
          <div>
            <label>Number of Leads Per Month</label>
            <NumericFormat
              customInput={TextInput}
              value={roasInputs.leadsPerMonth}
              name='leadsPerMonth'
              onValueChange={handleChange("leadsPerMonth")}
            />
          </div>
        </div>
        <div className='my-4'>
          <label>Ad Implementation Cost Per Month</label>
          <NumericFormat
            prefix={"$"}
            customInput={TextInput}
            thousandSeparator=','
            value={roasInputs.expertCostPerMonth}
            name='expertCostPerMonth'
            onValueChange={handleChange("expertCostPerMonth")}
          />
        </div>
      </div>
      <div>
        <OutputDisplay label='Net Gain in New Lifetime Revenue' prefix='$' value={roasOutputs.totalReturn} />
        <OutputDisplay label='Total Cost of Marketing' prefix='$' value={roasOutputs.totalMarketingInvestment} />
        <OutputDisplay label='Total New Customers Per Month' value={roasOutputs.numCustomersPerMonth} />
        <OutputDisplay label='Gross Gain in New Monthly Revenue' prefix='$' value={roasOutputs.monthlyReturn} />
        <OutputDisplay label='Net Gain in New Monthly Revenue' prefix='$' value={roasOutputs.monthlyReturnNet} />
        <OutputDisplay label='ROAS' prefix='$' value={roasOutputs.roas} />
        <OutputDisplay label='ROAS X' suffix='X' value={roasOutputs.roasX} />
        <OutputDisplay
          label='Payback Period'
          suffix={` month${roasOutputs.payBackPeriod === 1 ? "" : "s"}`}
          value={roasOutputs.payBackPeriod}
        />
        <OutputDisplay
          label='Profit Period'
          suffix={` month${roasOutputs.profitPeriod === 1 ? "" : "s"}`}
          value={roasOutputs.profitPeriod}
        />
        <OutputDisplay label='Customer Acquistion Cost' prefix='$' value={roasOutputs.costPerCustomerAcquisition} />
      </div>
    </div>
  );
}
