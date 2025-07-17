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
  if (!data || data.length === 0) {
    return <p style={{ textAlign: "center" }}>로딩중...</p>;
  }

  // 👉 1. x축 라벨: 주차나 월
  const labels = data.map(item => item.reportPeriod);

  const emotionMap = {
    positive: '긍정',
    negative: '부정',
    neutral: '중립',
    anxious: '불안',
    depressed: '우울'
  };

  // 👉 2. 감정별 데이터 배열
  const emotions = ['positive', 'negative', 'neutral', 'anxious', 'depressed'];

  const emotionColors = {
    긍정: '#FF6384',
    부정: '#FFCD56',
    중립: '#36A2EB',
    불안: '#9CCC65',
    우울: '#BA68C8'
  };

  const datasets = emotions.map(emotionKey => {
    const koreanLabel = emotionMap[emotionKey];
    return {
      label: koreanLabel,
      data: data.map(item =>
        item && typeof item[emotionKey] === 'number'
          ? item[emotionKey]
          : 0
      ),
      borderColor: emotionColors[koreanLabel],
      backgroundColor: emotionColors[koreanLabel] + '33',
      fill: true,
      tension: 0.3,
    };
  });

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: context => `${context.dataset.label}: ${context.parsed.y}%`
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: '퍼센트(%)',
          color: '#333',
          font: { size: 18, weight: 'bold' }
        }
      },
      x: {
        title: {
          display: true,
          text: '기간',
          color: '#333',
          font: { size: 18, weight: 'bold' }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
