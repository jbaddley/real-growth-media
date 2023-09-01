"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import RoasCalc, { StorageInput, defaultInput } from "../../components/RoasCalc";
import { Button, Modal, Tabs, TextInput } from "flowbite-react";
import useSWR from "swr";
import { Fetcher } from "../../lib/fetcher";
import { Contact } from "@prisma/client";
import Link from "next/link";
import { useForm } from "react-hook-form";

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
  const submitButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openContact, setOpenContact] = useState<boolean>(false);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const email = useMemo(() => {
    const search = new URLSearchParams(globalThis.window.location.search);
    return search.get("email") || globalThis.localStorage.getItem("pp-contact-email");
  }, [globalThis.window.location.search]);

  const {
    data: contact,
    isLoading,
    mutate,
  } = useSWR(["contact", email], async () => {
    if (!email) {
      return undefined;
    }
    const { data } = await Fetcher.get<Contact>(`/api/webhooks/contacts?email=${email}`);
    globalThis.localStorage.setItem("pp-contact-email", data.email);
    return data;
  });

  useEffect(() => {
    if (!isLoading && contact) {
      setValue("email", contact.email);
      setValue("firstName", contact.firstName);
      setValue("lastName", contact.lastName);
      setValue("phone", contact.phone);
      setValue("allowContact", contact.allowContact);
      globalThis.localStorage.setItem("pp-contact-email", contact.email);
    }
  }, [contact, isLoading]);

  useEffect(() => {
    if (!email) {
      setOpenContact(true);
    }
  }, [email]);

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

  const handleSaveContact = async (formValues: Contact) => {
    await Fetcher.post<Contact, Contact>("/api/webhooks/contacts", formValues);
    mutate();
    setOpenContact(false);
  };

  return (
    <div className='p-2'>
      <div className='flex flex-row-reverse'>
        <Button onClick={() => setOpen(true)}>Show Demo</Button>
      </div>
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
        <Modal.Footer className='flex'>
          <div className='flex-grow'>
            <Link className='mx-4' target='blank' href='https://book.realgrowth.media/booking'>
              Book a Call
            </Link>
          </div>
          <div>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal show={openContact} onClose={() => setOpenContact(false)}>
        <Modal.Header>In Order to Use Our ROAS Calculator, Please Confirm Your Contact Information</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleSaveContact)} className='space-y-4'>
            <p>We will never sell your information.</p>
            <p>We use the information to improve our free tools and create new ones.</p>
            <div>
              <label>First Name</label>
              <TextInput {...register("firstName")} />
            </div>
            <div>
              <label>Last Name</label>
              <TextInput {...register("lastName")} />
            </div>
            <div>
              <label>Email Address</label>
              <TextInput {...register("email")} />
            </div>
            <div>
              <label>Phone Number</label>
              <TextInput {...register("phone")} />
            </div>
            <p>May we reach out to you about additional tools and services?</p>
            <label>
              <input type='checkbox' {...register("allowContact")} /> Yes, you can contact me.
            </label>
            <button ref={submitButton} className='hidden' type='submit'>
              OK
            </button>
          </form>
        </Modal.Body>
        <Modal.Footer className='flex'>
          <div>
            <Link className='mx-4' target='blank' href='https://book.realgrowth.media/booking'>
              Book a Call
            </Link>
          </div>
          <div className='flex flex-grow flex-row-reverse'>
            <Button
              onClick={() => {
                submitButton.current.click();
              }}
            >
              Submit
            </Button>
            <Button className='mx-4' onClick={() => setOpenContact(false)}>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
