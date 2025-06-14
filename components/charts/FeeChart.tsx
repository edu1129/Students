import React, { useEffect, useRef } from 'react';
import { FeesData } from '../../types';
import { formatCurrency } from '../../utils/formatter';
import { PRIMARY_COLOR } from '../../constants';

interface FeeChartProps {
  feeData?: FeesData['byMonthPaid'];
}

const FeeChart: React.FC<FeeChartProps> = ({ feeData }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null); // To store Chart instance

  useEffect(() => {
    if (!chartRef.current || !feeData || Object.keys(feeData).length === 0) {
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
              ctx.fillText("No monthly fee payment data to display.", canvas.width / 2, canvas.height / 2);
          }
      }
      return;
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Destroy previous instance before creating new one
    }
    
    const labels = Object.keys(feeData).sort((a, b) => new Date(Date.parse("01 " + a)).getTime() - new Date(Date.parse("01 " + b)).getTime());
    const dataPoints = labels.map(label => feeData[label]);

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Fees Paid',
          data: dataPoints,
          backgroundColor: `rgba(59, 130, 246, 0.7)`, // bg-blue-500 with opacity
          borderColor: `rgba(59, 130, 246, 1)`, // border-blue-500
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: number | string) => formatCurrency(Number(value)),
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
            display: false,
          },
          title: {
            display: true,
            text: "Monthly Fee Payments",
            font: { size: 16, family: "'Titillium Web', sans-serif", weight: '600' },
            color: '#1e293b' // slate-800
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += formatCurrency(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
      },
    });
     // Cleanup function to destroy the chart on component unmount
    return () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        }
    };
  }, [feeData]);

  return <div className="h-72 mt-5"><canvas ref={chartRef}></canvas></div>;
};

export default FeeChart;
