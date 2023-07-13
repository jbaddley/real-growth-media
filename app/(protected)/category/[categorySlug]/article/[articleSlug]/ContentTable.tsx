"use client";

import { Table } from "flowbite-react";
import { ArticleContentExpanded } from "../../../../../lib/types/ArticleContentExpanded";
import Image from "next/image";
import Link from "next/link";
import { IoPencil } from "react-icons/io5";

export default function ContentTable({
  previewLink,
  content = [],
  onEdit,
}: {
  previewLink: string;
  content: ArticleContentExpanded[];
  onEdit: (id: string) => void;
}) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>Hero</Table.HeadCell>
        <Table.HeadCell>Title</Table.HeadCell>
        <Table.HeadCell>Content</Table.HeadCell>
        <Table.HeadCell>Type</Table.HeadCell>
        <Table.HeadCell>CTA</Table.HeadCell>
        <Table.HeadCell>
          <span className='sr-only'>Edit</span>
        </Table.HeadCell>
        <Table.HeadCell>
          <span className='sr-only'>Preview</span>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className='divide-y'>
        {content.map((c) => (
          <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
            <Table.Cell>
              {c.hero?.url ? <img src={c.hero.url} alt='hero' style={{ maxHeight: 64 }} /> : "No Hero Yet"}
            </Table.Cell>
            <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
              {c.title?.title || "No Title Yet"}
            </Table.Cell>
            <Table.Cell>{c.content?.content?.length || "No Content Yet"}</Table.Cell>
            <Table.Cell>{c.type?.type || "No Type Yet"}</Table.Cell>
            <Table.Cell>{c.callToAction?.text || "No CTA Yet"}</Table.Cell>
            <Table.Cell className='cursor-pointer' onClick={() => onEdit(c.id)}>
              <IoPencil />
            </Table.Cell>
            <Table.Cell>
              <Link href={`${previewLink}/${c.id}`}>Preview</Link>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
