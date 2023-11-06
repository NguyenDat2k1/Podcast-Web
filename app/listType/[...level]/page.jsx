"use client";

import Link from "next/link";

export default function LevelDetail({ params }) {
  const { level } = params;

  // Danh sách các khối content
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

  return (
    <div>
     
      <h1>Chi tiết khối block {level}</h1>

      <div className="grid grid-cols-4 gap-4">
        {blocks.map((block) => (
          <div className="border border-gray-300 p-4" key={block.title}>
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
          </div>
        ))}
      </div>
    </div>
  );
}


