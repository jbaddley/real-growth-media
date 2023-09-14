"use client";
import { Dropdown, Select, TextInput } from "flowbite-react";
import { useCallback, useMemo, useState } from "react";
import { FaBars, FaRecycle, FaReplyAll } from "react-icons/fa";
import { NumericFormat, numericFormatter } from "react-number-format";

interface ROASInput {
  costPerLead?: number;
  conversionRate?: number;
  leadsPerMonth?: number;
  netCustomerValuePerMonth?: number;
  averageCustomerLength?: number;
  expertCostPerMonth?: number;
  commission?: number;
  commissionType?: "percent" | "quantity";
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
  commission = 0,
  commissionType = "percent",
  expertCostPerMonth = 0,
  monthlyGoal = 0,
  setupFee = 0,
}: ROASInput): ROASOutput {
  const customerValue = netCustomerValuePerMonth * averageCustomerLength;
  const numCustomersPerMonth = Math.floor((conversionRate / 100) * leadsPerMonth);
  const totalReturn = customerValue * numCustomersPerMonth;
  const totalMarketingCommissions =
    commissionType === "percent" ? totalReturn * (commission / 100) : commission * numCustomersPerMonth;
  const adSpendPerMonth = costPerLead * leadsPerMonth;
  const totalMarketingInvestment =
    expertCostPerMonth + costPerLead * leadsPerMonth + setupFee + totalMarketingCommissions;
  const monthlyReturn = netCustomerValuePerMonth * numCustomersPerMonth;
  const monthlyMarketingCommissions =
    commissionType === "percent" ? monthlyReturn * (commission / 100) : commission * numCustomersPerMonth;
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
  commission: 0,
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
  onChange,
  onCopy,
  onDelete,
  showUpdate,
  onApply,
  active,
}: {
  name: string;
  storageInputs: StorageInput;
  showUpdate: boolean;
  copyNames: Partial<StorageInput>[];
  onChange: (name: string, storageInput: StorageInput) => void;
  onDelete: (name: string) => void;
  onCopy: (name: string) => void;
  active: boolean;
  onApply?: (field: string, value: number) => void;
}) {
  const { input: roasInputs } = storageInputs;
  const roasOutputs = useMemo(() => {
    return roasCalc(roasInputs);
  }, [roasInputs, name, active]);

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

  const applyToAll = (field: string) => () => {
    const value = roasInputs[field];
    onApply?.(field, value);
  };

  const revenueHeader = () => {
    if (roasOutputs.monthlyReturnNet > 0) {
      return (
        <span className='text-xl'>
          New Monthly Revenue
          <NumericFormat
            renderText={(value) => (
              <p>
                <b>{value}</b>
              </p>
            )}
            thousandSeparator=','
            prefix='$'
            decimalScale={1}
            value={roasOutputs.monthlyReturnNet}
            displayType='text'
          />
        </span>
      );
    }
    return (
      <span className='text-xl'>
        Total Lifetime Revenue
        <NumericFormat
          renderText={(value) => (
            <p>
              <b>{value}</b>
            </p>
          )}
          thousandSeparator=','
          prefix='$'
          decimalScale={1}
          value={roasOutputs.totalReturn}
          displayType='text'
        />
      </span>
    );
  };

  return (
    <div style={{ maxWidth: 1200 }} className='m-4'>
      <div className='mb-8 columns-4'>
        <span className='text-xl'>
          Marketing Cost Per Month
          <NumericFormat
            thousandSeparator=','
            decimalScale={1}
            renderText={(value) => (
              <p>
                <b>{value}</b>
              </p>
            )}
            prefix='$'
            value={roasOutputs.totalMarketingInvestment}
            displayType='text'
          />
        </span>
        {revenueHeader()}
        <span className='text-xl'>
          ROAS X
          <NumericFormat
            renderText={(value) => (
              <p>
                <b>{value}</b>
              </p>
            )}
            decimalScale={1}
            value={roasOutputs.roasX}
            displayType='text'
          />
        </span>
        <span className='text-xl'>
          New Customers Per Month
          <NumericFormat
            renderText={(value) => (
              <p>
                <b>{value}</b>
              </p>
            )}
            decimalScale={0}
            value={roasOutputs.numCustomersPerMonth}
            displayType='text'
          />
        </span>
      </div>
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
            <div className='flex'>
              <NumericFormat
                prefix={"$"}
                customInput={TextInput}
                thousandSeparator=','
                value={roasInputs.netCustomerValuePerMonth}
                name='netCustomerValuePerMonth'
                onValueChange={handleChange("netCustomerValuePerMonth")}
              />
              <FaReplyAll className='m-2 opacity-25' onClick={applyToAll("netCustomerValuePerMonth")} />
            </div>
          </div>
          <div>
            <label>Average Customer Length in Months</label>

            <div className='flex'>
              <NumericFormat
                customInput={TextInput}
                thousandSeparator=','
                value={roasInputs.averageCustomerLength}
                name='averageCustomerLength'
                onValueChange={handleChange("averageCustomerLength")}
                suffix={" months"}
              />
              <FaReplyAll className='m-2 opacity-25' onClick={applyToAll("averageCustomerLength")} />
            </div>
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

            <div className='flex'>
              <NumericFormat
                thousandSeparator=','
                prefix={"$"}
                customInput={TextInput}
                value={roasInputs.costPerLead}
                name='costPerLead'
                onValueChange={handleUpdateCostPerLead}
              />
              <FaReplyAll className='m-2 opacity-25' onClick={applyToAll("costPerLead")} />
            </div>
          </div>
          <div>
            <label>Conversion Rate</label>
            <div className='flex'>
              <NumericFormat
                customInput={TextInput}
                value={roasInputs.conversionRate}
                name='conversionRate'
                onValueChange={handleChange("conversionRate")}
                suffix='%'
              />
              <FaReplyAll className='m-2 opacity-25' onClick={applyToAll("conversionRate")} />
            </div>
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
        <div className='my-4 columns-3'>
          <div>
            <label>Ad Spend</label>
            <div className='flex'>
              <NumericFormat
                prefix={"$"}
                customInput={TextInput}
                value={roasInputs.adSpend || roasOutputs.adSpendPerMonth}
                name='adSpend'
                onValueChange={handleUpdateAdSpend}
              />
              <FaReplyAll className='m-2 opacity-25' onClick={applyToAll("adSpend")} />
            </div>
          </div>
          <div>
            <label>Monthly Revenue Goal</label>

            <div className='flex'>
              <NumericFormat
                customInput={TextInput}
                prefix={"$"}
                value={roasInputs.monthlyGoal}
                thousandSeparator=','
                name='monthlyGoal'
                onValueChange={handleChange("monthlyGoal")}
              />
              <FaReplyAll className='m-2 opacity-25' onClick={applyToAll("monthlyGoal")} />
            </div>
          </div>
        </div>
      </div>
      <div className='my-4 columns-4'>
        <div>
          <label>Retainer Per Month</label>
          <NumericFormat
            disabled={!showUpdate}
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
            disabled={!showUpdate}
            prefix={"$"}
            customInput={TextInput}
            thousandSeparator=','
            value={roasInputs.setupFee}
            name='setupFee'
            onValueChange={handleChange("setupFee")}
          />
        </div>
        <div>
          <label>Commission Type</label>
          <Select
            value={roasInputs.commissionType}
            disabled={!showUpdate}
            onChange={({ target: { value } }) => {
              onChange(name, {
                ...storageInputs,
                input: { ...storageInputs.input, commissionType: value as "percent" | "quantity" },
              });
            }}
          >
            <option value='percent'>Percent</option>
            <option value='quantity'>Dollar Amount</option>
          </Select>
        </div>
        <div>
          <label>Commission</label>
          <NumericFormat
            disabled={!showUpdate}
            suffix={roasInputs.commissionType === "quantity" ? "" : "%"}
            prefix={roasInputs.commissionType === "quantity" ? "$" : ""}
            customInput={TextInput}
            value={roasInputs.commission}
            name='commission'
            onValueChange={handleChange("commission")}
          />
        </div>
      </div>
      <div>
        <div>
          <OutputDisplay label='Number of Months to Reach Goal' prefix='' value={roasOutputs.monthsToReachGoal} />
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
