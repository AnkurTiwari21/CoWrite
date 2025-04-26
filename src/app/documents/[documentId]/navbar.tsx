"use client";

import Image from "next/image";
import Link from "next/link";
import { DocumentInput } from "./document-input";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  BoldIcon,
  FileIcon,
  FilePenIcon,
  FilePlusIcon,
  GlobeIcon,
  ItalicIcon,
  PrinterIcon,
  RedoIcon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  TableIcon,
  TextIcon,
  TrashIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Avatars } from "./avatars";
import { Inbox } from "./inbox";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RenameDialog } from "@/app/(home)/rename-dialog";
import { RemoveDialog } from "@/app/(home)/remove-dialog";

interface NavbarProps {
  data: Doc<"documents">;
}

export const Navbar = ({ data }: NavbarProps) => {
  const router = useRouter();
  const { editor } = useEditorStore();

  const saveAsText = () => {
    const text = editor?.getText() || "";
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.title}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const saveAsHtml = () => {
    const html = editor?.getHTML() || "";
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.title}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const insertTable = (rows: number, cols: number) => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: false })
      .run();
  };

  const mutation = useMutation(api.document.create);
  const onnewDocument = () => {
    mutation({
      title: "Untitled",
      initialContent: "",
    })
      .then((id) => {
        toast.success("Document created");
        router.push(`/documents/${id}`);
      })
      .catch(() => {
        toast.error("Error creating document");
      });
  };
  return (
    <nav className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Link href="/">
          <Image src="/logo.svg" width={36} height={36} alt="logo" />
        </Link>
        <div className="flex flex-col">
          <DocumentInput title={data.title} id={data._id} />
          <div className="flex">
            <Menubar className="border-none shadow-none h-auto p-0 bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="test-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  File
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={onnewDocument}>
                    <FilePlusIcon className="size-4 mr-2" />
                    New
                  </MenubarItem>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <FileIcon className="size-4 mr-2" />
                      Save As
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={saveAsText}>
                        <TextIcon className="size-4 mr-2" />
                        Text
                      </MenubarItem>
                      <MenubarItem onClick={saveAsHtml}>
                        <GlobeIcon className="size-4 mr-2" />
                        HTML
                      </MenubarItem>
                      <MenubarItem onClick={() => window.print()}>
                        <FileIcon className="size-4 mr-2" />
                        PDF
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => window.print()}>
                    <PrinterIcon className="size-4 mr-2" />
                    Print
                  </MenubarItem>
                  <RenameDialog documentId={data._id} initialTitle={data.title}>
                    <MenubarItem
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onSelect={(e) => {e.preventDefault();}}
                    >
                      <FilePenIcon className="size-4 mr-2" />
                      Rename
                    </MenubarItem>
                  </RenameDialog>
                  <RemoveDialog documentId={data._id}>
                    <MenubarItem
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onSelect={(e) => {e.preventDefault();}}
                    >
                      <TrashIcon className="size-4 mr-2" />
                      Remove
                    </MenubarItem>
                  </RemoveDialog>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="test-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Edit
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem
                    onClick={() => {
                      editor?.chain().focus().undo().run();
                    }}
                  >
                    <UndoIcon className="size-4 mr-2" />
                    Undo
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => {
                      editor?.chain().focus().redo().run();
                    }}
                  >
                    <RedoIcon className="size-4 mr-2" />
                    Redo
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="test-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Insert
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TableIcon className="size-4 mr-2" />
                      Table
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem
                        onClick={() => {
                          insertTable(1, 1);
                        }}
                      >
                        <TableIcon className="size-4 mr-2" />1 X 1
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => {
                          insertTable(2, 2);
                        }}
                      >
                        <TableIcon className="size-4 mr-2" />2 X 2
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => {
                          insertTable(3, 3);
                        }}
                      >
                        <TableIcon className="size-4 mr-2" />3 X 3
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="test-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Format
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TextIcon className="size-4 mr-2" />
                      Text
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem
                        onClick={() => {
                          editor?.chain().focus().toggleBold().run();
                        }}
                      >
                        <BoldIcon className="size-4 mr-2" />
                        Bold
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => {
                          editor?.chain().focus().toggleItalic().run();
                        }}
                      >
                        <ItalicIcon className="size-4 mr-2" />
                        Italic
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => {
                          editor?.chain().focus().setUnderline().run();
                        }}
                      >
                        <UnderlineIcon className="size-4 mr-2" />
                        Underline
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => {
                          editor?.chain().focus().setStrike().run();
                        }}
                      >
                        <StrikethroughIcon className="size-4 mr-2" />
                        Strike
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem
                    onClick={() => {
                      editor?.chain().focus().unsetAllMarks().run();
                    }}
                  >
                    <RemoveFormattingIcon className="size-4 mr-2" />
                    Clear Formatting
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center pl-6">
        <Inbox />
        <Avatars />
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectPersonalUrl="/"
          afterSelectOrganizationUrl="/"
        />
        <UserButton />
      </div>
    </nav>
  );
};
