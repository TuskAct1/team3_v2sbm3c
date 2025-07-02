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
  // ✅ 감정 항목 고정 순서
  const labels = ['긍정', '부정', '중립', '불안', '우울'];
  const values = [
    data['positive'] || 0,
    data['negative'] || 0,
    data['neutral'] || 0,
    data['anxious'] || 0,
    data['depressed'] || 0
  ];

  const pieData = {
    labels,
    datasets: [
      {
        label: "감정 비율 (%)",
        data: values,
        backgroundColor: [
          "#FF6384", // 긍정 - 빨강
          "#FFCD56", // 부정 - 노랑
          "#36A2EB", // 중립 - 파랑
          "#9CCC65", // 불안 - 연두
          "#BA68C8", // 우울 - 보라
        ],
        borderWidth: 1,
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
          }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}%`;
          }
        }
      },
    },
  };

  return <Pie data={pieData} options={options} />;
};

export default PieChart;
