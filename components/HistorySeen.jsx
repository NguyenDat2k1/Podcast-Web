"use client";

import { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

export default function HistorySeen() {
  const { data: session } = useSession();
  const [listPodcast, setListPodcast] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [user_ID, setUser_ID] = useState("");
  let email = session?.user?.email;

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
        const resHistoryList = await fetch("/api/getHistoryList", {
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
        const historyList = await resHistoryList.json();
        console.log(podcasts);
        console.log("đã lấy được historyList:", historyList);
        if (Array.isArray(podcasts)) {
          const listHistory = historyList.filter(
            (his) => his.user_ID === user._id
          );
          console.log("listHistory: ", listHistory);
          const likedPodcasts = listHistory.filter((podcast) =>
            podcasts.some((his) => his._id === podcast.podcast_ID)
          );
          console.log("likedPodcasts: ", likedPodcasts);
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

  const handleBlockClick = (event, title, id, level) => {
    const isClickedInsideBlock =
      event.target === event.currentTarget ||
      event.target.tagName.toLowerCase() === "span";

    if (isClickedInsideBlock) {
      router.push(`/detailPage/${level}/${title}/${id}`);
    }
  };

  const formatDate = (dateString) => {
    try {
      console.log("datesstring: ", dateString);
      const tempDate = String(dateString);
      const newDate = tempDate.substring(0, 10);
      console.log("datesstring after: ", newDate);
      return newDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  //xóa bản ghi trong lịch sử
  const handleDeleteClick = async (podcast) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa không?");

    if (isConfirmed) {
      try {
        console.log("delete fileeeee is coming");

        try {
          const res = await fetch("/api/deleteHistory", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              historyID: podcast._id,
            }),
          });

          if (res.ok) {
            setUpdateFlag((prev) => !prev);
            console.log("XÓA podcast thành công.");
          } else {
            console.log("XÓA podcast thất bại.");
          }
        } catch (error) {
          console.error("Lỗi khi xử lý tệp âm thanh hoặc văn bản:", error);
        }
      } catch (error) {
        console.error("XÓA trong handleUpdate:", error);
      }
    }
  };
  console.log("list:", listPodcast);

  // const groupedData = listPodcast.reduce((podcastGroup, currentRecord) => {
  //   const existingGroup = podcastGroup.find(
  //     (group) =>
  //       formatDate(group[0].updatedAt) === formatDate(currentRecord.updatedAt)
  //   );

  //   if (existingGroup) {
  //     existingGroup.push(currentRecord);
  //   } else {
  //     podcastGroup.push([currentRecord]);
  //   }

  //   return podcastGroup;
  // }, []);
  // console.log("groupedData: ", groupedData);
  return (
    <div>
      <Navbar />
      <div className="flex justify-between items-center p-4 bg-gray-200 relative">
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded-md"
            onClick={() => openPopup()}
          >
            Delete seen history
          </button>
        </div>
      </div>
      {/* {groupedData.map((childGroup) => (
        <div key={childGroup}>
          <h2 className="ml-2 w-40 h-15 mt-10  border border-1 rounded bg-green-400">
            {childGroup}
          </h2> */}
      <div className="grid grid-cols-4 gap-4">
        {listPodcast.map((podcast) => (
          <div
            className="border border-gray-300 p-4 relative cursor-pointer relative"
            key={podcast.podcast_Name}
            onClick={(event) =>
              handleBlockClick(
                event,
                podcast.podcast_Name,
                podcast.podcast_ID,
                podcast.podcast_Level
              )
            }
          >
            <h2 className="text-green-500 font-semibold text-lg">
              {podcast.podcast_Name}
            </h2>

            <p className="text-blue-400  text-lg">Level at:</p>
            <h2>{podcast.podcast_Level}</h2>
            <p className="text-blue-400  text-lg">Have seen at:</p>
            <h2>{formatDate(podcast.updatedAt)}</h2>
            {/* <audio controls>
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
            </button> */}
            <button
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded text-sm truncate"
              onClick={() => handleDeleteClick(podcast)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {/* </div>
      ))} */}
    </div>
  );
}
