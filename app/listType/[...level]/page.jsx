"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { redirect, useRouter } from "next/navigation";
import YouTube from "react-youtube";
import { analytics } from "@/components/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function LevelDetail({ params }) {
  const { level } = params;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [fileupload, setfileupload] = useState(null);
  const [videoSource, setVideoSource] = useState("");

  const handleVideoInputChange = (e) => {
    setVideoSource(e.target.value);
  };

  const getYouTubeId = (url) => {
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
    console.log(fileupload);
    if (fileupload !== null) {
      const fileref = ref(analytics, `${level}/`);

      try {
        const snapshot = await uploadBytes(fileref, fileupload[0]);
        const url = await getDownloadURL(snapshot.ref);
        console.log("url", url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      alert("pls select file");
    }
  };

  const router = useRouter();

  const handleSearch = (searchQuery) => {};

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const blocks = [
    {
      title: "Block 1",
      audioSource: "path-to-audio1.mp3",
      audioDownloadLink: "path-to-audio1.mp3",
      textDownloadLink: "path-to-text1.txt",
    },
    {
      title: "Block 2",
      audioSource: "path-to-audio2.mp3",
      audioDownloadLink: "path-to-audio2.mp3",
      textDownloadLink: "path-to-text2.txt",
    },
    {
      title: "Block 3",
      audioSource: "path-to-audio3.mp3",
      audioDownloadLink: "path-to-audio3.mp3",
      textDownloadLink: "path-to-text3.txt",
    },
    {
      title: "Block 4",
      audioSource: "path-to-audio4.mp3",
      audioDownloadLink: "path-to-audio4.mp3",
      textDownloadLink: "path-to-text4.txt",
    },
    {
      title: "Block 5",
      audioSource: "path-to-audio5.mp3",
      audioDownloadLink: "path-to-audio5.mp3",
      textDownloadLink: "path-to-text5.txt",
    },
    {
      title: "Block 6",
      audioSource: "path-to-audio6.mp3",
      audioDownloadLink: "path-to-audio6.mp3",
      textDownloadLink: "path-to-text6.txt",
    },
    {
      title: "Block 7",
      audioSource: "path-to-audio7.mp3",
      audioDownloadLink: "path-to-audio7.mp3",
      textDownloadLink: "path-to-text7.txt",
    },
    {
      title: "Block 8",
      audioSource: "path-to-audio8.mp3",
      audioDownloadLink: "path-to-audio8.mp3",
      textDownloadLink: "path-to-text8.txt",
    },
    {
      title: "Block 9",
      audioSource: "path-to-audio9.mp3",
      audioDownloadLink: "path-to-audio9.mp3",
      textDownloadLink: "path-to-text9.txt",
    },
    {
      title: "Block 10",
      audioSource: "path-to-audio10.mp3",
      audioDownloadLink: "path-to-audio10.mp3",
      textDownloadLink: "path-to-text10.txt",
    },
  ];
  const handleBlockClick = (title) => {
    router.push(`/detailPage/${level}/${title}`);
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
                  // Gán giá trị vào state hoặc thực hiện xử lý phù hợp ở đây
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
                  // Gán giá trị vào state hoặc thực hiện xử lý phù hợp ở đây
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
                  onChange={(e) => setTextFile(e.target.files[0])}
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
      <h1 className="mt-16">Chi tiết khối block {level}</h1>

      <div className="grid grid-cols-4 gap-4">
        {blocks.map((block) => (
          <div
            className="border border-gray-300 p-4 relative cursor-pointer"
            key={block.title}
            onClick={() => handleBlockClick(block.title)}
          >
            <h2>{block.title}</h2>

            <audio controls>
              <source src={block.audioSource} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

            <a href={block.audioDownloadLink} download>
              <span className="mr-2">&#8226;</span> Tải tệp âm thanh xuống
            </a>
            <br />
            <a href={block.textDownloadLink} download>
              <span className="mr-2">&#8226;</span> Tải tệp văn bản xuống
            </a>

            {/* Nút Xóa */}
            <button className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded">
              Xóa
            </button>

            {/* Nút Sửa */}
            <button className="absolute top-0 right-8 bg-green-500 text-white p-1 rounded">
              Sửa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
