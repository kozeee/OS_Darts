import { BrowserRouter, Routes, Route, Form } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Modal, TextInput, Checkbox, Label } from "flowbite-react";

export default function BarsPage() {
  const [items, setItems] = useState("Request Status: ");
  const submitForm = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    if (payload.Name === "") {
      return console.log("No name added");
    } else {
      fetch("/api/bar/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((response) => setItems("Request Status: " + response.statusText));
    }
  };

  return (
    <div className="flex flex-col justify-center mt-5">
      <div className="flex flex-row justify-center">
        <h1 className="flex flex-row text-lg bg-slate-600 text-white">
          {items}
        </h1>
      </div>
      <div className="flex flex-row justify-center">
        <form
          onSubmit={submitForm}
          className="flex max-w-lg flex-col gap-4 mt-2"
        >
          <div className="flex flex-row justify-center min-w-8">
            <TextInput
              id="name"
              type="text"
              placeholder="Bar Name"
              name="Name"
            ></TextInput>
          </div>

          <Button type="Submit" className="bg-green-500">
            Add New Bar
          </Button>
        </form>
      </div>
    </div>
  );
}
