import { useState } from "react";
import { Card, FormLayout, Select, TextField } from "@xco-agency/corex-ui";

export function FormLayoutExample() {
  const [name, setName] = useState("Acme Supply Co.");
  const [email, setEmail] = useState("contact@acme.com");
  const [phone, setPhone] = useState("+212 600 000 000");
  const [city, setCity] = useState("Casablanca");
  const [postcode, setPostcode] = useState("20000");
  const [country, setCountry] = useState("MA");
  const [currency, setCurrency] = useState("MAD");

  return (
    <Card>
      <FormLayout>
        <TextField label="Store name" value={name} onChange={setName} />

        <FormLayout.Group
          title="Contact details"
          helpText="We will use these details for customer communication."
        >
          <TextField label="Email address" value={email} onChange={setEmail} />
          <TextField label="Phone number" value={phone} onChange={setPhone} />
        </FormLayout.Group>

        <FormLayout.Group title="Location">
          <TextField label="City" value={city} onChange={setCity} />
          <TextField label="Postcode" value={postcode} onChange={setPostcode} />
        </FormLayout.Group>

        <FormLayout.Group
          condensed
          title="Regional preferences"
          helpText="Condensed group with tighter spacing between related fields."
        >
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
          <Select
            label="Currency"
            value={currency}
            onChange={setCurrency}
            options={[
              { label: "Moroccan Dirham (MAD)", value: "MAD" },
              { label: "Euro (EUR)", value: "EUR" },
              { label: "US Dollar (USD)", value: "USD" },
            ]}
          />
        </FormLayout.Group>
      </FormLayout>
    </Card>
  );
}

export default FormLayoutExample;
