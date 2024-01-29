import { Button } from "flowbite-react";

const CreateButton = (prop) => {
  return <Button className="my-2 mx-2">Create New {prop.items.name}</Button>;
};

export default CreateButton;
