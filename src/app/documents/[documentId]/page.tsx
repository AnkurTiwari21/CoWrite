import {preloadQuery} from "convex/nextjs"
import { auth } from "@clerk/nextjs/server"

import DocumentPage from "./document"

import { Id } from '../../../../convex/_generated/dataModel';
import { api } from "../../../../convex/_generated/api"

interface DocumentIdPageProps{
  params: Promise<{documentId:Id<"documents">}>
}
const DocumentIdPage =async ({params}:DocumentIdPageProps)=>{
  const {documentId} = await params

  const {getToken} = await auth()
  const token = await getToken({template:"convex"}) ?? undefined

  if (!token){
    throw new Error("Unauthorized")
  }

  const preloadedDocuments = await preloadQuery(api.document.getById,{Id: documentId},{token})

  return <DocumentPage preloadedDocuments={preloadedDocuments}/>
}
export default DocumentIdPage