"use client";

import Link from 'next/link';
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";


export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <p className="text-white text-2xl font-bold">Trang Chủ</p>
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/about">
              <p className="text-white">Giới Thiệu</p>
            </Link>
          </li>
          <li>
            <Link href={"/register"}>
              <p className="text-white">Register</p>
            </Link>
          </li>
          <li>
          <button
          onClick={() => signOut()}
          className=" text-white "
        >
          Log Out
        </button>
          </li>
        </ul>
      </div>
    </nav>
  );
  (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white font-bold px-6 py-2 mt-3"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}