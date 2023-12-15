"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

const Navbar = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const [updateFlag, setUpdateFlag] = useState(false);
  const [listPodcast, setListPodcast] = useState([]);

  const router = useRouter();

  let email = session?.user?.email;
  if (email == null) {
    router.push(`/homePage`);
  }
  useEffect(() => {
    const getListPodcast = async () => {
      try {
        const resListPodcast = await fetch("/api/getAllPodcast", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });

        const podcasts = await resListPodcast.json();

        console.log(podcasts);

        if (Array.isArray(podcasts)) {
          setListPodcast(podcasts);
        } else {
          console.error("Invalid data structure in the response:");
        }
      } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
      }
    };

    getListPodcast();
  }, [updateFlag]);

  useEffect(() => {
    const searchInList = () => {
      const results = listPodcast.filter((podcast) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const searchTerms = lowerCaseSearchTerm.split(" ");

        // Kiểm tra xem mỗi từ khóa có xuất hiện trong tên, level hoặc type không
        const isInName = searchTerms.every((term) =>
          podcast.name.toLowerCase().includes(term)
        );
        const isInLevel = searchTerms.some((term) =>
          podcast.level.toLowerCase().includes(term)
        );
        const isInType = searchTerms.some((term) =>
          podcast.type.toLowerCase().includes(term)
        );

        return isInName || isInLevel || isInType;
      });
      setSearchResults(results);
    };

    searchInList();
  }, [searchTerm, listPodcast]);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handlePodcastClick = (event, level, title, id) => {
    event.stopPropagation();

    router.push(`/detailPage/${level}/${title}/${id}`);
  };
  const levels = [
    { key: "A1", value: "A1" },
    { key: "A2", value: "A2" },
    { key: "B1", value: "B1" },
    { key: "B2", value: "B2" },
    { key: "C1", value: "C1" },
    { key: "C2", value: "C2" },
  ];

  const types = [
    { key: "Business", value: "Business" },
    { key: "Comedy", value: "Comedy" },
    { key: "Detective", value: "Detective" },
  ];
  return (
    <div>
      <nav className="bg-blue-400 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <p className="text-white text-2xl font-bold">Podcast Site</p>
          </Link>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="ml-20 w-3/4 border rounded py-1 px-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="absolute left-20 top-full w-3/4 bg-white border rounded mt-1 p-2 overflow-hidden overflow-y-auto max-h-80 z-50">
                {searchResults.map((podcast) => (
                  <div
                    key={podcast.id}
                    className="mb-2 transition duration-300 ease-in-out transform hover:scale-105 pl-4 cursor-pointer"
                    onClick={(event) =>
                      handlePodcastClick(
                        event,
                        podcast.level,
                        podcast.name,
                        podcast._id
                      )
                    }
                  >
                    <p className="text-blue-400 font-bold hover:text-blue-700">
                      {podcast.name}
                    </p>
                    <p className="hover:text-blue-700">
                      Level: {podcast.level}
                    </p>
                    <p className="hover:text-blue-700">Type: {podcast.type}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <ul className="flex space-x-4">
            <li className="relative">
              <Link href="/favouriteList">
                <button className="text-white border border-blue-400 rounded px-2 py-1">
                  Favourite List
                </button>
              </Link>
            </li>
            <li className="relative">
              <Link href="/historySeen">
                <button className="text-white border border-blue-400 rounded px-2 py-1">
                  History Seen
                </button>
              </Link>
            </li>
            <li className="relative">
              {session?.user?.name === "Admin" && (
                <Link href="/dashboard">
                  <button className="text-white border border-blue-400 rounded px-2 py-1">
                    Dashboard
                  </button>
                </Link>
              )}
            </li>
            <li className="relative">
              {session?.user?.name === "Admin" && (
                <Link href="/listType">
                  <button className="text-white border border-blue-400 rounded px-2 py-1">
                    Manage Podcast
                  </button>
                </Link>
              )}
            </li>
            <li className="relative">
              {session?.user?.name === "Admin" && (
                <Link href="/manageUser">
                  <button className="text-white border border-blue-400 rounded px-2 py-1">
                    Manage User
                  </button>
                </Link>
              )}
            </li>
            <li className="relative">
              {email == null && (
                <Link href="/login">
                  <button className="text-white border border-blue-400 rounded px-2 py-1">
                    Login/Register
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
                <div className="absolute top-full left-0 bg-blue-400 w-48 mt-2 z-50">
                  <Link href="/profile">
                    <div className="p-2 hover:bg-blue-700">Trang Cá Nhân</div>
                  </Link>
                  <div
                    className="p-2 hover:bg-blue-700 cursor-pointer"
                    onClick={() => signOut()}
                    // onClick={handleSignOut}
                  >
                    Logout
                  </div>
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
