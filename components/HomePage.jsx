"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import YouTube from "react-youtube";
import { redirect, useRouter } from "next/navigation";

export default function UserInfo() {
  const { data: session } = useSession();
  const [updateFlag, setUpdateFlag] = useState(false);
  const [user_ID, setUser_ID] = useState("");
  const [listPodcast, setListPodcast] = useState([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [audioDownload, setAudioDownload] = useState(0);
  const [scriptDownload, setScriptDownload] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();
  let email = session?.user?.email;
  const getYouTubeId1 = (url) => {
    console.log("url is here", url);
    const match = url.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match && match[1];
  };
  useEffect(() => {
    const getListPodcast = async () => {
      try {
        const resListPodcast = await fetch("/api/getAllPodcast", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });
        const resListFavourite = await fetch("/api/getFavouriteList", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });
        const podcasts = await resListPodcast.json();
        const favourites = await resListFavourite.json();
        console.log(podcasts);

        if (Array.isArray(podcasts)) {
          const notLikedPodcasts = podcasts.filter(
            (podcast) =>
              !favourites.some((fav) => fav.podcast_ID === podcast._id)
          );

          setListPodcast(notLikedPodcasts);
        } else {
          console.error("Invalid data structure in the response:");
        }
      } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
      }
    };

    getListPodcast();
  }, [updateFlag]);

  const handleBlockClick = (event, title, id, level) => {
    const isClickedInsideBlock =
      event.target === event.currentTarget ||
      event.target.tagName.toLowerCase() === "span";

    if (isClickedInsideBlock) {
      router.push(`/detailPage/${level}/${title}/${id}`);
    }
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleFavoriteClick = async (podcast) => {
    try {
      console.log("đang thả tym");
      console.log("email fetching: ", email);
      try {
        // Gọi API để kiểm tra user và lấy userID
        const resUserExists = await fetch("api/userExists", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const { user } = await resUserExists.json();
        if (user) {
          await setUser_ID(user._id);
          console.log("đã lấy được id user:", user_ID);
        }
        console.log("đã lấy được user:", podcast._id, user_ID);
        // Gọi API để cập nhật thích podcast
        const res = await fetch("/api/updateLike", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            podcast_ID: podcast._id,
            user_ID: user_ID,
          }),
        });

        if (res.ok) {
          // Tạo một mảng mới không chứa podcast cụ thể
          const updatedList = listPodcast.filter((p) => p._id !== podcast._id);
          setListPodcast(updatedList);

          // Cập nhật trạng thái yêu thích
          // setFavoriteStates((prev) =>
          //   prev.map((state, i) => (i === index ? !state : state))
          // );

          console.log("thả tym podcast thành công.");
        } else {
          console.log("thả tym podcast thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi xử lý tệp âm thanh hoặc văn bản:", error);
      }
    } catch (error) {
      console.error("Lỗi trong handlefavourite:", error);
    }
  };

  const handleAudioDownload = async (e, podcast) => {
    e.preventDefault();

    try {
      console.log("đang tăng lượt tải audio", audioDownload);
      const res = await fetch("/api/updateAudioDowloadCount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podcastID: podcast._id,
        }),
      });
      if (res.ok) {
        setUpdateFlag((prev) => !prev);
        router.push(podcast.audioPath);
      } else {
        console.log("Podcast registration failed.");
      }
      //
    } catch (error) {
      console.error("Error updating download count:", error);
    }
  };

  const handleScriptDownload = async (e, podcast) => {
    e.preventDefault();
    console.log("here there:", podcast.transcriptPath);
    try {
      const res = await fetch("/api/updateScriptDowloadCount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podcastID: podcast._id,
        }),
      });
      if (res.ok) {
        setUpdateFlag((prev) => !prev);
        router.push(podcast.transcriptPath);
      } else {
        console.log("Podcast registration failed.");
      }
    } catch (error) {
      console.error("Error updating script download count:", error);
    }
  };
  return (
    <div>
      <Navbar />

      <div className="bg-gray-300 p-4 text-center h-96">
        Đây là banner của bạn. Bạn có thể tùy chỉnh nội dung và kiểu dáng của
        banner tại đây.
      </div>

      <div className="grid grid-cols-4 gap-4">
        {listPodcast.map((podcast) => (
          <div
            className="border border-gray-300 p-4 relative cursor-pointer"
            key={podcast.name}
            onClick={(event) =>
              handleBlockClick(event, podcast.name, podcast._id, podcast.level)
            }
          >
            <h2>{podcast.name}</h2>

            <audio controls>
              <source src={podcast.audioPath} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

            <a
              href={podcast.audioPath}
              download
              onClick={(e) => {
                if (!isDownloading) {
                  handleAudioDownload(e, podcast);
                }
              }}
            >
              <span className="mr-2">&#8226;</span> Download Audio
            </a>
            <p className="inline-block ml-2">
              Download Count: {podcast.audioDowload}
            </p>
            <br />
            <a
              href={podcast.transcriptPath}
              download
              onClick={(e) => {
                if (!isDownloading) {
                  handleScriptDownload(e, podcast);
                }
              }}
            >
              <span className="mr-2">&#8226;</span> Download Script
            </a>
            <p className="inline-block ml-2">
              Download Count: {podcast.scriptDowload}
            </p>
            <div className="relative w-full h-0 pb-[56.25%] mb-4">
              <YouTube
                videoId={getYouTubeId1(podcast.ytbPath)}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: {
                    autoplay: 0, // Tắt chế độ tự động chạy video
                  },
                }}
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <button
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded text-sm truncate"
              onClick={() => handleFavoriteClick(podcast)}
            >
              Favourite
            </button>
          </div>
        ))}
      </div>
      <footer className="bg-gray-300 p-4 text-center">
        &copy; 2023 Your Website Name
      </footer>
    </div>
  );
}
