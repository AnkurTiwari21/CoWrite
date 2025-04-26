import { PaginationStatus } from "convex/react";
import { Doc } from "../../../convex/_generated/dataModel";
import { SiGoogledocs } from "react-icons/si";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2Icon, CircleUserIcon, LoaderIcon } from "lucide-react";
import { format } from "date-fns";
import { DocumentMenu } from "./document-menu";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DocumentTableProps {
  documents: Doc<"documents">[] | undefined;
  loadMore: (numItems: number) => void;
  status: PaginationStatus;
}

export const DocumentsTable = ({
  documents,
  loadMore,
  status,
}: DocumentTableProps) => {
  const router = useRouter();
  const onNewTabClick = (documentId: string) => {
    window.open(`/documents/${documentId}`, "_blank");
  };

  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5">
      {status === "LoadingFirstPage" ? (
        <div className="flex justify-center items-center h-24">
          <LoaderIcon className="animated-spin text-muted-foreground size-5" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead>Name</TableHead>
              <TableHead>&nbsp;</TableHead>
              <TableHead className="hidden md:table-cell">Shared</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
            </TableRow>
          </TableHeader>
          {documents?.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No documents found
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {documents?.map((document) => (
                <TableRow
                  key={document._id}
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`/documents/${document._id}`);
                  }}
                >
                  <TableCell className="w-[50px]">
                    <SiGoogledocs className="size-6 fill-blue-500" />
                  </TableCell>
                  <TableCell className="font-medium md:w-[45%]">
                    {document.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
                    {document.organizationId ? (
                      <Building2Icon className="size-4" />
                    ) : (
                      <CircleUserIcon className="size-4" />
                    )}
                    {document.organizationId ? "Organization" : "Personal"}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {format(new Date(document._creationTime), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="flex ml-auto justify-end">
                    <DocumentMenu
                      documentId={document._id}
                      title={document.title}
                      onNewTab={onNewTabClick}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      )}
       
        <div className="flex flex-row justify-center cursor-pointer">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              loadMore(5);
            }}
            disabled={status !== "CanLoadMore"}
          >
            {status === "LoadingMore" || status === "LoadingFirstPage"
              ? "Loading more documents..."
              : status === "CanLoadMore"
                ? "Load more documents"
                : "No more documents to load"}
          </Button>
        </div>
      
    </div>
  );
};
