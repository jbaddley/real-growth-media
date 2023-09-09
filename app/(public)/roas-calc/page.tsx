"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import RoasCalc, { StorageInput, defaultInput } from "../../components/RoasCalc";
import { Button, Modal, Tabs, TextInput } from "flowbite-react";
import useSWR from "swr";
import { Fetcher } from "../../lib/fetcher";
import { Contact, Proposals } from "@prisma/client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import CreateProposal from "../../components/CreateProposal";
import { usePathname, useRouter } from "next/navigation";
import _ from "lodash";

const videoSrc = "https://storage.googleapis.com/msgsndr/nrw8M8zQccEYIjAMiR22/media/64f0ef8a1181e8f643212216.mp4";
const defaultTabs: Record<string, StorageInput> = {
  defaultTab: {
    displayName: "ROAS Calc Default",
    name: "tab1",
    input: {},
  },
};

const getInitial = (id?: string): Record<string, StorageInput> => {
  const stored = globalThis.localStorage.getItem(`pp-roas-calc-${id}`);
  if (!stored) {
    return defaultTabs;
  }
  return JSON.parse(stored);
};

export default function () {
  const [proposal, setProposal] = useState<Proposals>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openProposal, setOpenProposal] = useState<boolean>(false);

  const email = useMemo(() => {
    const search = new URLSearchParams(globalThis.window.location.search);
    return search.get("email") || globalThis.localStorage.getItem("pp-contact-email");
  }, [globalThis.window.location.search]);

  const proposalId = useMemo(() => {
    const search = new URLSearchParams(globalThis.window.location.search);
    const proposalId = search.get("proposal");
    return proposalId;
  }, [globalThis.window.location.search]);

  const getProposal = async (proposalId: string) => {
    const { data } = await Fetcher.get<Proposals>(`/api/proposals/${proposalId}`);
    return data;
  };
  useEffect(() => {
    if (proposalId) {
      getProposal(proposalId).then((p) => setProposal(p));
    }
  }, [proposalId]);

  const [tabs, setTabs] = useState<Record<string, StorageInput>>();
  const [activeTab, setActiveTab] = useState<string>();

  const handleAddTab = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      const count = Object.keys(tabs).length;
      const name = `tab${count + 1}`;
      const newTabs = { ...tabs };
      newTabs[name] = {
        input: defaultInput,
        name,
        displayName: `ROAS Calc ${count + 1}`,
      };
      setTabs(newTabs);
      setActiveTab(name);
      saveProposals(proposal, newTabs);
    },
    [proposal, tabs]
  );

  useEffect(() => {
    if (proposal?.proposals) {
      setTabs(JSON.parse(String(proposal.proposals)));
    } else {
      setTabs(getInitial(proposalId));
    }
  }, [proposal]);

  const saveProposals = (proposal: Proposals, tabs: Record<string, StorageInput>) => {
    return Fetcher.post<Proposals, Proposals>("/api/proposals", { ...proposal, proposals: JSON.stringify(tabs) });
  };

  useEffect(() => {
    localStorage.setItem(`pp-roas-calc-${proposalId}`, JSON.stringify(tabs));
  }, [tabs, proposal, proposalId]);

  const handleChange = (name: string, storageInput: StorageInput) => {
    const newTabs = { ...tabs };
    newTabs[name] = storageInput;
    setTabs(newTabs);
  };

  const handleDelete = (name: string) => {
    const newTabs = { ...tabs };
    delete newTabs[name];
    setTabs(newTabs);
    saveProposals(proposal, newTabs);
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
    saveProposals(proposal, newTabs);
  };

  const activeTabIndex = useMemo(() => {
    return Object.keys(tabs || {}).findIndex((tab) => tab === activeTab);
  }, [tabs, activeTab]);

  const handleCaptureEnded = async () => {
    await Fetcher.post("/api/webhooks/contacts", { email, watchedRoas: "100%" });
    setOpen(false);
  };

  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className='p-2'>
      <div className='flex flex-row-reverse'>
        <Button onClick={handleAddTab}>+</Button>
        <Button className='me-2' onClick={() => saveProposals(proposal, tabs)}>
          Save
        </Button>
        <Button className='me-2' color='purple' onClick={() => setOpen(true)}>
          Proposal Video
        </Button>

        <CreateProposal
          className='me-2 hidden'
          proposalId={proposalId}
          onCreate={(proposal) => {
            setProposal(proposal);
            router.replace(`${pathname}?proposal=${proposal.id}`, { scroll: false });
          }}
          onFetch={(proposal) => {
            setProposal(proposal);
          }}
        />
      </div>
      <Tabs.Group tabIndex={activeTabIndex}>
        {Object.entries(tabs || {}).map(([key, value]) => (
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
      </Tabs.Group>
      <Modal show={openProposal} onClose={() => setOpenProposal(false)}></Modal>
      <Modal show={open} onClose={() => setOpen(false)} size={"5xl"}>
        <Modal.Header>Quick Demo!</Modal.Header>
        <Modal.Body>
          {open && <video src={proposal?.videoUrl} controls autoFocus onEnded={handleCaptureEnded} />}
        </Modal.Body>
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
    </div>
  );
}
