"use client";

export default function LevelDetail({ params }) {
  // Sử dụng giá trị id ở đây
  const { level } = params;
  return (
    <div>
      <h1>Chi tiết khối block {level}</h1>
    </div>
  );
}
