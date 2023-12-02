"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Navbar from "./Navbar";

export default function Profile() {
  const router = useRouter(); // Khai báo useRouter
  const { data: session } = useSession();

  // Sử dụng "if" để kiểm tra session và chuyển hướng

  let email1 = session?.user?.email;

  if (email1 == null) {
    router.push(`/login`);
  }

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const [formData, setFormData] = useState({
    email: session?.user?.email,
    username: session?.user?.name,
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    const { currentPassword, newPassword } = formData;

    if (!currentPassword || !newPassword) {
      console.log("Hãy nhập đủ hai trường để cập nhật mật khẩu");
      return;
    }

    try {
      // Gọi API để xác nhận mật khẩu hiện tại
      const resConfirm = await fetch("/api/confirmPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: currentPassword,
        }),
      });
      const { user } = await resConfirm.json();
      if (!user) {
        console.log("Mật khẩu hiện tại không hợp lệ");
        return;
      } else {
        console.log("check mk hiện tại oke");
      }

      // Gọi API để cập nhật thông tin người dùng
      const res = await fetch("/api/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          newPassword: newPassword,
        }),
      });

      if (res.ok) {
        // Đặt lại form và chuyển hướng sau khi cập nhật thành công
        setFormData({
          email: session.user.email,
          username: session.user.name,
          currentPassword: "",
          newPassword: "",
        });
        router.push("/login");
      } else {
        console.log("Cập nhật thông tin người dùng thất bại.");
      }
    } catch (error) {
      console.log("Lỗi khi gọi API: ", error);
    }
  };

  return (
    <div>
      <Navbar />
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

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSubmit}
            >
              Cập nhật
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
