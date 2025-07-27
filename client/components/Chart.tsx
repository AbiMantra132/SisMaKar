import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
LineElement,
PointElement,
Tooltip,
Legend,
ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

interface MonthlyAttendanceChartProps {
data: {
  label: string;
  value: number; // value as percentage (0-100)
}[];
}

export const MonthlyAttendanceChart: React.FC<MonthlyAttendanceChartProps> = ({
  data,
}) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Attendance",
        data: data.map((d) => d.value),
        backgroundColor: "rgba(76, 217, 100, 0.7)",
        borderRadius: 2,
        barPercentage: 0.5,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y ?? context.parsed;
            return `Attendance: ${value}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
          font: { size: 16 },
        },
        grid: {
          color: "rgba(255,255,255,0.2)",
        },
      },
      x: {
        ticks: {
          color: "#888",
          font: { size: 16 },
        },
        grid: {
          display: true,
        },
      },
    },
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "#ffff", padding: 16, borderRadius: 8 }}>
      <Bar data={chartData} options={options} height={200} />
    </div>
  );
};


interface AttendanceComparisonChartProps {
  data: {
    label: string;
    value: number; // value as percentage (0-100)
  }[];
}

export const AttendanceComparisonChart: React.FC<AttendanceComparisonChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Attendance",
        data: data.map((d) => d.value),
        fill: true,
        borderColor: "rgba(76, 217, 100, 1)",
        pointRadius: 5, // Show points
        pointBackgroundColor: "rgba(76, 217, 100, 1)",
        pointHoverRadius: 7,
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }, // Enable tooltip for click
    },
    elements: {
      line: {
        borderWidth: 2,
        fill: true,
      },
      point: {
        pointStyle: "circle",
        hoverRadius: 7,
        radius: 5,
      },
    },
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const label = chartData.labels[elementIndex];
        const value = chartData.datasets[0].data[elementIndex];
      }
    },
    scales: {
      y: {
        type: "linear",
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return `${value}%`;
          },
          font: { size: 14 },
        },
        grid: {
          color: "rgba(220,220,220,0.7)", // More visible grid
        },
      },
      x: {
        type: "category",
        ticks: {
          font: { size: 14 },
        },
        grid: {
          color: "rgba(220,220,220,0.7)", // More visible grid
        },
      },
    },
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 8, borderRadius: 8}}>
      <Line data={chartData} options={options} height={100} />
    </div>
  );
};