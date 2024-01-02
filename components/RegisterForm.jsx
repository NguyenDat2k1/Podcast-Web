"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSumbit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All Fields are necessary.");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/login");
        const templateParams = {
          from_name: "podcastWeb",
          to_name: name,
          message: "Wellcome the new member",
        };
        console.log("đã vào được đến đây");
        emailjs
          .send(
            "service_vk9agiz",
            "template_7773sss",
            templateParams,
            "hBunhHDWnDYqUNC-W"
          )
          .then((response) => {
            console.log("SUCCESS!", response.status, response.text);
          })
          .catch((error) => {
            console.log("FAILED...", error);
            console.log("đã vào được đến fail");
          });
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };
  console.log("Name: ", name);
  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Register</h1>

        <form onSubmit={handleSumbit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
            Register
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          <Link className="text-sm mt-3 text-right" href={"/"}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
