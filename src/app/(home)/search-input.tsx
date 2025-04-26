"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParam } from "@/hooks/search-param";
import { SearchIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

export const SearchInput = () => {
    const [searchValue, setSearchValue] = useSearchParam();
  const [value, setValue] = useState(searchValue);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClear = () => {
    setValue("");
    setSearchValue("");
    inputRef.current?.blur();
  };
  const onHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchValue(value);
  };
  return (
    <div className="flex-1 flex items-center justify-center">
      {" "}
      <form className="relative max-w-[720px] w-full" onSubmit={onHandleSubmit}>
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          placeholder="Search"
          className="md:text-base placeholder:text-neutral-500 px-14 w-full border-none focus-visible:shadow-[0_1px_1px_0_rgba(65,69,73,.3),0_1px_1px_0_rgba(65,69,73,.15)] bg-[#F0F4F8] rounded-full h-[48px] focus-visible:ring-0 focus:bg-white"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 rounded-full"
        >
          <SearchIcon />
        </Button>
        {value && (
          <Button
            onClick={handleClear}
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 rounded-full"
          >
            <XIcon />
          </Button>
        )}
      </form>{" "}
    </div>
  );
};
