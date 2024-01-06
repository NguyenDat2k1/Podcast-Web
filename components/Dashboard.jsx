"use client";

import { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";
import { redirect, useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import { Bar, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function Dashboard() {
  const [chartKey, setChartKey] = useState(0);
  const [searchFlg, setSearchFlg] = useState(0);
  const [infSearch, setInfSearch] = useState("");
  const [infTypeAct, setinfTypeAct] = useState("");
  const { data: session } = useSession();
  const [listActivity, setActivity] = useState([]);
  const [listDocsAnal, setListDocsAnal] = useState([]);
  const [listTypeAnal, setListTypeAnal] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [podcastCount, setPodcastCount] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);
  const [yearForDocs, setYearForDocs] = useState("");
  const [monthForDocs, setMonthForDocs] = useState("");
  const [yearForType, setYearForType] = useState("");
  const [monthForType, setMonthForType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const router = useRouter();
  let email = session?.user?.email;

  if (email == null) {
    router.push(`/homePage`);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [podcastCount, userCount, downloadCount, lstActivity] =
          await Promise.all([
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
            fetch("/api/getAllActivity", {
              method: "GET",
              headers: {
                "Content-type": "application/json",
              },
            }),
          ]);

        const [podcasts, users, downloads, activities] = await Promise.all([
          podcastCount.json(),
          userCount.json(),
          downloadCount.json(),
          lstActivity.json(),
        ]);
        console.log("activities: ", activities);
        if (podcasts) {
          console.log("user count : ", users.userCount);

          const totalDownloadsSum = downloads.reduce(
            (accumulator, currentPodcast) =>
              accumulator + currentPodcast.totalDownloads,
            0
          );
          // const topPodcasts = downloads
          //   .sort((a, b) => b.totalDownloads - a.totalDownloads)
          //   .slice(0, 5);
          // await setListPodcast(topPodcasts);

          await setSearchResults(activities);
          await setActivity(activities);
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
    labels: listDocsAnal.map((podcast) => podcast.name),
    datasets: [
      {
        label: "Total Downloads",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.6)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: listDocsAnal.map((podcast) => podcast.counT),
      },
    ],
  };

  const lineChartData = {
    labels: listTypeAnal.map((podcast) => podcast.type),
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
        data: listTypeAnal.map((podcast) => podcast.counT), // Thêm dữ liệu cho trục y của đồ thị line
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
        max: 8,
      },
    },
  };
  const handleApplyDocsClick = async () => {
    try {
      if (monthForDocs == "") {
        window.confirm("Bạn chưa chọn tháng");
        return;
      }
      if (yearForDocs == "") {
        window.confirm("Bạn chưa chọn năm");
        return;
      }
      let datE = `${monthForDocs}/${yearForDocs}`;

      console.log("datE: ", datE);
      const resListPodcast = await fetch("/api/getAllPodcast", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      const podcasts = await resListPodcast.json();
      const resDocsAnal = await fetch("api/getDocsAnal", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      const docsAnal = await resDocsAnal.json();

      console.log("abdfdfd:", docsAnal);
      if (docsAnal) {
        const mergedArray = podcasts
          .map((podcast) => {
            const matchingDoc = docsAnal.find(
              (doc) => doc.id_podcast === podcast._id
            );

            if (matchingDoc) {
              // Nếu có đối tượng trùng _id, tạo một đối tượng mới
              // Chứa trường name từ array podcasts và tất cả các trường từ array docsAnal
              return {
                name: podcast.name,
                ...matchingDoc,
              };
            }

            return null; // Nếu không có đối tượng trùng _id, trả về null
          })
          .filter((item) => item !== null);

        // Tìm các object có trùng name là 'abc'
        const filteredArray = mergedArray.filter((item) => item.datE === datE);
        filteredArray.sort((a, b) => b.counT - a.counT);
        const top5 = filteredArray.slice(0, 5);
        console.log("filteredArray : ", top5);
        // .filter((item) => item !== null);
        setListDocsAnal(top5);
        setChartKey((prevKey) => prevKey + 1);
        console.log("mergedArray: ", mergedArray);
      } else {
        console.error("lỗi từ danh sách docsAnal:", docsAnal);
      }
    } catch (e) {
      console.error("Error fetching docsAnal data from MongoDB:", e);
    }
  };

  //typeAnal
  const handleApplyTypeClick = async () => {
    try {
      if (monthForType == "") {
        window.confirm("Bạn chưa chọn tháng");
        return;
      }
      if (yearForType == "") {
        window.confirm("Bạn chưa chọn năm");
        return;
      }
      let datE = `${monthForType}/${yearForType}`;

      console.log("datE: ", datE);
      const resListPodcast = await fetch("/api/getAllPodcast", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      const podcasts = await resListPodcast.json();
      const resDocsAnal = await fetch("api/getDocsAnal", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      const docsAnal = await resDocsAnal.json();

      console.log("abdfdfd:", docsAnal);
      if (docsAnal) {
        const mergedArray = podcasts
          .map((podcast) => {
            const matchingDoc = docsAnal.find(
              (doc) => doc.id_podcast === podcast._id
            );

            if (matchingDoc) {
              // Nếu có đối tượng trùng _id, tạo một đối tượng mới
              // Chứa trường name từ array podcasts và tất cả các trường từ array docsAnal
              return {
                name: podcast.name,
                ...matchingDoc,
              };
            }

            return null; // Nếu không có đối tượng trùng _id, trả về null
          })
          .filter((item) => item !== null);

        const filteredArray = mergedArray.filter((item) => item.datE === datE);
        const typeMap = new Map();

        // Lọc và giữ lại các bản ghi có giá trị counT lớn nhất cho mỗi loại (type)
        filteredArray.forEach((item) => {
          const currentType = item.type;

          if (
            !typeMap.has(currentType) ||
            item.counT > typeMap.get(currentType).counT
          ) {
            typeMap.set(currentType, item);
          }
        });

        // Chuyển đổi Map thành mảng để có được danh sách cuối cùng của các bản ghi
        const finalFilteredArray = Array.from(typeMap.values());
        finalFilteredArray.sort((a, b) => b.counT - a.counT);

        console.log("filteredArray : ", filteredArray);
        // .filter((item) => item !== null);
        setListTypeAnal(finalFilteredArray);
        setChartKey((prevKey) => prevKey + 1);
        console.log("mergedArray: ", mergedArray);
      } else {
        console.error("lỗi từ danh sách docsAnal:", docsAnal);
      }
    } catch (e) {
      console.error("Error fetching docsAnal data from MongoDB:", e);
    }
  };
  const items = [
    { id: `${userCount}`, title: "USERS" },
    { id: `${downloadCount}`, title: "DOWNLOAD" },
    { id: `${podcastCount}`, title: "PODCASTS" },
    { id: "6", title: "LEVEL" },
  ];

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return listActivity.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const searchInList = () => {
      console.log("list activity: ", listActivity);
      const results = listActivity.filter((activities) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const searchTerms = lowerCaseSearchTerm.split(" ");
        console.log("đang search...");
        // Kiểm tra xem mỗi từ khóa có xuất hiện trong tên, level hoặc type không
        const isInEmail = searchTerms.every((term) =>
          activities.user.toLowerCase().includes(term)
        );
        const isInDate = searchTerms.some((term) =>
          activities.createdAt.toLowerCase().includes(term)
        );
        const isInActivity = searchTerms.some((term) =>
          activities.activity.toLowerCase().includes(term)
        );

        return isInEmail || isInDate || isInActivity;
      });
      console.log("result: ", results);
      setActivity(results);
    };

    searchInList();
  }, [searchFlg]);

  //searchinput Activity
  const handleSearchInputChange = () => {
    console.log(infSearch);
    if (infSearch == "") {
      if (infTypeAct) {
        setActivity(searchResults);
        setSearchTerm(infTypeAct);
        setSearchFlg((prevKey) => prevKey + 1);
      } else {
        setUpdateFlag((prevKey) => prevKey + 1);
      }
    } else {
      setSearchTerm(infSearch);
      setSearchFlg((prevKey) => prevKey + 1);
      console.log("searchFlg: ", searchFlg);
    }
  };

  //typeActivity
  const handleSelectTypeActChange = (selectedValues) => {
    let newValue = selectedValues.toString();
    setActivity(searchResults);

    setinfTypeAct(newValue);
    console.log("selectedValues: ", newValue);
    console.log("list activity: ", listActivity);
    if (newValue == "") {
      console.log("vào if select1");
      if (infSearch) {
        console.log("vào if select2");
        setSearchTerm(infSearch);
        setSearchFlg((prevKey) => prevKey + 1);
      } else {
        setUpdateFlag((prevKey) => prevKey + 1);
      }
    } else {
      setSearchTerm(newValue);
      setSearchFlg((prevKey) => prevKey + 1);
    }
  };
  console.log("chart key: ", chartKey);
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
        <div className="w-5/6 h-96 relative">
          <div className="absolute top-0 left-0 right-0 flex items-center p-4 bg-white z-10">
            <select
              className="p-2 border rounded mr-2"
              value={monthForDocs}
              onChange={(e) => setMonthForDocs(e.target.value)}
            >
              <option value="">Tháng</option>
              <option value="01">T1</option>
              <option value="02">T2</option>
              <option value="03">T3</option>
              <option value="04">T4</option>
              <option value="05">T5</option>
              <option value="06">T6</option>
              <option value="07">T7</option>
              <option value="08">T8</option>
              <option value="09">T9</option>
              <option value="10">T10</option>
              <option value="11">T11</option>
              <option value="12">T12</option>
            </select>
            <select
              className="p-2 border rounded mr-2"
              value={yearForDocs}
              onChange={(e) => setYearForDocs(e.target.value)}
            >
              <option value="">Năm</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
            </select>

            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={handleApplyDocsClick}
            >
              Apply
            </button>
          </div>

          {/* Biểu đồ Bar */}
          <div className="w-full h-full">
            <Bar key={chartKey} data={barChartData} options={options} />
          </div>
          <span className="ml-40 font-bold text-blue-400">
            Biểu đồ thống kê lượt tải của tài liệu cụ thể{" "}
          </span>
        </div>

        <div className="w-5/6 h-96 relative">
          {/* Thêm selectbox và button */}
          <div className="absolute top-0 left-0 right-0 flex items-center p-4 bg-white z-10">
            <select
              className="p-2 border rounded mr-2"
              value={monthForType}
              onChange={(e) => setMonthForType(e.target.value)}
            >
              <option value="">Tháng</option>
              <option value="01">T1</option>
              <option value="02">T2</option>
              <option value="03">T3</option>
              <option value="04">T4</option>
              <option value="05">T5</option>
              <option value="06">T6</option>
              <option value="07">T7</option>
              <option value="08">T8</option>
              <option value="09">T9</option>
              <option value="10">T10</option>
              <option value="11">T11</option>
              <option value="12">T12</option>
            </select>
            <select
              className="p-2 border rounded mr-2"
              value={yearForType}
              onChange={(e) => setYearForType(e.target.value)}
            >
              <option value="">Năm</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
            </select>

            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={handleApplyTypeClick}
            >
              Apply
            </button>
          </div>

          {/* Biểu đồ Line */}
          <div className="w-full h-full">
            <Line data={lineChartData} options={options} />
          </div>
          <span className="ml-60 font-bold text-blue-400">
            Biểu đồ thống kê lượt tải của thể loại
          </span>
        </div>
      </div>
      <div className="mt-20"></div>
      <div className="flex justify-center mt-4 ml-20">
        {/* Bảng 1 */}
        <table className="w-5/6 border border-black">
          {/* Header */}
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Name Docs</th>
              <th className="p-2 border">Count Dowload </th>
            </tr>
          </thead>
          {/* Dữ liệu */}
          {listDocsAnal ? (
            <tbody>
              {listDocsAnal.map((docs) => (
                <tr key={docs._id}>
                  <td className="border text-center">{docs.datE}</td>
                  <td className="border text-center">{docs.name}</td>
                  <td className="border text-center">{docs.counT}</td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>

        {/* Bảng 2 */}
        <table className="w-5/6 ml-4 border border-black">
          {/* Header */}
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Type Docs</th>
              <th className="p-2 border">Count Download</th>
            </tr>
          </thead>
          {/* Dữ liệu */}

          {listTypeAnal ? (
            <tbody>
              {listTypeAnal.map((types) => (
                <tr key={types._id}>
                  <td className="border text-center">{types.datE}</td>
                  <td className="border text-center">{types.type}</td>
                  <td className="border text-center">{types.counT}</td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
      </div>
      <div className="mt-20"></div>
      <div className="flex justify-center mt-4 ml-20">
        <div className="w-4/6">
          <div className="flex items-center mb-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="p-2 border rounded w-full mr-2"
                onChange={(e) => setInfSearch(e.target.value)}
              />
            </div>
            <button
              className="p-2 border rounded bg-blue-400"
              onClick={handleSearchInputChange}
            >
              Tìm kiếm
            </button>
            <select
              className="p-2 border rounded"
              // multiple
              onChange={(e) => {
                const selectedValues = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                handleSelectTypeActChange(selectedValues);
              }}
            >
              <option value="">Optional</option>
              <option value="Script">Download(script)</option>
              <option value="Audio">Download(audio)</option>
              <option value="Business">Subsribe(Business)</option>
              <option value="Comedy">Subcribe(Comedy)</option>
              <option value="Detective">Subscribe(Detective)</option>
              <option value="unBusiness">Unsubscribe(Business)</option>
              <option value="unComedy">Unsubscribe(Comedy)</option>
              <option value="unDetective">Unsubscribe(Detective)</option>
              {/* Add more options as needed */}
            </select>
          </div>

          {/* Additional Table */}
          <table className="w-full border border-black">
            {/* Header */}
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">User</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Activity</th>
              </tr>
            </thead>
            {/* Data */}
            <tbody>
              {getPaginatedData().map((rowData, index) => (
                <tr key={index}>
                  <td className="border text-center">{rowData.user}</td>
                  <td className="border text-center">{rowData.createdAt}</td>
                  <td className="border text-center">{rowData.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            {[...Array(Math.ceil(listActivity.length / itemsPerPage))].map(
              (_, index) => (
                <button
                  key={index}
                  className={`p-2 mx-2 border ${
                    currentPage === index + 1 ? "bg-gray-300" : ""
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </div>
      </div>
      <div className="mt-20"></div>
    </div>
  );
}
