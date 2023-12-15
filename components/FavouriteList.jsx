"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { redirect, useRouter } from "next/navigation";
import YouTube from "react-youtube";
import { useSession } from "next-auth/react";

export default function FavouriteList() {
  const { data: session } = useSession();
  const [listPodcast, setListPodcast] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [user_ID, setUser_ID] = useState("");
  let email = session?.user?.email;
  let audioPath = "";
  let transcriptPath = "";
  let ytbPath = "";
  const router = useRouter();
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
        const resListFavourite = await fetch("/api/getFavouriteList", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });
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
        const podcasts = await resListPodcast.json();
        const favourites = await resListFavourite.json();
        console.log(podcasts);

        if (Array.isArray(podcasts)) {
          // const likedPodcasts = podcasts.filter((podcast) =>
          //   favourites.some((fav) => fav.podcast_ID === podcast._id)
          // );
          const listFav = favourites.filter((fav) => fav.user_ID === user._id);
          const likedPodcasts = podcasts.filter((podcast) =>
            listFav.some((fav) => fav.podcast_ID === podcast._id)
          );

          setListPodcast(likedPodcasts);
        } else {
          console.error("Invalid data structure in the response:");
        }
      } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
      }
    };

    getListPodcast();
  }, [updateFlag]);

  const getYouTubeId1 = (url) => {
    console.log("url is here", url);
    const match = url.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match && match[1];
  };

  const handleBlockClick = async (event, title, id, level) => {
    const isClickedInsideBlock =
      event.target === event.currentTarget ||
      event.target.tagName.toLowerCase() === "span";
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
      const res = await fetch("/api/addToHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podcast_ID: id,
          user_ID: user_ID,
        }),
      });

      if (res.ok) {
        console.log("cập nhật history podcast thành công.");
      } else {
        console.log("cập nhật podcast thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý tệp âm thanh hoặc văn bản:", error);
    }
    if (isClickedInsideBlock) {
      router.push(`/detailPage/${level}/${title}/${id}`);
    }
  };

  const handleFavoriteClick = async (podcast) => {
    try {
      console.log("đang xóa tym");
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
        const res = await fetch("/api/updateUnlike", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            podcastID: podcast._id,
            userID: user_ID,
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

          console.log("XÓa tym podcast thành công.");
        } else {
          console.log("Xóa tym podcast thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi xử lý Xóa tym:", error);
      }
    } catch (error) {
      console.error("Lỗi trong handlefavourite:", error);
    }
  };
  return (
    <div>
      <Navbar />

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

            <a href={podcast.audioPath} download>
              <span className="mr-2">&#8226;</span> Download Audio
            </a>
            <br />
            <a href={podcast.transcriptPath} download>
              <span className="mr-2">&#8226;</span> Download Script
            </a>
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
              UnLike
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
