import { Button, Modal, TextInput, Checkbox, Label } from "flowbite-react";
import { useEffect, useState } from "react";

function PlayerModal() {
  const [openModal, setOpenModal] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    if (payload.Name === "") {
      return console.log("No name added");
    } else {
      fetch("/api/player/create", {
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
        Create New Player
      </Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add a new player below</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form
              onSubmit={submitForm}
              className="flex max-w-lg flex-col gap-4 mt-2"
            >
              <div className="flex flex-row justify-center min-w-8">
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Player Name"
                  name="Name"
                ></TextInput>
                <div className="mx-4">
                  <Label htmlFor="member">Is Member?</Label>
                  <Checkbox
                    className="mx-2"
                    id="member"
                    name="Membership"
                  ></Checkbox>
                </div>
              </div>

              <Button type="Submit" className="bg-green-500">
                Submit
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

export default PlayerModal;
