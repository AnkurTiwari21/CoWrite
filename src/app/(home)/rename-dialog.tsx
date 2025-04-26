"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RenameDialogProps {
  documentId: Id<"documents">;
  children: React.ReactNode;
  initialTitle: string;
}
export const RenameDialog = ({
  documentId,
  children,
  initialTitle,
}: RenameDialogProps) => {
  const update = useMutation(api.document.updateById);
  const [isUpdating, setIsUpdating] = useState(false);

  const [title, setTitle] = useState(initialTitle);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    update({
      documentId,
      title: title ?? "Untitled",
    })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .then(() => {
        toast.success("Document renamed");
      })
      .finally(() => {
        setIsUpdating(false);
        setOpen(false);
      });
  };
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Rename Document</DialogTitle>

              <DialogDescription>
                Enter a new name for this document
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="Untitled"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                disabled={isUpdating}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="ghost"
                disabled={isUpdating}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
