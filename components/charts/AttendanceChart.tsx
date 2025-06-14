import React, { useEffect, useRef } from 'react';
import { AttendanceData } from '../../types';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../../constants'; // Assuming these are Tailwind color names

interface AttendanceChartProps {
  attendanceByMonth?: AttendanceData['byMonth'];
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ attendanceByMonth }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null); // Store Chart instance

  useEffect(() => {
    if (!chartRef.current || !attendanceByMonth || Object.keys(attendanceByMonth).length === 0) {
       if(chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      // Clear canvas or show message if no data
      const canvas = chartRef.current;
      if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
              ctx.clearRect(0,0,canvas.width, canvas.height);
              ctx.font = "14px 'Roboto', sans-serif";
              ctx.fillStyle = "#64748b"; // slate-500
              ctx.textAlign = "center";
              ctx.fillText("No monthly attendance data for chart.", canvas.width / 2, canvas.height / 2);
          }
      }
      return;
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    
    const labels = Object.keys(attendanceByMonth).sort((a, b) => new Date(Date.parse("01 " + a)).getTime() - new Date(Date.parse("01 " + b)).getTime());
    const presentData = labels.map(month => attendanceByMonth[month].present || 0);
    const absentData = labels.map(month => attendanceByMonth[month].absent || 0);

    const ctx = chartRef.current.getContext('2d');
    if(!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Days Present',
            data: presentData,
            borderColor: `rgba(34, 197, 94, 1)`, // green-500
            backgroundColor: `rgba(34, 197, 94, 0.2)`,
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Days Absent',
            data: absentData,
            borderColor: `rgba(220, 38, 38, 1)`, // red-600
            backgroundColor: `rgba(220, 38, 38, 0.2)`,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 30, // Or calculate based on max working days
            ticks: { 
                stepSize: 5,
                font: { family: "'Roboto', sans-serif" }
            },
             grid: {
                color: '#e2e8f0' // slate-200
            }
          },
          x: {
            ticks: {
                font: { family: "'Roboto', sans-serif" }
            },
            grid: {
                display: false
            }
          }
        },
        plugins: {
          legend: { 
            display: true, 
            position: 'top',
            labels: {
                font: { family: "'Roboto', sans-serif" }
            }
          },
          title: {
            display: true,
            text: "Monthly Attendance Trend",
            font: { size: 16, family: "'Titillium Web', sans-serif", weight: '600' },
            color: '#1e293b' // slate-800
          },
           tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
      },
    });
     // Cleanup function
    return () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        }
    };
  }, [attendanceByMonth]);

  return <div className="h-72 mt-5"><canvas ref={chartRef}></canvas></div>;
};

export default AttendanceChart;
