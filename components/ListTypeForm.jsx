"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

import Navbar from "./Navbar";

export default function ListTypeForm() {
  const { data: session } = useSession();
  let email = session?.user?.email;
  const router = useRouter();
  if (email == null) {
    router.push(`/login`);
  }
  const items = [
    { id: "A1", title: "Item 1" },
    { id: "A2", title: "Item 2" },
    { id: "B1", title: "Item 3" },
    { id: "B2", title: "Item 4" },
    { id: "C1", title: "Item 5" },
    { id: "C2", title: "Item 6" },
    ,
  ];

  const handleBlockClick = (id) => {
    router.push(`/listType/${id}`);
  };
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 mx-auto max-w-7xl px-4 py-10 mt-42">
        {items.map((item) => (
          <div
            key={item.id}
            className="border-2 border-black p-4 h-72 cursor-pointer"
            onClick={() => handleBlockClick(item.id)}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}
