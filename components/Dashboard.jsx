"use client";

import { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";
import { redirect, useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import { Bar, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function Dashboard() {
  const { data: session } = useSession();
  const [listPodcast, setListPodcast] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [podcastCount, setPodcastCount] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);
  const router = useRouter();
  // let email = session?.user?.email;

  // if (email == null) {
  //   router.push(`/login`);
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [podcastCount, userCount, downloadCount] = await Promise.all([
          fetch("/api/getPodcastCount", {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }),
          fetch("/api/getUserCount", {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }),
          fetch("/api/getDownloadCount", {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }),
        ]);

        const [podcasts, users, downloads] = await Promise.all([
          podcastCount.json(),
          userCount.json(),
          downloadCount.json(),
        ]);

        if (podcasts) {
          console.log("user count : ", users.userCount);

          const totalDownloadsSum = downloads.reduce(
            (accumulator, currentPodcast) =>
              accumulator + currentPodcast.totalDownloads,
            0
          );
          const topPodcasts = downloads
            .sort((a, b) => b.totalDownloads - a.totalDownloads)
            .slice(0, 5);
          await setListPodcast(topPodcasts);
          await setPodcastCount(podcasts.podcastCount);
          await setUserCount(users.userCount);

          await setDownloadCount(totalDownloadsSum);
        } else {
          console.error("Invalid data structure in the response:");
        }
      } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
      }
    };

    fetchData();
  }, [updateFlag]);

  //chart
  const barChartData = {
    labels: listPodcast.map((podcast) => podcast.name),
    datasets: [
      {
        label: "Total Downloads",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.6)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: listPodcast.map((podcast) => podcast.totalDownloads),
      },
    ],
  };

  const lineChartData = {
    labels: listPodcast.map((podcast) => podcast.name), // Thêm dữ liệu nhãn cho trục x của đồ thị line
    datasets: [
      {
        label: "Your Line Dataset",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(255,0,0,0.4)",
        borderColor: "rgba(255,0,0,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(255,0,0,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(255,0,0,1)",
        pointHoverBorderColor: "rgba(255,0,0,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: listPodcast.map((podcast) => podcast.totalDownloads), // Thêm dữ liệu cho trục y của đồ thị line
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const items = [
    { id: `${userCount}`, title: "USERS" },
    { id: `${downloadCount}`, title: "DOWNLOAD" },
    { id: `${podcastCount}`, title: "PODCASTS" },
    { id: "6", title: "LEVEL" },
  ];
  return (
    <div>
      <Navbar />
      {userCount ? (
        <div className="flex justify-center">
          {items.map((item) => (
            <div
              key={item.id}
              className="border-2 border-black p-4 h-32 cursor-pointer m-4"
              style={{ width: "calc(25% - 15px)" }}
              onClick={() => handleBlockClick(item.id)}
            >
              <span>{item.id}</span>
              <span style={{ marginLeft: "0.5em" }}>{item.title}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex justify-center mt-4 ml-20">
        <div className="w-5/6 h-96">
          <Bar data={barChartData} options={options} />
        </div>
        <div className="w-5/6 h-96">
          <Line data={lineChartData} options={options} />
        </div>
      </div>
    </div>
  );
}
