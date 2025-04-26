"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getUserList, getDocuments } from "./actions";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

type User = {
  id: string;
  name: string;
  avatar: string;
}

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();

  const [users , setUsers] = useState<User[]>([])

  const fetchUsers = async () => {
    try{
        const list = await getUserList()
        setUsers(list)
    }catch{
      toast.error("Error fetching users : ")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])
  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={async ()=>{
        const endpoint = "/api/liveblocks-auth"
        const room = params.documentId as string
        const res = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({
            room,
          }),
        });
        return await res.json();
      }}
      resolveUsers={({userIds}) => userIds.map((userId)=>users.find((user)=>user.id === userId) ?? undefined)}
      resolveRoomsInfo={async ({roomIds}) => {
        const documents = await getDocuments(roomIds as Id<"documents">[])
        return documents.map((document)=>{
          return {
            id: document.id,
            name: document.name,
          }
        })
      }}
      resolveMentionSuggestions={({text}) => {
        let filteredUser = users;
        if(text){
          filteredUser = users.filter((user)=>user.name.toLowerCase().includes(text.toLowerCase()))
        }
        return filteredUser.map((user)=>user.id)
      }}
    >
      <RoomProvider id={params.documentId as string} initialStorage={{leftMargin:56,rightMargin:56}}>
        <ClientSideSuspense
          fallback={<FullscreenLoader label="Room Loading..." />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
