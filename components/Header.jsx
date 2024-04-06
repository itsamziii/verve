"use client";
import Nav from "./Nav";

const Header = () => {
  return (
    <header className={`sticky z-30 transition-all`}>
      <Nav />
    </header>
  );
};

export default Header;
