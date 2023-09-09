import { Button, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { Fetcher } from "../lib/fetcher";
import { Proposals } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

export default function CreateProposal({
  proposalId,
  onFetch,
  onCreate,
  ...rest
}: {
  proposalId?: string;
  onFetch?: (proposal: Proposals) => void;
  onCreate?: (proposal: Proposals) => void;
  className?: string;
}) {
  const [show, setShow] = useState<boolean>(false);
  const submitButton = useRef<HTMLButtonElement>(null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    data: proposal,
    isLoading,
    mutate,
  } = useSWR(["proposal", proposalId], async () => {
    if (!proposalId) {
      return undefined;
    }
    const { data } = await Fetcher.get<Proposals>(`/api/proposals/${proposalId}`);
    console.log({ data });
    onFetch?.(data);
    return data;
  });

  useEffect(() => {
    if (proposal) {
      setValue("email", proposal.email);
      setValue("name", proposal.name);
      setValue("videoUrl", proposal.videoUrl);
    }
  }, [proposal]);

  const handleSave = async (values) => {
    const { data } = await Fetcher.post<Proposals, Proposals>(`/api/proposals`, values);
    console.log({ save: data });
    onCreate?.(data);
    mutate();
    setShow(false);
  };

  return (
    <>
      <Button {...rest} onClick={() => setShow(true)}>
        {proposalId ? "Update" : "Create"} Proposal
      </Button>
      <Modal show={show} onClose={() => setShow(false)}>
        <Modal.Header>{proposalId ? "Update" : "Create"} Proposal</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleSave)}>
            <div>
              <label>Name</label>
              <TextInput {...register("name")} />
            </div>
            <div>
              <label>Email</label>
              <TextInput {...register("email")} />
            </div>
            <div>
              <label>Video Url</label>
              <TextInput {...register("videoUrl")} />
            </div>
            <button ref={submitButton} style={{ visibility: "hidden" }} type='submit'>
              OK
            </button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)}>Cancel</Button>
          <Button
            onClick={() => {
              submitButton.current?.click();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
