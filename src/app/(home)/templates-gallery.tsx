"use client";

import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { templates } from "../constants/templates";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { toast } from "sonner";

export const TemplatesGallery = () => {
  const router = useRouter();
  const create = useMutation(api.document.create);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (title: string, initialContent: string) => {
    setIsCreating(true);
    create({
      title,
      initialContent,
    }).catch(() => {
      toast.error("Something went wrong");
    })
    .then((documentId) => {
      toast.success("Document created");
      router.push(`/documents/${documentId}`);
      setIsCreating(false);
    });
    
  };

  return (
    !isCreating ? <div className="bg-[#F1F3F4]">
      <div className="flex flex-col py-6 px-16 mx-auto max-w-screen-xl gap-y-4">
        <h3 className="font-medium">Start a new document</h3>
        <Carousel>
          <CarouselContent>
            {templates.map((template) => (
              <CarouselItem
                key={template.id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-4"
              >
                <div
                  className={cn(
                    "aspect-[3/4] flex flex-col gap-y-2.5",
                    isCreating && "pointer-events-none opacity-50"
                  )}
                >
                  <button
                    disabled={isCreating}
                    onClick={() => handleCreate(template.name, template.initialContent)}
                    style={{
                      backgroundImage: `url(${template.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                    className="size-full hover:border-blue-500 rounded-sm border hover:bg-blue-50 transition flex flex-col items-center justify-center gap-y-4 bg-white"
                  />

                  <p className="text-sm font-medium truncate">
                    {template.name}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div> : <FullscreenLoader label="Creating your document...."/>
  );
};
