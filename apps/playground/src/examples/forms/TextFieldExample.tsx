import { useState } from "react";
import { TextField } from "@xco/corex-ui";

export function TextFieldExample() {
  const [name, setName] = useState("Ada Lovelace");
  return <TextField label="Name" value={name} onChange={(value) => setName(value)} />;
}
