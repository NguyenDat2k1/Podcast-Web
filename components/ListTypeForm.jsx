"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { redirect } from "next/navigation";
import Navbar from "./Navbar";

export default function ListTypeForm() {
  const { data: session } = useSession();

  if (!session) redirect("/login");

  const items = [
    { id: 1, title: "Item 1" },
    { id: 2, title: "Item 2" },
    { id: 3, title: "Item 3" },
    { id: 4, title: "Item 4" },
    { id: 5, title: "Item 5" },
    { id: 6, title: "Item 6" },
    ,
  ];
  const [showPopup, setShowPopup] = useState(null);

  const openPopup = (id) => {
    setShowPopup(id);
  };

  const closePopup = () => {
    setShowPopup(null);
  };
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 mx-auto max-w-7xl px-4 py-10 mt-42">
        {items.map((item) => (
          <div
            key={item.id}
            className="border-2 border-black p-4 h-72 cursor-pointer"
            onClick={() => openPopup(item.id)}
          >
            {item.title}
          </div>
        ))}
      </div>

      {showPopup !== null && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Tên:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 p-2 block w-full border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Mô tả:
              </label>
              <textarea
                id="description"
                name="description"
                className="mt-1 p-2 block w-full border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="audio"
                className="block text-sm font-medium text-gray-700"
              >
                File âm thanh:
              </label>
              <input
                type="file"
                id="audio"
                name="audio"
                accept="audio/*"
                className="mt-1 block"
              />
            </div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
              onClick={closePopup}
            >
              Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
