"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import YouTube from "react-youtube";
import { redirect, useRouter } from "next/navigation";
import Modal from "react-modal";

export default function UserInfo(props) {
  const { data: session } = useSession();
  const [updateFlag, setUpdateFlag] = useState(false);
  const [user_ID, setUser_ID] = useState("");
  const [listPodcast, setListPodcast] = useState([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [audioDownload, setAudioDownload] = useState(0);
  const [scriptDownload, setScriptDownload] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showUnActive, setUnActive] = useState(false);
  const router = useRouter();
  const listType = ["Business", "Comedy", "Detective"];

  const closeModal = () => {
    setShowModal(false);
  };
  const closeModal2 = () => {
    setShowModal2(false);
  };
  const closeUnActive = () => {
    email == null;
    // router.push(`/login`);
  };

  const getYouTubeId1 = (url) => {
    console.log("url is here", url);
    const match = url.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match && match[1];
  };
  let email = session?.user?.email;
  // if (email == null) {
  //   router.push(`/login`);
  // }

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
        if (email != null) {
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
          if (user.isActive == "unactive") {
            setUnActive(true);
          }

          const favourites = await resListFavourite.json();
          console.log(podcasts);

          if (Array.isArray(podcasts)) {
            const listFav = favourites.filter(
              (fav) => fav.user_ID === user._id
            );

            const notLikedPodcasts = podcasts.filter(
              (podcast) =>
                !listFav.some((fav) => fav.podcast_ID === podcast._id)
            );

            setListPodcast(notLikedPodcasts);
          } else {
            console.error("Invalid data structure in the response:");
          }
        } else {
          if (Array.isArray(podcasts)) {
            setListPodcast(podcasts);
          } else {
            console.error("Invalid data structure in the response:");
          }
        }
      } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
      }
    };

    getListPodcast();
  }, [updateFlag]);

  const handleBlockClick = async (event, title, id, level) => {
    const isClickedInsideBlock =
      event.target === event.currentTarget ||
      event.target.tagName.toLowerCase() === "span";
    console.log("ssssssss");
    if (email != null) {
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
        console.log("đã lấy được user:", id, user_ID);
        // Gọi API để cập nhật thích podcast
        const res = await fetch("/api/addToHistory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            podcast_ID: id,
            user_ID: user_ID,
            podcast_Name: title,
            podcast_Level: level,
          }),
        });
        let activity = `Đã xem chi tiết ${title}`;
        console.log("Đã lấy được dữ liệu email, activity : ", {
          email,
          activity,
        });
        const resActivity = await fetch("/api/addActivity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            activity: activity,
          }),
        });
        if (resActivity.ok) {
          console.log("tạo hoạt động xem chi tiết thành công.");
        } else {
          console.log("tạo hoạt động xem chi tiết thất bại.");
        }
        if (res.ok) {
          console.log("cập nhật history podcast thành công.");
        } else {
          console.log("cập nhật history podcast thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi xử lý tệp âm thanh hoặc văn bản:", error);
      }
    }

    if (isClickedInsideBlock) {
      router.push(`/detailPage/${level}/${title}/${id}`);
    }
  };

  const handleFavoriteClick = async (podcast) => {
    if (email != null) {
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
            const updatedList = listPodcast.filter(
              (p) => p._id !== podcast._id
            );
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
    } else {
      router.push(`/login`);
    }
  };
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1; //month js is start with 0
  const year = currentDate.getFullYear();

  // Định dạng chuỗi tháng có 2 chữ số
  const formattedMonth = month < 10 ? `0${month}` : month;

  const formattedDate = `${formattedMonth}/${year}`;
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
      const count = await fetch("/api/countAnalysist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: podcast.type,
          id_podcast: podcast._id,
          datE: formattedDate,
        }),
      });
      let activity = `Đã tải audio của ${podcast.name}`;
      console.log("Đã lấy được dữ liệu email, activity : ", {
        email,
        activity,
      });
      const resActivity = await fetch("/api/addActivity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          activity: activity,
        }),
      });
      if (resActivity.ok) {
        console.log("tạo hoạt động xem chi tiết thành công.");
      } else {
        console.log("tạo hoạt động xem chi tiết thất bại.");
      }
      if (count.ok) {
        console.log("count Analysist oke");
      } else {
        console.log("count Analysist  failed.");
      }
      if (res.ok) {
        setUpdateFlag((prev) => !prev);
        setShowModal(true);
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
      const count = await fetch("/api/countAnalysist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: podcast.type,
          id_podcast: podcast._id,
          datE: formattedDate,
        }),
      });
      let activity = `Đã tải script của ${podcast.name}`;
      console.log("Đã lấy được dữ liệu email, activity : ", {
        email,
        activity,
      });
      const resActivity = await fetch("/api/addActivity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          activity: activity,
        }),
      });
      if (resActivity.ok) {
        console.log("tạo hoạt động xem chi tiết thành công.");
      } else {
        console.log("tạo hoạt động xem chi tiết thất bại.");
      }
      if (count.ok) {
        console.log("count Analysist oke");
      } else {
        console.log("count Analysist  failed.");
      }
      if (res.ok) {
        setUpdateFlag((prev) => !prev);
        setShowModal2(true);
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
      <Modal
        isOpen={showUnActive}
        onRequestClose={closeUnActive}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <div className="relative">
          <span
            className="absolute top-2 right-2 cursor-pointer text-gray-500 text-2xl"
            onClick={closeModal}
          >
            &times;
          </span>

          <p>
            Tài khoản của bạn đã bị khóa, vui lòng liên hệ số 012345678 cho
            admin đeer biết thêm chi tiết
          </p>
        </div>
      </Modal>

      {/* <div className="bg-gray-300 p-4 text-center h-96"> */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-center h-96 text-white">
        <h1 className="text-4xl font-bold mb-2">
          Welcome to our website
          <br />
          in order to improve your English skills
        </h1>
      </div>
      {/* {listType.map((type) => (
        <div key={type}> */}
      <h2 className="  mx-auto w-40 ml-[-1rem - 5px] mt-10 text-2xl flex items-center relative">
        {/* <div
          className="flex-1 bg-green-400 w-40"
          style={{ height: "2px" }}
        ></div> */}
        <span className="bg-green-400 text-white p-2 rounded-full mx-2 whitespace-nowrap ">
          Top 4 New Podcast
        </span>
        {/* <div
          className="flex-1 bg-green-400 w-40"
          style={{ height: "2px" }}
        ></div> */}
      </h2>

      {/* <ul> */}
      <div className="grid grid-cols-4 gap-4">
        {listPodcast.slice(0, 4).map((podcast) => (
          <div
            className="border border-gray-300 p-4 relative cursor-pointer"
            key={podcast.name}
          >
            <h2
              className="cursor-pointer"
              onClick={(event) =>
                handleBlockClick(
                  event,
                  podcast.name,
                  podcast._id,
                  podcast.level
                )
              }
            >
              {podcast.name}
            </h2>

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
            <Modal
              isOpen={showModal}
              onRequestClose={closeModal}
              style={{
                content: {
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  padding: "20px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <div className="relative">
                <span
                  className="absolute top-2 right-2 cursor-pointer text-gray-500 text-2xl"
                  onClick={closeModal}
                >
                  &times;
                </span>
                <p>Copy the link below to download the audio:</p>
                <p>{podcast.audioPath}</p>
              </div>
            </Modal>
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
            <Modal
              isOpen={showModal2}
              onRequestClose={closeModal2}
              style={{
                content: {
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  padding: "20px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <div className="relative">
                <span
                  className="absolute top-2 right-2 cursor-pointer text-gray-500 text-2xl"
                  onClick={closeModal2}
                >
                  &times;
                </span>
                <p>Copy the link below to download the Script:</p>
                <p>{podcast.transcriptPath}</p>
              </div>
            </Modal>
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
        {/* </ul> */}
      </div>
      {/* </div>
      ))} */}
      {listType.map((type) => (
        <div key={type}>
          <h2 className="mx-auto w-40 mt-10 text-2xl flex items-center relative">
            <div
              className="flex-1 bg-green-400 w-40"
              style={{ height: "2px" }}
            ></div>
            <span className="bg-green-400 text-white p-2 rounded-full mx-2">
              {type}
            </span>
            <div
              className="flex-1 bg-green-400 w-40"
              style={{ height: "2px" }}
            ></div>
          </h2>

          {/* <ul> */}
          <div className="grid grid-cols-4 gap-4">
            {listPodcast
              .filter((podcast) => podcast.type === type)
              .map((podcast) => (
                <div
                  className="border border-gray-300 p-4 relative cursor-pointer"
                  key={podcast.name}
                  // onClick={(event) =>
                  //   handleBlockClick(
                  //     event,
                  //     podcast.name,
                  //     podcast._id,
                  //     podcast.level
                  //   )
                  // }
                >
                  <h2
                    className="cursor-pointer"
                    onClick={(event) =>
                      handleBlockClick(
                        event,
                        podcast.name,
                        podcast._id,
                        podcast.level
                      )
                    }
                  >
                    {podcast.name}
                  </h2>

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
                  <Modal
                    isOpen={showModal}
                    onRequestClose={closeModal}
                    style={{
                      content: {
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        padding: "20px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <div className="relative">
                      <span
                        className="absolute top-2 right-2 cursor-pointer text-gray-500 text-2xl"
                        onClick={closeModal}
                      >
                        &times;
                      </span>
                      <p>Copy the link below to download the audio:</p>
                      <p>{podcast.audioPath}</p>
                    </div>
                  </Modal>
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
                  <Modal
                    isOpen={showModal2}
                    onRequestClose={closeModal2}
                    style={{
                      content: {
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        padding: "20px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <div className="relative">
                      <span
                        className="absolute top-2 right-2 cursor-pointer text-gray-500 text-2xl"
                        onClick={closeModal2}
                      >
                        &times;
                      </span>
                      <p>Copy the link below to download the Script:</p>
                      <p>{podcast.transcriptPath}</p>
                    </div>
                  </Modal>
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
            {/* </ul> */}
          </div>
        </div>
      ))}
      <footer className="bg-gray-300 p-4 text-center">
        &copy; 2023 Your Website Name
      </footer>
    </div>
  );
}
