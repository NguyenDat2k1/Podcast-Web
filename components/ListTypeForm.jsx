"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

import Navbar from "./Navbar";

export default  function ListTypeForm() {
  const { data: session } = useSession();
 
  const router = useRouter();
 
  // if (!session) redirect("/login");

  const items = [
    { id: 1, title: "Item 1" },
    { id: 2, title: "Item 2" },
    { id: 3, title: "Item 3" },
    { id: 4, title: "Item 4" },
    { id: 5, title: "Item 5" },
    { id: 6, title: "Item 6" },
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
