import type { ComponentExampleType } from "../data/types";
import { CodeBlock } from "./CodeBlock";

export type ExampleSectionPropsType = {
  example: ComponentExampleType;
};

export function ExampleSection({ example }: ExampleSectionPropsType) {
  return (
    <section className="example" key={example.title}>
      <h2>{example.title}</h2>
      <div className="example-preview">
        <example.Example />
      </div>
      {example.code ? <CodeBlock code={example.code} language="tsx" /> : null}
    </section>
  );
}
