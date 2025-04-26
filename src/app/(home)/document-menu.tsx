import { Button } from "@/components/ui/button";
import { ExternalLink, FilePenIcon, MoreVertical, TrashIcon } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { RemoveDialog } from "./remove-dialog";
import { RenameDialog } from "./rename-dialog";

interface DocumentMenuProps {
  documentId: Id<"documents">;
  title: string;
  onNewTab: (documentId: Id<"documents">) => void;
}

export const DocumentMenu = ({
  documentId,
  title,
  onNewTab,
}: DocumentMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
      <RenameDialog documentId={documentId} initialTitle={title}>
          <DropdownMenuItem onClick={(e)=>{e.stopPropagation()}} onSelect={(e)=>{e.preventDefault()}}>
            <FilePenIcon className="size-4 "/>
            Rename
          </DropdownMenuItem>
        </RenameDialog>
        <RemoveDialog documentId={documentId}>
          <DropdownMenuItem onClick={(e)=>{e.stopPropagation()}} onSelect={(e)=>{e.preventDefault()}}>
            <TrashIcon className="size-4 "/>
            Remove
          </DropdownMenuItem>
        </RemoveDialog>
        <DropdownMenuItem
          onClick={() => {
            onNewTab(documentId);
          }}
        >
          <ExternalLink />
          Open in New Tab
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
