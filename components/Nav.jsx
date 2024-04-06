import { FloatingNav } from "./ui/floating-navbar";
import { UserIcon, ImageIcon, HomeIcon } from "lucide-react";

const links = [
  { link: "/", name: "Home", icon: <HomeIcon /> },
  { link: "/gallery", name: "Gallery", icon: <UserIcon /> },
  { link: "/playground", name: "Playground", icon: <ImageIcon /> },
];

const Nav = () => {
  return <FloatingNav navItems={links} />;
};

export default Nav;
