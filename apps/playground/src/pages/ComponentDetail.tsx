import { Navigate, useParams } from "react-router-dom";
import { registry } from "../data/registry";
import { CodeBlock } from "../components/CodeBlock";
import { SandboxNote } from "../components/SandboxNote";

export function ComponentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const entry = registry.find((item) => item.slug === slug);

  if (!entry) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page">
      <span className="component-category">{entry.category}</span>
      <h1>{entry.name}</h1>
      <p className="page-intro">{entry.description}</p>

      {entry.requiresEmbeddedContext && <SandboxNote />}

      {entry.examples.map((example) => (
        <section className="example" key={example.title}>
          <h2>{example.title}</h2>
          <div className="example-preview">
            <example.Example />
          </div>
          <CodeBlock code={example.code} />
        </section>
      ))}
    </div>
  );
}
