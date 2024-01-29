import { Navbar } from "flowbite-react";

export default function Header() {
  return (
    <Navbar className="bg-slate-600 text-white" fluid>
      <Navbar.Collapse>
        <Navbar.Link href="/home" className="text-white ">
          Home
        </Navbar.Link>
        <Navbar.Link href="/tournaments" className="text-white">
          Tournaments
        </Navbar.Link>
        <Navbar.Link href="/players" className="text-white">
          Players
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
