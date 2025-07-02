// components/EmotionLineChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const LineChart = ({ data }) => {
  const chartData = {
    labels: ['긍정', '부정', '중립', '불안', '우울'],
    datasets: data.map((item) => ({
      label: item.reportPeriod,
      data: [
        item.긍정,
        item.부정,
        item.중립,
        item.불안,
        item.우울,
      ],
      borderColor: getRandomColor(),
      fill: false,
      tension: 0.3,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

function getRandomColor() {
  const colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#9CCC65', '#BA68C8'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default LineChart;
