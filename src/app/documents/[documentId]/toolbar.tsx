"use client";
import { cn } from "@/lib/utils";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronDownIcon,
  HighlighterIcon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  ListCollapseIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  MinusIcon,
  PlusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SearchIcon,
  Underline,
  Undo2Icon,
  UploadIcon,
} from "lucide-react";
import { useEditorStore } from "../../../store/editor-store";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { type Level } from "@tiptap/extension-heading";
import { type ColorResult, SketchPicker } from "react-color";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { Ruler } from "./ruler";

const ImageButton = () => {
  const { editor } = useEditorStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const onHandleChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        onHandleChange(url);
      }
    };
    input.click();
  };

  const imageUrlSubmit = () => {
    onHandleChange(imageUrl);
    setImageUrl("");
    setIsDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-7 min-w-7 shrink-0 flex flex-col justify-center items-center rounded-sm hover:bg-neutral-400/80 px-1.5 overflow-hidden text-sm ">
            <ImageIcon />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onUpload}>
            <UploadIcon className="size-4 mr-2" />
            Upload Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <SearchIcon className="size-4 mr-2" />
            Paste Image URL
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Insert image url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                imageUrlSubmit();
              }
            }}
          />
          <DialogFooter>
            <Button onClick={imageUrlSubmit}>Add Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const LinkButton = () => {
  const { editor } = useEditorStore();
  const link = editor?.getAttributes("link")?.href || "";

  const [value, setValue] = useState(link);

  const onHandleChange = (href: string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setValue("");
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          setValue(editor?.getAttributes("link").href || "");
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col justify-center items-center rounded-sm hover:bg-neutral-400/80 px-1.5 overflow-hidden text-sm ">
          <Link2Icon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex p-2.5 gap-x-2">
        <Input
          placeholder="http://example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={() => onHandleChange(value)}>Add Link</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontFamilyButton = () => {
  const { editor } = useEditorStore();
  const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georgia", value: "Georgia" },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-[120px] shrink-0 flex justify-between items-center rounded-sm hover:bg-neutral-400/80 px-1.5 overflow-hidden text-sm ">
          <span className="truncate">
            {editor?.getAttributes("textStyle")?.fontFamily || "Arial"}
          </span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {fonts.map(({ label, value }) => (
          <button
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-400/80 ",
              editor?.getAttributes("textStyle")?.fontFamily === value &&
                "bg-neutral-400/80"
            )}
            style={{ fontFamily: value }}
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
          >
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HeadingsButton = () => {
  const { editor } = useEditorStore();
  const headings = [
    { label: "Normal Text", value: 0, fontSize: "16px" },
    { label: "Heading 1", value: 1, fontSize: "32px" },
    { label: "Heading 2", value: 2, fontSize: "24px" },
    { label: "Heading 3", value: 3, fontSize: "20px" },
  ];

  const getHeading = () => {
    for (let i = 1; i < headings.length; i++) {
      if (editor?.isActive("heading", { level: i })) {
        return `Heading ${i}`;
      }
    }
    return "Normal Text";
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-[120px] shrink-0 flex justify-between items-center rounded-sm hover:bg-neutral-400/80 px-1.5 overflow-hidden text-sm ">
          <span className="truncate">{getHeading()}</span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {headings.map(({ label, value, fontSize }) => (
          <button
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-400/80 ",
              ((value == 0 && !editor?.isActive("heading")) ||
                editor?.isActive("heading", { level: value })) &&
                "bg-neutral-400/80"
            )}
            style={{ fontSize: fontSize }}
            onClick={() => {
              if (value == 0) {
                editor?.chain().focus().setParagraph().run();
              } else {
                editor
                  ?.chain()
                  .focus()
                  .setHeading({ level: value as Level })
                  .run();
              }
              console.log("value: ", value);
            }}
          >
            {label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TextColorButton = () => {
  const { editor } = useEditorStore();
  const color = editor?.getAttributes("textStyle")?.color || "#000000";

  const setColor = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col justify-center items-center rounded-sm hover:bg-neutral-400/80 px-1.5 overflow-hidden text-sm ">
          <span className="truncate">A</span>
          <div style={{ backgroundColor: color }} className="h-1 w-full" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <SketchPicker color={color} onChange={setColor} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HighlightButton = () => {
  const { editor } = useEditorStore();
  const highlight = editor?.getAttributes("highlight")?.color || "#FFFFFF";

  const setHighlight = (color: ColorResult) => {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col justify-center items-center rounded-sm hover:bg-neutral-400/80 px-1.5 overflow-hidden text-sm ">
          <HighlighterIcon />

          <div style={{ backgroundColor: highlight }} className="h-1 w-full" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <SketchPicker color={highlight} onChange={setHighlight} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AlignButtons = () => {
  const { editor } = useEditorStore();

  const alignments = [
    { label: "Align Left", value: "left", icon: AlignLeftIcon },
    { label: "Align Center", value: "center", icon: AlignCenterIcon },
    { label: "Align Right", value: "right", icon: AlignRightIcon },
    { label: "Align Justify", value: "justify", icon: AlignJustifyIcon },
  ];

  const getAlignment = () => {
    for (let i = 0; i < alignments.length; i++) {
      if (editor?.isActive({ textAlign: alignments[i].value })) {
        return alignments[i].icon;
      }
    }
    return AlignLeftIcon;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col justify-center items-center rounded-sm hover:bg-neutral-400/80 px-1.5 overflow-hidden text-sm ">
          {React.createElement(getAlignment())}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {alignments.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => editor?.chain().focus().setTextAlign(value).run()}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-400/80 w-full",
              editor?.isActive({ textAlign: value }) && "bg-neutral-400/80"
            )}
          >
            <Icon className="size-4 mr-2" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ListItemButton = () => {
  const { editor } = useEditorStore();

  const lists = [
    {
      label: "Bullet List",
      icon: ListIcon,
      value: editor?.isActive("bulletList"),
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      icon: ListOrderedIcon,
      value: editor?.isActive("orderedList"),
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];

  const getList = () => {
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].value) {
        return lists[i].icon;
      }
    }
    return ListIcon;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col justify-center items-center rounded-sm hover:bg-neutral-400/80 px-1.5 overflow-hidden text-sm ">
          {React.createElement(getList())}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {lists.map(({ label, value: isActive, icon: Icon, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-400/80 w-full",
              isActive && "bg-neutral-400/80"
            )}
          >
            <Icon className="size-4 mr-2" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LineHeightButton = () => {
  const { editor } = useEditorStore();

  const lineHeights = [
    {label: "Normal", value: "normal"},
    {label:"single", value: "1"},
    {label: "1.15", value: "1.15"},
    {label: "1.5", value: "1.5"},
    {label: "Double", value: "2"},
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col justify-center items-center rounded-sm hover:bg-neutral-400/80 px-1.5 overflow-hidden text-sm ">
          <ListCollapseIcon/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {lineHeights.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => editor?.chain().focus().setLineHeight(value).run()}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-400/80 w-full",
              editor?.getAttributes("paragraph").lineHeight === value && "bg-neutral-400/80"
            )}
          >
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


const FontSizeButton = () => {
  const { editor } = useEditorStore();

  const currentFontSize = editor?.getAttributes("textStyle")?.fontSize
    ? editor?.getAttributes("textStyle")?.fontSize.replace("px", "")
    : "16";

  const [fontSize, setFontSize] = useState(currentFontSize);
  const [inputValue, setInputValue] = useState(currentFontSize);
  const [isEditting, setIsEditting] = useState(false);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${fontSize}px`).run();
      setFontSize(newSize);
      setInputValue(newSize);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleBlur = () => {
    updateFontSize(inputValue);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const incrementFontSize = () => {
    const size = parseInt(fontSize) + 1;
    updateFontSize(size.toString());
  };

  const decreaseFontSize = () => {
    const size = parseInt(fontSize) - 1;
    if (size > 0) {
      updateFontSize(size.toString());
    }
  };

  return (
    <div className="flex items-center gap-x-0.5">
      <button
        onClick={decreaseFontSize}
        className="h-7 min-w-7 shrink-0 flex flex-col justify-center items-center rounded-sm hover:bg-neutral-400/80 "
      >
        <MinusIcon className="size-4" />
      </button>
      {isEditting ? (
        <input 
        value={inputValue}
        type="text"
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-7 w-10 text-center text-sm border border-neutral-400 rounded-sm bg-transparent focus:outline-none focus:ring-0 cursor-text"
        />
      ) : (
        <button
          onClick={() => {
            setIsEditting(true);
            updateFontSize(currentFontSize);
          }}
          className="h-7 w-10 text-center text-sm border border-neutral-400 rounded-sm hover:bg-neutral-400/80"
        >
          {currentFontSize}
        </button>
      )}
      <button
        onClick={incrementFontSize}
        className="h-7 min-w-7 shrink-0 flex flex-col justify-center items-center rounded-sm hover:bg-neutral-400/80 "
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: LucideIcon;
}

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-400/80",
        isActive && "bg-neutral-400/80"
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};

function Toolbar() {
  const { editor } = useEditorStore();

  const sections: {
    label: string;
    onClick: () => void;
    isActive: boolean;
    icon: LucideIcon;
  }[][] = [
    [
      {
        label: "undo",
        onClick: () => {
          editor?.chain().focus().undo().run();
        },
        isActive: false,
        icon: Undo2Icon,
      },
      {
        label: "redo",
        onClick: () => {
          editor?.chain().focus().redo().run();
        },
        isActive: false,
        icon: Redo2Icon,
      },
      {
        label: "print",
        onClick: () => {
          window.print();
        },
        isActive: false,
        icon: PrinterIcon,
      },
    ],
    [
      {
        label: "bold",
        onClick: () => {
          editor?.chain().focus().toggleMark("bold").run();
        },
        isActive: editor?.isActive("bold") ?? false,
        icon: BoldIcon,
      },
      {
        label: "italic",
        onClick: () => {
          editor?.chain().focus().toggleMark("italic").run();
        },
        isActive: editor?.isActive("italic") ?? false,
        icon: ItalicIcon,
      },
      {
        label: "underline",
        onClick: () => {
          editor?.chain().focus().toggleUnderline().run();
        },
        isActive: editor?.isActive("underline") ?? false,
        icon: Underline,
      },
    ],
    [
      {
        label: "comment",
        onClick: () => {
          editor?.chain().focus().addPendingComment().run();
        },
        isActive: editor?.isActive("liveblockCommentMark") ?? false,
        icon: MessageSquarePlusIcon,
      },
      {
        label: "task list",
        onClick: () => {
          editor?.chain().focus().toggleTaskList().run();
        },
        isActive: editor?.isActive("taskList") ?? false,
        icon: ListTodoIcon,
      },
      {
        label: "remove formatting",
        onClick: () => {
          editor?.chain().focus().unsetAllMarks().run();
        },
        isActive: false,
        icon: RemoveFormattingIcon,
      },
    ],
  ];
  return (
    <>
    <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
      {sections[0].map((button) => (
        <ToolbarButton key={button.label} {...button} />
      ))}
      <FontFamilyButton />
      <HeadingsButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <FontSizeButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      {sections[1].map((button) => (
        <ToolbarButton key={button.label} {...button} />
      ))}
      <TextColorButton />
      <HighlightButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <LinkButton />
      <ImageButton />
      <AlignButtons />
      <LineHeightButton/>
      <ListItemButton />
      {sections[2].map((button) => (
        <ToolbarButton key={button.label} {...button} />
      ))}
    </div>
    <Ruler/>
    </>
  );
}

export default Toolbar;
