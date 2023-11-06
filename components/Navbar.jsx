"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import React from "react";

const Navbar = () => {
  const { data: session } = useSession();
  console.log(session?.user?.name);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };
 
  return (
    <div>
      <nav className="bg-blue-400 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <p className="text-white text-2xl font-bold">Podcast Site</p>
          </Link>
          <div className="relative w-200">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full border rounded py-1 px-2"
            />
            <button className="absolute right-0 top-0 m-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 111.397-1.397h0l3.85 3.85a1 1 0 01-1.415 1.415l-3.85-3.85zm-.397 0a5.5 5.5 0 10-1.397 1.397h0l-3.85 3.85a1 1 0 11-1.415-1.415l3.85-3.85z" />
              </svg>
            </button>
          </div>
          <ul className="flex space-x-4">
            <li className="relative">
              {session?.user?.name === "Admin" && (
                <Link href="/listType">
                  <button className="text-white border border-blue-400 rounded px-2 py-1 mr-2">
                    Create New Podcast
                  </button>
                </Link>
              )}
            </li>

            <li className="relative">
              <button
                className="text-white pt-1.5"
                onClick={() => toggleProfileMenu()}
              >
                {session?.user?.name}
              </button>
              {profileMenuOpen && (
                <div className="absolute top-full left-0 bg-blue-400 w-48 mt-2">
                  <Link href="/profile">
                    <div className="p-2 hover:bg-blue-700">Trang Cá Nhân</div>
                  </Link>
                  {/* <div
                    className="p-2 hover-bg-blue-700 cursor-pointer"
                    onClick={() => signOut()}
                   
                  >
                    Log Out
                  </div> */}
                  <Link href="/login">
                    <div className="p-2 hover:bg-blue-700">Logout</div>
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
