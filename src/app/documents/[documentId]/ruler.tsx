import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useStorage,useMutation } from "@liveblocks/react";

const markers = Array.from({ length: 83 }, (_, i) => i);
export const Ruler = () => {
    const leftMargin = useStorage((root)=>root.leftMargin) ?? 56
    const rightMargin = useStorage((root)=>root.rightMargin) ?? 56
    const setLeftMargin = useMutation(({storage},position:number)=>{
      storage.set("leftMargin",position)
    },[])
    const setRightMargin = useMutation(({storage},position:number)=>{
      storage.set("rightMargin",position)
    },[])

    // const [leftMargin, setLeftMargin] = useState(56);
    // const [rightMargin, setRightMargin] = useState(56);

    const [isDraggableLeft, setIsDraggableLeft] = useState(false);
    const [isDraggableRight, setIsDraggableRight] = useState(false);

    const rulerRef = useRef<HTMLDivElement>(null);

    const handleLeftMouseDown = () => {
        setIsDraggableLeft(true);
    }
    const handleRightMouseDown = () => {
        setIsDraggableRight(true);
    }
    const handleMouseMove = (e: React.MouseEvent) => {
      if ((isDraggableLeft || isDraggableRight) && rulerRef.current) {
        const container = rulerRef.current.querySelector("#ruler-container");
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const relativeX = e.clientX - containerRect.left;
          const rawPosition = Math.max(0, Math.min(relativeX, 816));

          if (isDraggableLeft) {
            const maxLeftPosition = 816 - rightMargin - 100;
            const newLeftPosition = Math.min(rawPosition, maxLeftPosition);
            setLeftMargin(newLeftPosition);
          }else{
            const maxRightPosition = 816 - (leftMargin + 100);
            const newRightPosition = Math.max(816-rawPosition, 0);
            const constrainedRightPosition = Math.min(newRightPosition, maxRightPosition);
            setRightMargin(constrainedRightPosition);
          }
        }
      }
    }

    const handleMouseUp = () => {
        setIsDraggableLeft(false);
        setIsDraggableRight(false);
    }
    const handleLeftDoubleClick = () => {
        setLeftMargin(56);
    }
    const handleRightDoubleClick = () => {
        setRightMargin(56);
    }
  return (
    <div 
    ref={rulerRef}
    onMouseUp={handleMouseUp}
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseUp}
    className="w-[816px] mx-auto h-6 border-b border-grey-300 flex items-end relative select-none print:hidden">
      <div
        id="ruler-container"
        className="w-full h-full relative"
      >
        <Marker
          position={leftMargin}
          isLeft={true}
          isDraggable={isDraggableLeft}
          onMouseDown={handleLeftMouseDown}
          onDoubleClick={handleLeftDoubleClick}
        />

        <Marker
          position={rightMargin}
          isLeft={false}
          isDraggable={isDraggableRight}
          onMouseDown={handleRightMouseDown}
          onDoubleClick={handleRightDoubleClick}
        />

        <div className="absolute inset-x-0 bottom-0 h-full">
          <div className="relative h-full w-[816px]">
            {markers.map((marker) => {
              const position = (marker * 816) / 82;
              return (
                <div
                  key={marker}
                  className={`absolute bottom-0 `}
                  style={{ left: `${position}px` }}
                >
                  {marker % 10 === 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500" />
                      <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                        {marker / 10 + 1}
                      </span>
                    </>
                  )}
                  {marker % 5 === 0 && marker % 10 !== 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
                    </>
                  )}
                  {marker % 5 !== 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDraggable: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  position,
  isLeft,
  isDraggable,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => (
  <div
    className="absolute top-0 h-full cursor-ew-resize z-[5] group -ml-2"
    style={{ [isLeft ? "left" : "right"]: `${position}px` }}
    onMouseDown={onMouseDown}
    onDoubleClick={onDoubleClick}
    draggable={isDraggable}
  >
    <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
    <div
    className="absolute left-1/2 top-4 transform -translate-x-1/2 duration-150"
    style={{
      height: "100vh",
      width: "1px",
      transform: "scaleX(0.5)",
      backgroundColor:"#3b72f6",
      display: isDraggable ? "block" : "none",
    }}
    />
  </div>
);
