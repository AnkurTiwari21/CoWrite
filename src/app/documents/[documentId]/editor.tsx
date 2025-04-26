"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Image from '@tiptap/extension-image'
import ImageResize from 'tiptap-extension-resize-image'
import {useEditorStore} from "../../../store/editor-store";
import Underline from '@tiptap/extension-underline'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import {Color} from "@tiptap/extension-color"
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import {FontSizeExtension} from "../../../extensions/font-size"
import {LineHeightExtension} from "../../../extensions/line-height"
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useStorage } from "@liveblocks/react";
import { Threads } from "./threads";

interface EditorProps {
  initialContent: string | undefined;
}

export const Editor = ({initialContent}:EditorProps) => {
  const LiveBlocks = useLiveblocksExtension({
    initialContent,
    offlineSupport_experimental:true,
  })
    const {setEditor} = useEditorStore()

    const leftMargin = useStorage((root)=>root.leftMargin)
    const rightMargin = useStorage((root)=>root.rightMargin)
  const editor = useEditor({
    immediatelyRender:false,
    onCreate: ({editor}) => {
        setEditor(editor)
    },
    onUpdate: ({editor}) => {
        setEditor(editor)
    },
    onDestroy: () => {
        setEditor(null)
    },
    onTransaction: ({editor}) => {
        setEditor(editor)
    },
    onSelectionUpdate: ({editor}) => {
        setEditor(editor)
    },
    onFocus: ({editor}) => {
        setEditor(editor) 
    },
    onBlur: ({editor}) => {
        setEditor(editor)
    },
    onContentError: ({editor}) => {
        setEditor(editor)
    },
    editorProps: {
      attributes: {
        style: `padding-left: ${leftMargin}px; padding-right: ${rightMargin}px;`,
        class:
          "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
    extensions: [
      LiveBlocks,
      StarterKit.configure({
        history:false,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      ImageResize,
      Underline,
      FontFamily,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      FontSizeExtension,
      LineHeightExtension.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: `
        <p><span style="font-family: Inter">Did you know that Inter is a really nice font for interfaces?</span></p>
        <p><span style="font-family: Comic Sans MS, Comic Sans">It doesnt look as professional as Comic Sans.</span></p>
        <p><span style="font-family: serif">Serious people use serif fonts anyway.</span></p>
        <p><span style="font-family: monospace">The cool kids can apply monospace fonts aswell.</span></p>
        <p><span style="font-family: cursive">But hopefully we all can agree, that cursive fonts are the best.</span></p>
        <p><span style="font-family: var(--title-font-family)">Then there are CSS variables, the new hotness.</span></p>
        <p><span style="font-family: 'Exo 2'">TipTap even can handle exotic fonts as Exo 2.</span></p>
      `,
  });
  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
      <div className="min-w-max flex justify-center w-[816px] py-4 mx-auto print:py-0 print:w-full print:min-w-0">
        <EditorContent editor={editor} />
        <Threads editor={editor}/>
      </div>
    </div>
  );
};
