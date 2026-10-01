import { useState } from "react";
import { Card, FormLayout, Select, TextField } from "@xco-agency/corex-ui";

export function FormLayoutExample() {
  const [name, setName] = useState("Acme Supply Co.");
  const [city, setCity] = useState("Casablanca");
  const [postcode, setPostcode] = useState("20000");
  const [country, setCountry] = useState("MA");

  return (
    <Card>
      <FormLayout>
        <TextField label="Store name" value={name} onChange={setName} />
        <FormLayout.Group>
          <TextField label="City" value={city} onChange={setCity} />
          <TextField label="Postcode" value={postcode} onChange={setPostcode} />
        </FormLayout.Group>
        <FormLayout.Group condensed>
          <Select
            label="Country"
            value={country}
            onChange={setCountry}
            options={[
              { label: "Morocco", value: "MA" },
              { label: "France", value: "FR" },
              { label: "Canada", value: "CA" },
            ]}
          />
        </FormLayout.Group>
      </FormLayout>
    </Card>
  );
}
