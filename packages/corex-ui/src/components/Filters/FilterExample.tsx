import { useRef } from "react";
import {
  FilterPortalPopover,
  type PopoverHandleType,
  type FilterPortalPopoverPropsType,
} from "./FilterPortalPopover";

export type PopoverHandle = PopoverHandleType;
export type PopoverProps = FilterPortalPopoverPropsType;
export const Popover = FilterPortalPopover;

export default function Example() {
  const filterRef = useRef<PopoverHandleType>(null);

  return (
    <>
      <Popover ref={filterRef} trigger={<button type="button">Filter</button>}>
        <div>Filter content</div>
      </Popover>
      <br />
      <button type="button" onClick={() => filterRef.current?.toggle()}>
        toggle
      </button>
      <button type="button" onClick={() => filterRef.current?.open()}>
        open
      </button>
      <button type="button" onClick={() => filterRef.current?.close()}>
        close
      </button>
    </>
  );
}
