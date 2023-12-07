"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { redirect, useRouter } from "next/navigation";
import YouTube from "react-youtube";
import { analytics } from "@/components/Firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getStorage,
  deleteObject,
} from "firebase/storage";

export default function LevelDetail({ params }) {
  const { level } = params;
  const { data: session } = useSession();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [podcastName, setPodcastName] = useState("");
  const [describe, setDescribe] = useState("");
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
  const [editedType, setEditedType] = useState("");
  const [editedDescribe, setEditedDescribe] = useState("");
  const [idPodcast, setIDPodcast] = useState("");
  const [tempName, setTempName] = useState("");
  const [updateFlag, setUpdateFlag] = useState(false);
  const [type, setType] = useState("Business");

  let audioPath = "";
  let transcriptPath = "";
  let ytbPath = "";
  let email = session?.user?.email;
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
  }, [updateFlag]);

  const handleTypeChange = (event) => {
    // Cập nhật giá trị khi người dùng chọn
    setType(event.target.value);
  };
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
    console.log("url is here", url);
    const match = url.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match && match[1];
  };
  const youtubeOpts = {
    width: "100%",
    height: "90%",
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
          type,
          audioPath,
          transcriptPath,
          describe: describe,
          ytbPath: videoSource,
        }),
      });

      if (res.ok) {
        setUpdateFlag((prev) => !prev);
        setIsPopupOpen(false);
        setPodcastName("");
        setDescribe("");
        setType("Business");
        setVideoSource("");
      } else {
        console.log("Podcast registration failed.");
      }
    } catch (error) {
      console.log("Error during Podcast: ", error);
    }
  };
  const storage = getStorage();
  const handleUpdate = async () => {
    try {
      console.log("updating fileeeee");

      const deleteExistingAudioFiles = async () => {
        try {
          // Xóa tệp âm thanh
          const audioDeleteRef = ref(storage, `${level}/${tempName}`);
          await deleteObject(audioDeleteRef);
          console.log("Đã xóa tệp âm thanh cũ.");
        } catch (deleteError) {
          console.error("Lỗi khi xóa các tệp đã tồn tại:", deleteError);
        }
      };
      const deleteExistingScriptFiles = async () => {
        try {
          const textDeleteRef = ref(
            storage,
            `Transcripts/${level}-${tempName}`
          );
          await deleteObject(textDeleteRef);
          console.log("Đã xóa tệp văn bản cũ.");
        } catch (deleteError) {
          console.error("Lỗi khi xóa các tệp đã tồn tại:", deleteError);
        }
      };

      try {
        let audioPath = "";
        let transcriptPath = "";
        console.log("audio :", editedAudioFile.length);
        console.log("script :", editedTextFile.length);
        switch (true) {
          //case sửa script
          case editedTextFile.length < 10 && editedAudioFile.length > 10:
            console.log("case 1");
            console.log("audio :", editedAudioFile.length);
            console.log("script :", editedTextFile.length);

            await deleteExistingScriptFiles();
            const text1Ref = ref(
              storage,
              `Transcripts/${level}-${editedPodcastName}`
            );
            const text1Snapshot = await uploadBytes(
              text1Ref,
              editedTextFile[0]
            );
            const text1Url = await getDownloadURL(text1Snapshot.ref);
            console.log("URL Tệp văn bản:", text1Url);
            transcriptPath = text1Url;

            break;
          //case sửa audio
          case editedTextFile.length > 10 && editedAudioFile.length < 10:
            console.log("case 2");
            console.log("audio :", editedAudioFile.length);
            console.log("script :", editedTextFile.includes("http"));
            console.log("script :", editedTextFile.length);
            // Thực hiện case 2: chỉ cập nhật metadata cho tệp văn bản

            await deleteExistingAudioFiles();
            const audio1Ref = ref(storage, `${level}/${editedPodcastName}`);
            const audio1Snapshot = await uploadBytes(
              audio1Ref,
              editedAudioFile[0]
            );
            const audio1Url = await getDownloadURL(audio1Snapshot.ref);
            console.log("URL Tệp âm thanh:", audio1Url);
            audioPath = audio1Url;

            break;

          case editedTextFile.length > 10 && editedAudioFile.length > 10:
            console.log("case 3");
            console.log("audio :", editedAudioFile.length);
            console.log("script :", editedTextFile.length);

            audioPath = editedAudioFile;

            transcriptPath = editedTextFile;

            break;

          default:
            console.log("case 4");
            console.log("audio :", editedAudioFile.length);
            console.log("script :", editedTextFile.length);
            await deleteExistingAudioFiles();
            await deleteExistingScriptFiles();

            //audio handle

            const audioRef = ref(storage, `${level}/${editedPodcastName}`);
            const audioSnapshot = await uploadBytes(
              audioRef,
              editedAudioFile[0]
            );
            const audioUrl = await getDownloadURL(audioSnapshot.ref);
            console.log("URL Tệp âm thanh:", audioUrl);

            audioPath = audioUrl;

            //script handle
            const textRef = ref(
              storage,
              `Transcripts/${level}-${editedPodcastName}`
            );
            const textSnapshot = await uploadBytes(textRef, editedTextFile[0]);
            const textUrl = await getDownloadURL(textSnapshot.ref);
            console.log("URL Tệp văn bản:", textUrl);

            transcriptPath = textUrl;

            break;
        }
        // call API để cập nhật podcast
        const res = await fetch("/api/updatePodcast", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            podcastID: idPodcast,
            name: editedPodcastName,
            level,
            type: editedType,
            audioPath,
            transcriptPath,
            describe: editedDescribe,
            ytbPath: editedVideoSource,
          }),
        });

        if (res.ok) {
          setEditedVideoSource("");
          setEditedAudioFile(null);
          setEditedTextFile(null);
          setTempName(editedPodcastName);
          setIsEditPopupOpen(false);
          setUpdateFlag((prev) => !prev);
          console.log("Cập nhật podcast thành công.");
        } else {
          console.log("Cập nhật podcast thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi xử lý tệp âm thanh hoặc văn bản:", error);
      }
    } catch (error) {
      console.error("Lỗi trong handleUpdate:", error);
    }
  };
  const router = useRouter();

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setPodcastName("");
    setDescribe("");
    setType("Business");
    setVideoSource("");
    setIsPopupOpen(false);
  };
  //handle mở đóng cho button sửa

  const openEditPopup = async (podcast) => {
    setIDPodcast(podcast._id);
    console.log("podcast edittttt: ", podcast);
    setTempName(podcast.name);
    setEditedPodcastName(podcast.name);
    setEditedLevel(podcast.level);
    setEditedVideoSource(podcast.ytbPath);
    setEditedAudioFile(podcast.audioPath);
    setEditedTextFile(podcast.transcriptPath);
    setEditedType(podcast.type);
    setEditedDescribe(podcast.describe);
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
  };

  const handleBlockClick = (event, title, id) => {
    const isClickedInsideBlock =
      event.target === event.currentTarget ||
      event.target.tagName.toLowerCase() === "span";

    if (isClickedInsideBlock) {
      router.push(`/detailPage/${level}/${title}/${id}`);
    }
  };

  //deleteHandle
  const handleDeleteClick = async (podcast) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa không?");

    if (isConfirmed) {
      try {
        console.log("delete fileeeee is coming");

        const deleteExistingFiles = async () => {
          try {
            // Xóa tệp âm thanh
            const audioDeleteRef = ref(storage, `${level}/${podcast.name}`);
            await deleteObject(audioDeleteRef);
            console.log("Đã xóa tệp âm thanh cũ.");

            // Xóa tệp văn bản
            const textDeleteRef = ref(
              storage,
              `Transcripts/${level}-${podcast.name}`
            );
            await deleteObject(textDeleteRef);
            console.log("Đã xóa tệp văn bản cũ.");
          } catch (deleteError) {
            console.error("Lỗi khi xóa các tệp đã tồn tại:", deleteError);
          }
        };

        // Gọi hàm để xóa các tệp đã tồn tại
        await deleteExistingFiles();

        try {
          const res = await fetch("/api/deletePodcast", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              podcastID: podcast._id,
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
                  value={level}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="level"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Type
                </label>
                <select
                  id="level"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full"
                  value={type}
                  onChange={handleTypeChange}
                >
                  <option value="Business">Business</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Detective">Detective</option>
                </select>
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
                  htmlFor="podcastName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Describe
                </label>
                <input
                  type="text"
                  id="podcastName"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full"
                  value={describe}
                  onChange={(e) => setDescribe(e.target.value)}
                />
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
                  readOnly
                  value={editedLevel}
                  onChange={(e) => setEditedLevel(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="level"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Type
                </label>
                <select
                  id="level"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full"
                  value={editedType}
                  onChange={(e) => setEditedType(e.target.value)}
                >
                  <option value="Business">Business</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Detective">Detective</option>
                </select>
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
                  htmlFor="podcastName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Describe
                </label>
                <input
                  type="text"
                  id="podcastName"
                  className="border border-gray-400 px-2 py-1 rounded-md w-full"
                  value={editedDescribe}
                  onChange={(e) => setEditedDescribe(e.target.value)}
                />
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
                onClick={handleUpdate}
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
            onClick={(event) =>
              handleBlockClick(event, podcast.name, podcast._id)
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
            {/* <button
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded text-sm truncate"
              onClick={() => handleFavoriteClick(podcast)}
            >
              Favourite
            </button> */}
            <button
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded text-sm truncate"
              onClick={() => handleDeleteClick(podcast)}
            >
              Delete
            </button>

            <button
              className="absolute top-0 right-[50px] bg-green-500 text-white p-1 rounded text-sm truncate"
              onClick={() => openEditPopup(podcast)}
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
