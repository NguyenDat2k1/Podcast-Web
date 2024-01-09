"use client";

import { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";
import { redirect, useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

export default function ManageUser() {
  const { data: session } = useSession();
  const [listUser, setListUser] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [podcastCount, setPodcastCount] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  let email = session?.user?.email;

  if (email == null) {
    router.push(`/homePage`);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resListUser = await fetch("/api/getAllUser", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });
        const users = await resListUser.json();
        if (users) {
          console.log("user count : ", users);
          setListUser(users);
        } else {
          console.error("Invalid data structure in the response:");
        }
      } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
      }
    };

    fetchData();
  }, [updateFlag]);

  const handleSetActive = async (user_id, isActive) => {
    try {
      console.log("đang cập nhật trạng thái");
      console.log("status fetching: ", user_id, isActive);
      try {
        // Gọi API để kiểm tra user và lấy userID
        const resIsActive = await fetch("api/setIsActive", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ id: user_id, isActive: isActive }),
        });
        const { user } = await resIsActive.json();
        if (user) {
          console.log("đã cập nhật trạng thái user thành công:", user.isActive);
          setUpdateFlag((prev) => !prev);
        }
      } catch (error) {
        console.error("Lỗi khi xử lý active:", error);
      }
    } catch (error) {
      console.error("Lỗi trong isActive:", error);
    }
  };

  useEffect(() => {
    console.log("again : ", listUser);
    const searchInList = () => {
      const results = listUser.filter((user) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const searchTerms = lowerCaseSearchTerm.split(" ");

        // Kiểm tra xem mỗi từ khóa có xuất hiện trong tên, level hoặc type không
        const isInName = searchTerms.every((term) =>
          user.name.toLowerCase().includes(term)
        );
        const isInEmail = searchTerms.some((term) =>
          user.email.toLowerCase().includes(term)
        );
        const isInRole = searchTerms.some((term) =>
          user.role.toLowerCase().includes(term)
        );

        return isInName || isInEmail || isInRole;
      });
      console.log("result: ", results);
      setSearchResults(results);
    };

    searchInList();
  }, [searchTerm, listUser]);

  console.log("working: ", searchTerm);
  return (
    <div>
      <Navbar />
      <div className="flex justify-between items-center p-4 bg-gray-200 relative">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border border-gray-400 px-2 py-1 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className="absolute left-2 top-2/3 w-1/5 bg-white border rounded mt-1 p-2 overflow-hidden overflow-y-auto max-h-80 z-50">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="mb-2 transition duration-300 ease-in-out transform hover:scale-105 pl-4 cursor-pointer"
                  //   onClick={(event) =>
                  //     handlePodcastClick(
                  //       event,
                  //       user.email,
                  //       user.name,
                  //       podcast._id
                  //     )
                  //   }
                >
                  <p className="text-blue-400 font-bold hover:text-blue-700">
                    {user.name}
                  </p>
                  <p className="hover:text-blue-700">Level: {user.email}</p>
                  <p className="hover:text-blue-700">Type: {user.role}</p>
                  <button
                    className={`ml-2 block border border-2 ${
                      user.isActive === "active" ? "bg-green-300" : "bg-red-300"
                    }`}
                    onClick={() => handleSetActive(user._id, user.isActive)}
                  >
                    {user.isActive}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        {listUser.map((item) => (
          <div
            key={item.id}
            className="border-2 border-black p-4 h-32  m-4 bg-blue-200"
            style={{ width: "calc(25% - 15px)" }}
            // onClick={() => handleBlockClick(item.id)}
          >
            <span className="ml-2 block">Name: {item.name}</span>
            <span className="ml-2 block">Email: {item.email}</span>
            <button
              className={`ml-2 block border border-2 ${
                item.isActive === "active" ? "bg-green-300" : "bg-red-300"
              }`}
              onClick={() => handleSetActive(item._id, item.isActive)}
            >
              {item.isActive}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
