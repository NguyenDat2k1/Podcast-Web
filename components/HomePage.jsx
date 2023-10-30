"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Navbar from "./Navbar";

export default function UserInfo() {
  const { data: session } = useSession();
  const items = [
    { id: 1, title: "Item 1" },
    { id: 2, title: "Item 2" },
    { id: 3, title: "Item 3" },
    { id: 4, title: "Item 4" },
    { id: 5, title: "Item 5" },
    { id: 6, title: "Item 6" },
    ,
  ];

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <div>
      <Navbar />

      <div className="bg-gray-300 p-4 text-center h-96">
        Đây là banner của bạn. Bạn có thể tùy chỉnh nội dung và kiểu dáng của
        banner tại đây.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 mx-auto max-w-7xl px-4 py-10 mt-72">
        {items.map((item) => (
          <div key={item.id} className="border-2 border-black p-4 h-72">
            {" "}
            {/* Thêm lớp h-72 để chiều cao tăng thêm 50px */}
            {item.title}
          </div>
        ))}
      </div>
      <footer className="bg-gray-300 p-4 text-center">
        &copy; 2023 Your Website Name
      </footer>
    </div>
  );
}
