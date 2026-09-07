import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { ParagraphPropsType } from "./Paragraph.types";

const SParagraph = createWebComponent<HTMLElement>("s-paragraph");

export const Paragraph = forwardRef<HTMLElement, ParagraphPropsType>(
  function Paragraph({ children, className, style, ...rest }, ref) {
    if (!children && children !== 0) return null;

    return (
      <SParagraph ref={ref} className={className} style={style} {...rest}>
        {children}
      </SParagraph>
    );
  },
);
