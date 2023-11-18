"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { redirect, useRouter } from "next/navigation";
import YouTube from "react-youtube";
import { analytics } from "@/components/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function LevelDetail({ params }) {
  const { level } = params;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [podcastName, setPodcastName] = useState("");
  const [videoSource, setVideoSource] = useState("");
  const [textFile, setTextFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [name, setName] = useState("");
  const [listPodcast, setListPodcast] = useState([]);
  const [editedPodcastName, setEditedPodcastName] = useState("");
  const [editedLevel, setEditedLevel] = useState("");
  const [editedVideoFile, setEditedVideoFile] = useState("");
  const [editedAudioFile, setEditedAudioFile] = useState(null);
  const [editedTextFile, setEditedTextFile] = useState(null);
  const [editedVideoSource, setEditedVideoSource] = useState("");

  let audioPath = "";
  let transcriptPath = "";
  let ytbPath = "";

  useEffect(() => {
    const getListPodcast = async () => {
      try {
        const resListPodcast = await fetch("/api/getListPodcast", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ level }),
        });

        const Podcasts = await resListPodcast.json();

        // Kiểm tra xem responseData có thuộc tính nào chứa mảng không
        console.log(Podcasts);

        if (Array.isArray(Podcasts)) {
          setListPodcast(Podcasts);
        } else {
          console.error("Invalid data structure in the response:");
        }
      } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
      }
    };

    getListPodcast();
  }, []);
  console.log(listPodcast);
  const handleVideoInputChange = (e) => {
    setVideoSource(e.target.value);
  };

  const getYouTubeId = (url) => {
    const match = url.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match && match[1];
  };
  const getYouTubeId1 = (url) => {
    const match = url.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match && match[1];
  };
  const youtubeOpts = {
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleSave = async () => {
    if (audioFile !== null) {
      console.log("Audio File:", audioFile);
      const audioRef = ref(analytics, `${level}/${podcastName}`);
      try {
        if (audioFile[0].type.startsWith("audio/")) {
          // Xử lý audio file
          const audioSnapshot = await uploadBytes(audioRef, audioFile[0]);
          const audioUrl = await getDownloadURL(audioSnapshot.ref);
          console.log("Audio URL:", audioUrl);
          audioPath = audioUrl;
        } else {
          console.error("Invalid audio file format");
        }
      } catch (audioError) {
        console.error("Error uploading audio file:", audioError);
      }
    } else {
      alert("Please select audio file");
      return;
    }

    if (textFile !== null) {
      console.log("Text File:", textFile);
      const textRef = ref(analytics, `Transcripts/${level}-${podcastName}`);
      try {
        if (!textFile[0].type.startsWith("audio/")) {
          // Xử lý text file
          const textSnapshot = await uploadBytes(textRef, textFile[0]);
          const textUrl = await getDownloadURL(textSnapshot.ref);
          console.log("Text URL:", textUrl);
          transcriptPath = textUrl;
        } else {
          console.error("Invalid text file format");
        }
      } catch (textError) {
        console.error("Error uploading text file:", textError);
      }
    } else {
      alert("Please select text file");
    }
    try {
      const res = await fetch("/api/addPodcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: podcastName,
          level,
          audioPath,
          transcriptPath,
          ytbPath: videoSource,
        }),
      });

      if (res.ok) {
      } else {
        console.log("Podcast registration failed.");
      }
    } catch (error) {
      console.log("Error during Podcast: ", error);
    }
  };

  const router = useRouter();

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  //handle mở đóng cho button sửa
  let editPodcast = {};
  const openEditPopup = (podcast) => {
    console.log("podcast edittttt: ", podcast);
    setEditedPodcastName(podcast.name);
    setEditedLevel(podcast.level);
    setEditedAudioFile(podcast.audioPath);
    setEditedTextFile(podcast.transcriptPath);
    setEditedVideoSource(podcast.ytbPath);
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
  };
  // const blocks = [
  //   {
  //     title: "Block 1",
  //     audioSource: "path-to-audio1.mp3",
  //     audioDownloadLink: "path-to-audio1.mp3",
  //     textDownloadLink: "path-to-text1.txt",
  //   },
  // ];

  const handleBlockClick = (event, title) => {
    const isClickedInsideBlock =
      event.target === event.currentTarget ||
      event.target.tagName.toLowerCase() === "span";

    if (isClickedInsideBlock) {
      router.push(`/detailPage/${level}/${title}`);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="flex justify-between items-center p-4 bg-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border border-gray-400 px-2 py-1 rounded-md"
            onInput={(e) => handleSearch(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded-md"
            onClick={() => openPopup()}
          >
            Thêm
          </button>
        </div>
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg">
            <form>
              <div className="mb-4">
                <label
                  htmlFor="podcastName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Tên Podcast
                </label>
                <input
                  type="text"
                  id="podcastName"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full"
                  value={podcastName}
                  onChange={(e) => setPodcastName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="level"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Level Podcast
                </label>
                <input
                  type="text"
                  id="level"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="videoFile"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Video Podcast
                </label>
                <input
                  type="text"
                  id="videoFile"
                  placeholder="Nhập đường dẫn video từ YouTube"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full mb-2"
                  onChange={handleVideoInputChange}
                />
                {videoSource && (
                  <YouTube
                    videoId={getYouTubeId(videoSource)}
                    opts={youtubeOpts}
                  />
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="audioFile"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Tệp âm thanh
                </label>
                <input
                  type="file"
                  id="audioFile"
                  accept="audio/*"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full"
                  onChange={(e) => setAudioFile(e.target.files)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="textFile"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Tệp văn bản
                </label>
                <input
                  type="file"
                  id="textFile"
                  accept=".txt"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full"
                  onChange={(e) => setTextFile(e.target.files)}
                />
              </div>

              <button
                type="button"
                className="bg-blue-500 text-white px-2 py-1 rounded-md"
                onClick={handleSave}
              >
                Lưu
              </button>
              <button type="button" onClick={closePopup}>
                Đóng
              </button>
            </form>
          </div>
        </div>
      )}
      {isEditPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg">
            <form>
              <div className="mb-4">
                <label
                  htmlFor="podcastName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Tên Podcast
                </label>
                <input
                  type="text"
                  id="podcastName"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full"
                  value={editedPodcastName}
                  onChange={(e) => setEditedPodcastName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="level"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Level Podcast
                </label>
                <input
                  type="text"
                  id="level"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full"
                  value={editedLevel}
                  onChange={(e) => setEditedLevel(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="videoFile"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Video Podcast
                </label>
                <input
                  type="text"
                  id="videoFile"
                  placeholder="Nhập đường dẫn video từ YouTube"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full mb-2"
                  value={editedVideoSource}
                  onChange={(e) => setEditedVideoSource(e.target.value)}
                />
                {editedVideoSource && (
                  <YouTube
                    videoId={getYouTubeId(editedVideoSource)}
                    opts={youtubeOpts}
                  />
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="audioFile"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Tệp âm thanh
                </label>
                <input
                  type="file"
                  id="audioFile"
                  accept="audio/*"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full"
                  onChange={(e) => setEditedAudioFile(e.target.files)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="textFile"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Tệp văn bản
                </label>
                <input
                  type="file"
                  id="textFile"
                  accept=".txt"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full"
                  onChange={(e) => setEditedTextFile(e.target.files)}
                />
              </div>

              <button
                type="button"
                className="bg-blue-500 text-white px-2 py-1 rounded-md"
                onClick={handleSave}
              >
                Lưu
              </button>
              <button type="button" onClick={closeEditPopup}>
                Đóng
              </button>
            </form>
          </div>
        </div>
      )}
      <h1 className="mt-16">Chi tiết khối block {level}</h1>

      <div className="grid grid-cols-4 gap-4">
        {listPodcast.map((podcast) => (
          <div
            className="border border-gray-300 p-4 relative cursor-pointer"
            key={podcast.name}
            // onClick={() => handleBlockClick(podcast.name)}
            onClick={(event) => handleBlockClick(event, podcast.name)}
          >
            <h2>{podcast.name}</h2>

            <audio controls>
              <source src={podcast.audioPath} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

            <a href={podcast.audioPath} download>
              <span className="mr-2">&#8226;</span> Tải tệp âm thanh xuống
            </a>
            <br />
            <a href={podcast.transcriptPath} download>
              <span className="mr-2">&#8226;</span> Tải tệp văn bản xuống
            </a>
            <div className="relative w-full h-0 pb-[56.25%] mb-4">
              <YouTube
                videoId={getYouTubeId1(podcast.ytbPath)}
                opts={{
                  width: "100%", // Đảm bảo rằng chiều rộng của video là 100%
                  height: "100%", // Đảm bảo chiều cao của video là 100%
                  playerVars: {
                    autoplay: 0, // Tắt chế độ tự động chạy video
                  },
                }}
                className="absolute inset-0 w-full h-full"
              />
            </div>
            {/* Nút Xóa */}
            <button className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded">
              Xóa
            </button>

            {/* Nút Sửa */}
            <button
              className="absolute top-0 right-8 bg-green-500 text-white p-1 rounded"
              onClick={() => openEditPopup(podcast)}
            >
              Sửa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
