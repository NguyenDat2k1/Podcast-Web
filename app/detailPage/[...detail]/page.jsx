"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import YouTube from "react-youtube";
import { redirect, useRouter } from "next/navigation";
import Modal from "react-modal";

export default function DetailPage({ params }) {
  const { data: session } = useSession();
  const [detailPodcast, setDetailPodcast] = useState({});
  const [listPodcast, setListPodcast] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [audioDownload, setAudioDownload] = useState(0);
  const [scriptDownload, setScriptDownload] = useState(0);
  const { detail } = params;
  const id = detail[2];
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };
  const closeModal2 = () => {
    setShowModal2(false);
  };

  console.log(detail);

  // let email = session?.user?.email;
  // if (email == null) {
  //   router.push(`/login`);
  // }

  useEffect(() => {
    const getDetailPodcast = async () => {
      try {
        const resListPodcast = await fetch("/api/getDetailPodcast", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const podcast = await resListPodcast.json();
        await setDetailPodcast(podcast);
        console.log("here:", podcast);

        console.log("DetailPodcast: ", detailPodcast);
      } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
      }
    };

    getDetailPodcast();
  }, [params]);

  useEffect(() => {
    const getListPodcast = async () => {
      try {
        const resListPodcast = await fetch("/api/getAllPodcast", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });

        const Podcasts = await resListPodcast.json();

        // Kiểm tra xem responseData có thuộc tính nào chứa mảng không
        console.log(Podcasts);

        if (Array.isArray(Podcasts)) {
          const sortedPodcasts = Podcasts.sort(
            (a, b) =>
              b.audioDowload +
              b.scriptDowload -
              (a.audioDowload + a.scriptDowload)
          );

          const top3Podcasts = sortedPodcasts.slice(0, 3);
          setListPodcast(top3Podcasts);
        } else {
          console.error("Invalid data structure in the response:");
        }
      } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
      }
    };

    getListPodcast();
  }, [params]);

  const blocks = [
    {
      title: "Block 1",
      audioSource: "audio-source-1.mp3",
      audioDownloadLink: "audio-download-1.mp3",
      textDownloadLink: "text-download-1.txt",
    },
    {
      title: "Block 2",
      audioSource: "audio-source-2.mp3",
      audioDownloadLink: "audio-download-2.mp3",
      textDownloadLink: "text-download-2.txt",
    },
    {
      title: "Block 3",
      audioSource: "audio-source-3.mp3",
      audioDownloadLink: "audio-download-3.mp3",
      textDownloadLink: "text-download-3.txt",
    },
  ];
  const getYouTubeId1 = (url) => {
    const match = url.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match && match[1];
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
          podcastID: id,
        }),
      });
      if (res.ok) {
        // setUpdateFlag((prev) => !prev);
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
          podcastID: id,
        }),
      });
      if (res.ok) {
        // setUpdateFlag((prev) => !prev);
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

      <div className="flex justify-center items-center h-screen mt-80">
        <div className="max-w-screen-md w-full text-center mx-auto border border-gray-300 p-8 relative">
          <h1>{params.detail[1]}</h1>

          <div className="flex flex-col items-center space-y-4">
            <audio controls className="mb-4">
              {detailPodcast?.audioPath ? (
                <source src={detailPodcast.audioPath} type="audio/mpeg" />
              ) : null}
              Your browser does not support the audio element.
            </audio>

            {detailPodcast?.audioPath ? (
              <div className="relative ml-60 w-full">
                <YouTube
                  videoId={getYouTubeId1(detailPodcast.ytbPath)}
                  opts={{
                    width: "70%",
                    height: "70%",
                    playerVars: {
                      autoplay: 0,
                    },
                  }}
                  className="w-full h-full"
                />
              </div>
            ) : null}

            <div className="z-0 mt-15 space-y-2">
              <a
                href={detailPodcast.audioPath}
                download
                className="block mb-2"
                onClick={(e) => {
                  if (!isDownloading) {
                    handleAudioDownload(e, detailPodcast);
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
                  <p>{detailPodcast.audioPath}</p>
                </div>
              </Modal>
              <a
                href={detailPodcast.transcriptPath}
                download
                className="block"
                onClick={(e) => {
                  if (!isDownloading) {
                    handleScriptDownload(e, detailPodcast);
                  }
                }}
              >
                <span className="mr-2">&#8226;</span> Download Script
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
                  <p>{detailPodcast.transcriptPath}</p>
                </div>
              </Modal>
            </div>
          </div>

          <p className="mt-15">
            Chuyện về Bát Cơm Thừa với nhiều hàm ý sâu sắc và giá trị nhân văn
            cao cả sẽ mang lại những bài học bổ ích cho trẻ em. Đôi khi, vì quá
            thương con, cha mẹ vô tình biến con trở thành những "chú gà công
            nghiệp" chỉ biết hưởng thụ mà không bao giờ nghĩ đến người khác. Hãy
            để cho con được trải nghiệm để có thể hiểu được mình đã may mắn đến
            mức nào.
            <br />
            <br />
            Podcast Kể chuyện cho bé yêu được mang đến bởi Waves. Waves là nền
            tảng âm thanh trực tuyến cung cấp audiobooks, podcasts và giáo dục
            trực tuyến dành riêng cho người Việt. Bạn có thể truy cập vào tất cả
            các podcast nổi tiếng trên toàn thế giới và những podcast được sản
            xuất bởi người Việt. Truy cập vào{" "}
            <a
              href="https://waves8.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Waves8.com
            </a>{" "}
            để đón xem nhiều chương trình khác của chúng tôi hoặc liên hệ nếu
            bạn muốn cùng chúng tôi tạo ra những podcast riêng của riêng mình!
            Chương trình này được xây dựng bởi kênh Youtube Vietnamese Fairy
            Tales.{" "}
            <a
              href="https://www.youtube.com/watch?v=FPhKnjzvNDQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Xem tại đây
            </a>
          </p>
          <div class="border border-blue-400 text-white bg-green-500 p-4">
            <h1>Maybe you will be interested in?</h1>
          </div>

          {listPodcast.map((podcast) => (
            <div
              className="border border-gray-300 p-6 mt-15 relative mb-4"
              key={podcast._id}
            >
              <h2 className="block mb-2 text-left ml-5">{podcast.name}</h2>

              <audio controls className="mb-2">
                <source src={podcast.audioPath} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>

              <a
                href={podcast.audioPath}
                download
                className="block mb-2 text-left"
              >
                <span className="mr-2">&#8226;</span> Audio Download
              </a>
              <a
                href={podcast.transcriptPath}
                download
                className="block mb-2 text-left"
              >
                <span className="mr-2">&#8226;</span> Script Download
              </a>

              {/* Màn hình YouTube ở góc phải */}
              <div className="absolute top-0 right-0 h-full">
                <YouTube
                  videoId={getYouTubeId1(podcast.ytbPath)}
                  opts={{
                    width: "100%", // Có thể điều chỉnh kích thước của màn hình YouTube tại đây
                    height: "100%",
                    playerVars: {
                      autoplay: 0,
                    },
                  }}
                  className="w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
