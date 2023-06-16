import { useState } from 'react'
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar, Chart } from 'react-chartjs-2'

export default function Barchart({ data, horizontal }) {
  const [barData, setBarData] = useState({
    labels: data.map((item) => item.teacherName),
    datasets: [
      {
        label: 'Average Rating out of 50',
        data: data.map((item) => item.avgRating),
        backgroundColor: [
          'rgba(255, 99, 132, 0.4)',
          'rgba(75, 192, 192, 0.4)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132)',
          'rgba(75, 192, 192)',
          'rgba(153, 102, 255)',
        ],
        borderWidth: 2,
        hoverBorderColor: 'black',
      },
    ],
  })

  const options = {
    layout: {
      padding: 20,
    },
    indexAxis: horizontal ? 'y' : 'x',
    maintainAspectRatio: horizontal ? false : true,
  }
  return (
    <div className="chartBg">
      <Bar data={barData} options={options} />
    </div>
  )
}
