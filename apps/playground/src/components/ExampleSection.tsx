import { useEffect, useRef, useState } from "react";
import type { ComponentExampleType } from "../data/types";
import { CodeBlock } from "./CodeBlock";
import { extractRawCode } from "../utils/extractRawCode";

export type ExampleSectionPropsType = {
  example: ComponentExampleType;
};

export function ExampleSection({ example }: ExampleSectionPropsType) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [extractedCode, setExtractedCode] = useState<string>("");

  useEffect(() => {
    const node = previewRef.current;
    if (!node) return;

    const update = () => {
      const code = extractRawCode(node);
      setExtractedCode(code);
    };

    // Extract initial raw code
    update();

    // Observe any dynamic mutations in the rendered preview
    const observer = new MutationObserver(() => {
      update();
    });

    observer.observe(node, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [example.Example]);

  const displayCode = extractedCode;

  return (
    <section className="example" key={example.title}>
      <h2>{example.title}</h2>
      <div className="example-preview" ref={previewRef}>
        <example.Example />
      </div>
      {displayCode ? <CodeBlock code={displayCode} language="html" /> : null}
    </section>
  );
}
