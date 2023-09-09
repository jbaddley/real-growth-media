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
  commissionPercentage?: number;
  monthlyGoal?: number;
  adSpend?: number;
  setupFee?: number;
}

interface ROASOutput {
  totalMarketingInvestment?: number;
  monthlyMarketingCommissions?: number;
  totalMarketingCommissions?: number;
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
  adSpendPerMonth?: number;
  leadsPerMonth?: number;
  monthsToReachGoal?: number;
}

function roasCalc({
  costPerLead = 0,
  conversionRate = 0,
  leadsPerMonth = 0,
  netCustomerValuePerMonth = 0,
  averageCustomerLength = 0,
  commissionPercentage = 0,
  expertCostPerMonth = 0,
  monthlyGoal = 0,
  setupFee = 0,
}: ROASInput): ROASOutput {
  const customerValue = netCustomerValuePerMonth * averageCustomerLength;
  const numCustomersPerMonth = Math.floor((conversionRate / 100) * leadsPerMonth);
  const totalReturn = customerValue * numCustomersPerMonth;
  const totalMarketingCommissions = totalReturn * (commissionPercentage / 100);
  const adSpendPerMonth = costPerLead * leadsPerMonth;
  const totalMarketingInvestment = expertCostPerMonth + costPerLead * leadsPerMonth + setupFee;
  const monthlyReturn = netCustomerValuePerMonth * numCustomersPerMonth;
  const monthlyMarketingCommissions = monthlyReturn * (commissionPercentage / 100);
  const monthlyReturnNet = monthlyReturn - (totalMarketingInvestment + monthlyMarketingCommissions);
  const roas = totalReturn - totalMarketingInvestment;
  const roasPercent = Math.round((roas / totalMarketingInvestment) * 100);
  const costPerCustomerAcquisition = totalMarketingInvestment / numCustomersPerMonth;
  const roasX = customerValue / costPerCustomerAcquisition;
  const payBackPeriod = Math.ceil(costPerCustomerAcquisition / netCustomerValuePerMonth);
  const profitPeriod = averageCustomerLength - payBackPeriod;
  const monthsToReachGoal = monthlyGoal / (monthlyReturn - monthlyMarketingCommissions);
  return {
    totalMarketingInvestment,
    monthsToReachGoal,
    totalMarketingCommissions,
    customerValue,
    numCustomersPerMonth,
    totalReturn,
    roas,
    roasPercent,
    costPerCustomerAcquisition,
    adSpendPerMonth,
    roasX,
    payBackPeriod,
    profitPeriod,
    monthlyReturn,
    monthlyMarketingCommissions,
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
  commissionPercentage: 0,
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

function OutputDisplay({
  label,
  hide,
  ...nfProps
}: {
  hide?: boolean;
  label: string;
  prefix?: any;
  value?: any;
  suffix?: any;
}) {
  if (hide) {
    return null;
  }
  return (
    <div className='columns-2'>
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
  onCopy,
  onDelete,
}: {
  name: string;
  storageInputs: StorageInput;
  copyNames: Partial<StorageInput>[];
  onChange: (name: string, storageInput: StorageInput) => void;
  onDelete: (name: string) => void;
  onCopy: (name: string) => void;
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

  const handleUpdateAdSpend = (values, e) => {
    const value = +values.floatValue;
    const { costPerLead } = storageInputs.input;
    onChange(name, {
      ...storageInputs,
      input: { ...storageInputs.input, adSpend: +value, leadsPerMonth: value / costPerLead },
    });
  };

  const handleUpdateNumberOfLeads = (values, e) => {
    const value = +values.floatValue;
    const { costPerLead } = storageInputs.input;
    onChange(name, {
      ...storageInputs,
      input: { ...storageInputs.input, leadsPerMonth: +value, adSpend: value * costPerLead },
    });
  };

  const handleUpdateCostPerLead = (values, e) => {
    const value = +values.floatValue;
    const { leadsPerMonth } = storageInputs.input;
    onChange(name, {
      ...storageInputs,
      input: { ...storageInputs.input, costPerLead: +value, adSpend: value * leadsPerMonth },
    });
  };

  const handleChangeDisplayName = useCallback(
    ({ target: { value } }) => {
      onChange(name, { ...storageInputs, displayName: value });
    },
    [name]
  );

  const handleCopy = () => {
    onCopy(name);
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

        <Dropdown label={<FaBars size={20} />} arrowIcon={false}>
          <Dropdown.Item onClick={handleCopy}>Duplicate</Dropdown.Item>
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
              onValueChange={handleUpdateCostPerLead}
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
              onValueChange={handleUpdateNumberOfLeads}
            />
          </div>
        </div>
        <div className='my-4 columns-4'>
          <div>
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
          <div>
            <label>Setup Fee</label>
            <NumericFormat
              prefix={"$"}
              customInput={TextInput}
              thousandSeparator=','
              value={roasInputs.setupFee}
              name='setupFee'
              onValueChange={handleChange("setupFee")}
            />
          </div>
          <div>
            <label>Commission Percentage</label>
            <NumericFormat
              suffix={"%"}
              customInput={TextInput}
              value={roasInputs.commissionPercentage}
              name='commissionPercentage'
              onValueChange={handleChange("commissionPercentage")}
            />
          </div>
          <div>
            <label>Ad Spend</label>
            <NumericFormat
              prefix={"$"}
              customInput={TextInput}
              value={roasInputs.adSpend || roasOutputs.adSpendPerMonth}
              name='adSpend'
              onValueChange={handleUpdateAdSpend}
            />
          </div>
        </div>
      </div>
      <div>
        <div>
          <div className='columns-2'>
            <p className='text-right'>Monthly Revenue Goal:</p>
            <NumericFormat
              customInput={TextInput}
              prefix={"$"}
              value={roasInputs.monthlyGoal}
              thousandSeparator=','
              name='monthlyGoal'
              onValueChange={handleChange("monthlyGoal")}
            />
          </div>
          <OutputDisplay label='Number of Months to Reach Goal' prefix='' value={roasOutputs.monthsToReachGoal} />
        </div>
        <div>
          <OutputDisplay label='Net Gain in New Lifetime Revenue' prefix='$' value={roasOutputs.totalReturn} />
          <OutputDisplay
            label='Monthly Cost of Commissions'
            prefix='$'
            value={roasOutputs.monthlyMarketingCommissions}
          />
          <OutputDisplay label='Monthly Cost of Ads' prefix='$' value={roasOutputs.adSpendPerMonth} />
          <OutputDisplay label='Total Cost of Commissions' prefix='$' value={roasOutputs.totalMarketingCommissions} />
          <OutputDisplay label='Total Cost of Marketing' prefix='$' value={roasOutputs.totalMarketingInvestment} />
          <OutputDisplay label='Total New Customers Per Month' value={roasOutputs.numCustomersPerMonth} />
          <OutputDisplay label='Gross Gain in New Monthly Revenue' prefix='$' value={roasOutputs.monthlyReturn} />
          <OutputDisplay
            hide={true}
            label='Net Gain in New Monthly Revenue'
            prefix='$'
            value={roasOutputs.monthlyReturnNet}
          />
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
    </div>
  );
}
