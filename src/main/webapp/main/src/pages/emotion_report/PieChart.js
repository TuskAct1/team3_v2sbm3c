// components/PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const labels = ['긍정', '부정', '중립', '불안', '우울'];
  const defaultColors = [
    "#FF6384", // 긍정
    "#FFCD56", // 부정
    "#36A2EB", // 중립
    "#9CCC65", // 불안
    "#BA68C8"  // 우울
  ];

  let values = [
    data['positive'] || 0,
    data['negative'] || 0,
    data['neutral'] || 0,
    data['anxious'] || 0,
    data['depressed'] || 0
  ];

  const isAllZero = values.every((v) => v === 0);

  // ✅ 데이터가 전부 0이면 -> 회색 단일값
  const pieData = {
    labels,
    datasets: [
      {
        label: "감정 비율 (%)",
        data: isAllZero ? [1] : values,
        backgroundColor: isAllZero
          ? ["#e0e0e0"]
          : defaultColors,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14
          },
          // ✅ 항상 감정별 색상과 라벨 유지
          generateLabels: (chart) => {
            return labels.map((label, index) => ({
              text: label,
              fillStyle: defaultColors[index],
              strokeStyle: defaultColors[index],
              hidden: false,
              index: index
            }));
          }
        }
      },
      tooltip: {
        enabled: !isAllZero, // 0%일 때는 툴팁도 제거
      },
    },
  };

  return <Pie data={pieData} options={options} />;
};

export default PieChart;
