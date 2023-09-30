import Image from "next/image";
import React from "react";
import { ImStatsBars } from "react-icons/im";

function Header() {
  return (
    <header className="flex max-w-2xl mx-auto p-6">
      {/*user info*/}
      <div className="flex items-center gap-4 mr-auto">
      {/* image */}
      <div className="relative  w-10 h-10"> 
        <Image
          src="https://www.thispersondoesnotexist.com/"
          alt="profile image"
          fill
          className="rounded-full"
          sizes="10vw"
        />
      </div>
      {/* name */}
      <p>Hi, Leon!</p></div>



      {/* right side */}
      <nav className="flex gap-4 items-center">
        <div><ImStatsBars className="text-2xl"/></div>
        <div><button className="btn btn-danger">Login Button</button></div>

      </nav>
    </header>
  );
}

export default Header;
