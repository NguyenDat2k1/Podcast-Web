"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import YouTube from "react-youtube";

export default function DetailPage({ params }) {
  const { data: session } = useSession();
  const [detailPodcast, setDetailPodcast] = useState({});
  const { detail } = params;
  const id = detail[2];
  console.log(detail);

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
  console.log("audio path:", detailPodcast.audioPath);
  return (
    <div>
      <Navbar />

      <div className="flex justify-center items-center h-screen mt-60">
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
              <a href={detailPodcast.audioPath} download className="block mb-2">
                <span className="mr-2">&#8226;</span> Download Audio
              </a>
              <a href={detailPodcast.transcriptPath} download className="block">
                <span className="mr-2">&#8226;</span> Download Script
              </a>
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

          {blocks.map((block) => (
            <div
              className="border border-gray-300 p-6 mt-15 relative mb-4"
              key={block.title}
            >
              <h2>{block.title}</h2>

              <audio controls className="mb-2">
                <source src={block.audioSource} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>

              <a
                href={block.audioDownloadLink}
                download
                className="block mb-2 text-left"
              >
                <span className="mr-2">&#8226;</span> Tải tệp âm thanh xuống
              </a>
              <a
                href={block.textDownloadLink}
                download
                className="block text-left"
              >
                <span className="mr-2">&#8226;</span> Tải tệp văn bản xuống
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
