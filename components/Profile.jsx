"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function Profile() {
  const { data: session } = useSession();

  if (session) redirect("/login");

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const [formData, setFormData] = useState({
    email: session?.user?.email,
    username: session?.user?.name,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    // e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    // if ( !currentPassword ) {
    //   console.log(currentPassword);
    //   alert('Mật khẩu hiện tại không hợp lệ');
    //   return;
    // }

    if (currentPassword !== session?.user?.password) {
      console.log(session?.user?.password);
      alert("Mật khẩu hiện tại không hợp lệ");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới và nhập lại mật khẩu mới không khớp");
      return;
    }

    try {
      const res = await fetch("api/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };
  return (
    <div>
      <nav className="bg-blue-400 p-4">
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
              <Link href="/register">
                <p className="text-white">Register</p>
              </Link>
            </li>
            <li className="relative">
              <button
                className="text-white"
                onClick={() => toggleProfileMenu()}
              >
                {session?.user?.name}
              </button>
              {profileMenuOpen && (
                <div className="absolute top-full left-0 bg-blue-400 w-48 mt-2">
                  <Link href="/profile">
                    <div className="p-2 hover:bg-blue-700">Trang Cá Nhân</div>
                  </Link>
                  <div
                    className="p-2 hover:bg-blue-700"
                    onClick={() => signOut()}
                  >
                    Log Out
                  </div>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>

      <div className="flex h-screen items-center justify-center">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/2">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Tên tài khoản
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Tên tài khoản"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="current-password"
            >
              Mật khẩu hiện tại
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="current-password"
              type="password"
              placeholder="Mật khẩu hiện tại"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="new-password"
            >
              Mật khẩu mới
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="new-password"
              type="password"
              placeholder="Mật khẩu mới"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirm-password"
            >
              Nhập lại mật khẩu mới
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="confirm-password"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSubmit}
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>

      <footer className="bg-gray-300 p-4 text-center absolute bottom-0 w-full">
        &copy; 2023 Your Website Name
      </footer>
    </div>
  );
}
