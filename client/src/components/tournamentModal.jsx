import {
  Button,
  Modal,
  TextInput,
  Checkbox,
  Label,
  Select,
} from "flowbite-react";
import { useEffect, useState } from "react";
import BarSelect from "./barSelect";
import FormWithPlayerSelects from "./PlayerSelectAmount";
import { Form } from "react-router-dom";

function TournamentModal() {
  const [openModal, setOpenModal] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    console.log(JSON.stringify(payload));

    if (payload.Name === "") {
      return console.log("No name added");
    } else {
      fetch("/api/tournament/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then(setOpenModal(false));
    }
  };

  return (
    <>
      <Button className="mx-2 my-2" onClick={() => setOpenModal(true)}>
        Create New Tournament
      </Button>
      <Modal
        className="flex justify-center"
        size="max-w-lg"
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>Add a new tournament below</Modal.Header>
        <Modal.Body>
          <div className="flex justify-center space-y-6">
            <form
              onSubmit={submitForm}
              className="flex max-w-2xl flex-col gap-4 mt-2"
            >
              <div className="flex flex-row justify-center justify-con min-w-12 gap-4">
                <div>
                  <Label htmlFor="name">Tournament Name</Label>
                  <TextInput
                    id="name"
                    type="text"
                    placeholder="Tournament Name"
                    name="Name"
                  ></TextInput>
                </div>

                <div className="" id="location" name="Bar">
                  <Label htmlFor="location">Location</Label>
                  <BarSelect />
                </div>

                <div className="">
                  <Label htmlFor="gameType">Game Type</Label>
                  <Select name="Mode" id="gameType">
                    <option value="singles">Singles</option>
                    <option value="doubles">Doubles</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="participants">Participants</Label>
                  <TextInput
                    id="participants"
                    type="text"
                    placeholder="#"
                    name="Participants"
                  ></TextInput>
                </div>
              </div>
              <div>
                <FormWithPlayerSelects></FormWithPlayerSelects>
              </div>

              <Button type="Submit" className="bg-green-500">
                <a href="/tournaments">Submit</a>
              </Button>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TournamentModal;
