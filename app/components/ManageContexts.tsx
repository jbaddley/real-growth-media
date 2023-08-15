"use client";
import { useCallback, useRef, useState } from "react";
import { Button, Dropdown, Label, Modal, Select, TextInput, Textarea } from "flowbite-react";
import { Fetcher } from "../lib/fetcher";
import { Context } from "@prisma/client";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { FaBars } from "react-icons/fa";
const marketingModels = [
  {
    id: 1,
    name: "AIDA",
    description: "A model that describes the stages a buyer goes through: Awareness, Interest, Desire, and Action.",
  },
  {
    id: 2,
    name: "SWOT Analysis",
    description:
      "A strategic planning tool that helps businesses identify their Strengths, Weaknesses, Opportunities, and Threats.",
  },
  {
    id: 3,
    name: "7Ps of Marketing",
    description:
      "An extended version of the 4Ps, it includes: Product, Price, Place, Promotion, People, Process, and Physical Evidence.",
  },
  {
    id: 4,
    name: "STP",
    description:
      "A three-step approach to building a targeted marketing plan: Segmentation, Targeting, and Positioning.",
  },
  {
    id: 5,
    name: "PESTLE Analysis",
    description:
      "A tool used to identify external factors that might affect an organization: Political, Economic, Social, Technological, Legal, and Environmental.",
  },
  {
    id: 6,
    name: "Ansoff Matrix",
    description:
      "A strategic tool to devise growth strategies based on market and product choices: Market Penetration, Product Development, Market Development, and Diversification.",
  },
  {
    id: 7,
    name: "BCG Matrix",
    description:
      "A model that categorizes products into Stars, Question Marks, Cash Cows, and Dogs based on market growth and market share.",
  },
  {
    id: 8,
    name: "Porter's Five Forces",
    description:
      "A tool used to analyze the competition of a business. It identifies five forces: Threat of New Entrants, Bargaining Power of Suppliers, Bargaining Power of Buyers, Threat of Substitute Products, and Intensity of Rivalry.",
  },
];
function ManageContexts({
  onChange,
  value,
  context,
}: {
  onChange: (contextId?: string) => void;
  value: string;
  context?: Context;
}) {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create");
  const [isSaving, setIsSaving] = useState(false);
  const formSubmit = useRef<HTMLInputElement>(null);

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data: contexts = [], mutate } = useSWR(["contexts"], async () => {
    const { data } = await Fetcher.get<Context[]>("/api/ai/contexts");
    return data;
  });

  const handleSubmitForm = useCallback(() => {
    formSubmit.current?.click();
  }, [formSubmit]);

  const createContext = async (newContext: Partial<Context>) => {
    setIsSaving(true);
    let response;
    if (mode === "create") {
      response = await Fetcher.post<Context, Partial<Context>>("/api/ai/contexts", newContext);
    } else {
      response = await Fetcher.put<Context, Partial<Context>>(`/api/ai/contexts/${context.id}`, newContext);
    }

    setIsSaving(false);
    setShowModal(false);
    reset();
    mutate();
    onChange(response.data.id);
    return response.data;
  };

  const handleAddContext = () => {
    reset();
    setMode("create");
    setShowModal(true);
  };

  const handleEditContext = () => {
    setMode("edit");
    setShowModal(true);
    Object.entries(context).map(([key, value]) => {
      setValue(key, value);
    });
  };

  const handleCloneContext = async () => {
    const { name, id, ...rest } = context;
    const { data } = await Fetcher.post<Context, Partial<Context>>("/api/ai/contexts", {
      ...rest,
      name: `Copy of ${name}`,
    });
    onChange(data.id);
    setMode("edit");
    setShowModal(true);
    Object.entries(data).map(([key, value]) => {
      setValue(key, value);
    });
  };

  const handleDeleteContext = async () => {
    await Fetcher.delete(`/api/ai/contexts/${value}`);
    mutate();
    onChange();
  };

  return (
    <div>
      <div className='flex'>
        <Select className='' value={value} onChange={(e) => onChange(e.target.value)}>
          <option value={""}>Select a Context</option>
          {contexts?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Dropdown arrowIcon={false} color='white' label={<FaBars />}>
          <Dropdown.Item onClick={handleAddContext}>Add</Dropdown.Item>
          <Dropdown.Item onClick={handleEditContext} disabled={!value}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item onClick={handleCloneContext} disabled={!value}>
            Clone
          </Dropdown.Item>
          <Dropdown.Item onClick={handleDeleteContext} disabled={!value}>
            Delete
          </Dropdown.Item>
        </Dropdown>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Add New Context</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(createContext)}>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='name' value='Name' />
              </div>
              <TextInput id='name' placeholder='context name' {...register("name", { required: true })} />
            </div>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='options.industry' value='Industry' />
              </div>
              <TextInput id='options.industry' placeholder='' {...register("options.industry", { required: false })} />
            </div>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='options.targetMarket' value='Target Market' />
              </div>
              <TextInput
                id='options.targetMarket'
                placeholder=''
                {...register("options.targetMarket", { required: false })}
              />
            </div>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='options.tone' value='Tone' />
              </div>
              <TextInput
                id='options.tone'
                placeholder='communication tone'
                {...register("options.tone", { required: false })}
              />
            </div>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='options.brand' value='Brand Name' />
              </div>
              <TextInput
                id='options.brand'
                placeholder='brand name'
                {...register("options.brand", { required: false })}
              />
            </div>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='options.model' value='Marketing Model' />
              </div>
              <Select
                id='options.model'
                placeholder='marketing model'
                {...register("options.model", { required: false })}
              >
                <option value=''>No Model</option>
                {marketingModels.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='data' value='Context' />
              </div>
              <Textarea
                rows={8}
                id='data'
                placeholder='context about your company'
                {...register("data", { required: true })}
              />
            </div>
            <input type='submit' ref={formSubmit} style={{ visibility: "hidden" }} />
          </form>
        </Modal.Body>
        <Modal.Footer className='flex'>
          <Button className='btn btn-secondary' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button disabled={isSaving} className='btn btn-primary' onClick={handleSubmitForm}>
            {isSaving ? "Saving..." : "OK"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageContexts;
