"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { redirect, useRouter } from "next/navigation";
import YouTube from "react-youtube";
import { analytics } from "@/components/Firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getStorage,
  listAll,
} from "firebase/storage";

export default function LevelDetail({ params }) {
  const { level } = params;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [podcastName, setPodcastName] = useState("");
  const [videoSource, setVideoSource] = useState("");
  const [textFile, setTextFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const storage = getStorage();
  const audioPath = ref(analytics, `${level}/${podcastName}`);
  const transcriptPath = ref(analytics, `Transcripts/`);
  const listAudio = ref(storage, audioPath);
  const listTranscript = ref(storage, transcriptPath);

  listAll(audioPath)
    .then((audioList) => {
      // In danh sách file audio ra màn hình
      console.log("Danh sách file audio:");
      audioList.items.forEach((audioFile) => {
        console.log(audioFile.name);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi lấy danh sách file audio:", error);
    });

  // Lấy danh sách các file transcript
  listAll(transcriptPath)
    .then((transcriptList) => {
      // In danh sách file transcript ra màn hình
      console.log("Danh sách file transcript:");
      transcriptList.items.forEach((transcriptFile) => {
        console.log(transcriptFile.name);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi lấy danh sách file transcript:", error);
    });

  const blockList = {};
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
    if (audioFile !== null) {
      console.log("Audio File:", audioFile);
      const audioRef = ref(analytics, `${level}/${podcastName}`);
      try {
        if (audioFile[0].type.startsWith("audio/")) {
          // Xử lý audio file
          const audioSnapshot = await uploadBytes(audioRef, audioFile[0]);
          const audioUrl = await getDownloadURL(audioSnapshot.ref);
          console.log("Audio URL:", audioUrl);
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
        } else {
          console.error("Invalid text file format");
        }
      } catch (textError) {
        console.error("Error uploading text file:", textError);
      }
    } else {
      alert("Please select text file");
    }
  };

  const router = useRouter();

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
