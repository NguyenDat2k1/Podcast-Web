"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function Quizz() {
  const { data: session } = useSession();
  const router = useRouter();
  const [idQuizz, setIDQuizz] = useState("");
  const [listQuizz, setListQuizz] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [isCheck, setIsCheck] = useState(true);
  const [addFlag, setAddFlag] = useState(false);
  const [displayFlag, setDisplayFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [user_ID, setUser_ID] = useState("");
  const [numQuizz, setNumQuizz] = useState("");
  const [ques, setQues] = useState("");
  const [quesToSpeak, setQuesToSpeak] = useState("");
  let email = session?.user?.email;
  const maxLines = 3;
  const [yourAnswer, setYourAnswer] = useState("");
  useEffect(() => {
    const getListPodcast = async () => {
      try {
        const resListQuizz = await fetch("/api/getAllQuizz", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });

        const quizz = await resListQuizz.json();

        console.log(quizz);

        if (Array.isArray(quizz)) {
          console.log("quizz list đã lấy: ", quizz);
          setListQuizz(quizz);
        } else {
          console.error("Invalid quizz structure in the response:");
        }
      } catch (error) {
        console.error("Error fetching data quizz from MongoDB:", error);
      }
    };

    getListPodcast();
  }, [updateFlag]);

  const handleSpeakQues = () => {
    const utterance = new SpeechSynthesisUtterance(quesToSpeak);
    window.speechSynthesis.speak(utterance);
  };
  const dropdownValues = [
    { id: 1, detail: "my name is barry allen" },
    { id: 2, detail: "my name is barry allen" },
    { id: 3, detail: "my name is barry allen" },
    { id: 4, detail: "my name is barry allen" },
    { id: 5, detail: "my name is barry allen" },
    { id: 6, detail: "my name is barry allen" },
    { id: 7, detail: "my name is barry allen" },
    { id: 8, detail: "my name is barry allen" },
    { id: 9, detail: "my name is barry allen" },
    { id: 10, detail: "my name is barry allen" },
  ];
  const handleCheck = () => {
    setDisplayFlag(true);
    setIsCheck(quesToSpeak.toLowerCase() === yourAnswer.toLowerCase());
    console.log(
      "ket quả: ",
      quesToSpeak.toLowerCase() === yourAnswer.toLowerCase()
    );
  };

  if (email == null) {
    router.push(`/homePage`);
  }
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const takeTheQuizz = (quizz, numOfQuizz) => {
    setQuesToSpeak(quizz.ques);
    setIDQuizz(quizz._id);
    setNumQuizz(numOfQuizz);
  };

  const openPopup = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const isAdd = () => {
    setAddFlag(true);
  };
  const isUpdate = () => {
    setEditFlag(true);
  };
  const closeAdd = () => {
    setAddFlag(false);
  };
  const closeUpdate = () => {
    setEditFlag(false);
  };
  const handleAdd = async () => {
    try {
      console.log("ques vừa nhập: ", ques);
      const res = await fetch("/api/addQuizz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ques: ques,
        }),
      });

      if (res.ok) {
        setAddFlag((prev) => !prev);
        setUpdateFlag((prev) => !prev);
        setQues("");
      } else {
        console.log("Podcast registration failed.");
      }
    } catch (error) {
      console.log("Error during Podcast: ", error);
    }
  };

  const handleUpdate = async () => {
    try {
      console.log("updating Quizz with id and detail: ", idQuizz, quesToSpeak);

      try {
        // call API để cập nhật podcast
        const res = await fetch("/api/updateQuizz", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizzID: idQuizz,
            detail: quesToSpeak,
          }),
        });

        if (res.ok) {
          setQuesToSpeak("");
          setIDQuizz("");
          setEditFlag((prev) => !prev);
          setUpdateFlag((prev) => !prev);
          console.log("Cập nhật Quizz thành công.");
        } else {
          console.log("Cập nhật Quizz thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi xử lý update Quizz:", error);
      }
    } catch (error) {
      console.error("Lỗi trong handleUpdate:", error);
    }
  };
  const handleDelete = async () => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa không?");

    if (isConfirmed) {
      try {
        console.log("delete quizz is coming");

        try {
          const res = await fetch("/api/deleteQuizz", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              quizzID: idQuizz,
            }),
          });

          if (res.ok) {
            setUpdateFlag((prev) => !prev);
            console.log("XÓA podcast thành công.");
          } else {
            console.log("XÓA podcast thất bại.");
          }
        } catch (error) {
          console.error("XÓA trong handleUpdate:", error);
        }
      } catch (error) {
        console.error("XÓA trong handleUpdate:", error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-between items-center p-4 bg-gray-200 relative">
        <div className="relative">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded-md"
            onClick={openPopup}
          >
            List Quizz
          </button>
          <button
            className=" ml-5 bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={isAdd}
          >
            Thêm
          </button>
          <button
            className="ml-5 bg-yellow-500 text-white px-4 py-2 rounded-md"
            onClick={isUpdate}
          >
            Sửa
          </button>
          <button
            className="ml-5 bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={handleDelete}
          >
            xóa
          </button>
          {addFlag && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded-lg">
                <form>
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
                      value={ques}
                      onChange={(e) => setQues(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="bg-blue-500 text-white px-2 py-1 rounded-md"
                    onClick={handleAdd}
                  >
                    Lưu
                  </button>
                  <button type="button" onClick={closeAdd}>
                    Đóng
                  </button>
                </form>
              </div>
            </div>
          )}
          {editFlag && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded-lg">
                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="podcastName"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Quizz Detail
                    </label>
                    <input
                      type="text"
                      id="podcastName"
                      className="border border-gray-400 px-2 py-1 rounded-md w-full"
                      value={quesToSpeak}
                      onChange={(e) => setQuesToSpeak(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="bg-blue-500 text-white px-2 py-1 rounded-md"
                    onClick={handleUpdate}
                  >
                    Cập nhật
                  </button>
                  <button type="button" onClick={closeUpdate}>
                    Đóng
                  </button>
                </form>
              </div>
            </div>
          )}
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 max-h-80 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="grid grid-cols-10 gap-1 p-2">
                {/* {listQuizz.map((value) => (
                  <div
                    key={value.id}
                    className={`h-8 p-1 hover:bg-gray-100 ${
                      selectedValue === value.id
                        ? "bg-green-500 text-white"
                        : ""
                    }`}
                    onClick={() => selectValue(value.id)}
                  >
                    {value.id}
                  </div>
                ))} */}
                {listQuizz.map((value, index) => (
                  <div
                    key={value.id}
                    className={`h-8 p-1 hover:bg-gray-100 ${
                      quesToSpeak == value.ques ? "bg-green-500 text-white" : ""
                    }`}
                    onClick={() => takeTheQuizz(value, index + 1)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-1/2 h-80 mx-auto bg-gray-100 border border-black mt-40">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded-md"
          onClick={handleSpeakQues}
        >
          Nghe Quizz
        </button>
        <p>Câu Quizz số {numQuizz}</p>
        <input
          type="text"
          value={yourAnswer}
          onChange={(e) => setYourAnswer(e.target.value)}
          placeholder="Nhập giá trị cho Input 1"
          className={`mt-2 p-2 bg-white border border-gray-300 rounded-md block w-full h-20 ${
            isCheck ? "" : "border-red-500 border-4"
          }`}
        />
        {displayFlag ? <p>Đáp án đúng là: {quesToSpeak}</p> : ""}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md"
            onClick={handleCheck}
          >
            Check
          </button>
          {/* <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={handleButtonClick}
          >
            Đọc Văn Bản 2
          </button> */}
        </div>
      </div>
      <div className="flex justify-center space-x-4  absolute  left-1/2 transform -translate-x-1/2">
        <button
          className="bg-green-400 text-white px-4 py-2 rounded-md"
          // onClick={handleButtonClick}
        >
          &lt;&lt; Câu trước
        </button>
        <button
          className="bg-green-400 text-white px-4 py-2 rounded-md"
          // onClick={handleButtonClick}
        >
          Câu tiếp &gt;&gt;
        </button>
      </div>
    </div>
  );
}
