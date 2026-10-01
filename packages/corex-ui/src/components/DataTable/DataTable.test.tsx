import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { DataTable } from "./DataTable";

describe("DataTable", () => {
  it("renders headings and rows as a table", () => {
    const { container } = render(
      <DataTable
        headings={["Product", "Units"]}
        rows={[
          ["Shirt", "12"],
          ["Cap", "4"],
        ]}
      />,
    );

    expect(container.querySelectorAll("s-table-header")).toHaveLength(2);
    expect(container.querySelectorAll("s-table-row")).toHaveLength(2);
    expect(container.querySelectorAll("s-table-cell")).toHaveLength(4);
  });

  it("marks numeric columns through the header's own format", () => {
    const { container } = render(
      <DataTable
        columnContentTypes={["text", "numeric"]}
        headings={["Product", "Units"]}
        rows={[["Shirt", "12"]]}
      />,
    );
    const headers = Array.from(container.querySelectorAll("s-table-header"));

    expect(headers[0]).not.toHaveAttribute("format");
    expect(headers[1]).toHaveAttribute("format", "numeric");
  });
});
