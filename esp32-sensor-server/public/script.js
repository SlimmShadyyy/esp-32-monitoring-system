const MAX_DATA_POINTS = 10; // Only keep the last 10 points

// Initialize the Charts
const tempChartCtx = document.getElementById('tempChart').getContext('2d');
const humidityChartCtx = document.getElementById('humidityChart').getContext('2d');
const airQualityChartCtx = document.getElementById('airQualityChart').getContext('2d');


async function fetchData() {
    fetch("http://localhost:3000/latest")
  .then(response => {
    console.log("Status:", response.status);
    return response.text(); // TEMPORARY
  })
  .then(text => {
    console.log("Raw response:", text);
    const data = JSON.parse(text); // Try parsing manually
    console.log("Parsed JSON:", data);
    // your chart update code
  })
  .catch(error => {
    console.error("❌ Error fetching data:", error);
  });
    try {
        const res = await fetch('http://localhost:3000/latest');
        const data = await res.json();

        console.log('Fetched data:', data);

        if (!data || !data.temperature || !data.humidity || !data.airQuality) return;

        const timeLabel = new Date().toLocaleTimeString();

        // Update UI text
        document.getElementById('tempValue').innerText = `${data.temperature} °C`;
        document.getElementById('humidityValue').innerText = `${data.humidity} %`;
        document.getElementById('airQualityValue').innerText = `${data.airQuality} AQI`;

        // Helper function to update each chart
        const updateChart = (chart, value) => {
            chart.data.labels.push(timeLabel);
            chart.data.datasets[0].data.push(value);

            // Keep only the latest N points
            if (chart.data.labels.length > MAX_DATA_POINTS) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
            }

            chart.update();
        };

        updateChart(tempChart, data.temperature);
        updateChart(humidityChart, data.humidity);
        updateChart(airQualityChart, data.airQuality);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Initial fetch
fetchData();
// Fetch every 5 seconds
setInterval(fetchData, 5000);
const tempChart = new Chart(tempChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature (°C)',  // Dataset label
            borderColor: 'rgba(255, 99, 132, 1)',  // Line color
            backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Background color for the graph area
            data: [],
            fill: true,  // Fill the background area under the line
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Real-Time Temperature',  // Your chart title
                font: {
                    size: 18,  // Title font size
                    weight: 'bold',  // Make it bold
                    family: 'Arial',  // Font family
                },
                color: '#333',  // Darker title color (dark grey)
            },
            legend: {
                labels: {
                    font: {
                        weight: 'bold',  // Make the legend label bold
                        size: 14,  // Font size for the legend labels
                    },
                    color: '#333',  // Darker color for the legend labels
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',  // Darker grid lines for x-axis
                },
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',  // Darker grid lines for y-axis
                },
            },
        },
        elements: {
            line: {
                borderWidth: 3,  // Adjust the thickness of the line (optional)
            },
            point: {
                radius: 5,  // Adjust the size of the data points (optional)
                borderWidth: 2,  // Make the data points thicker (optional)
                backgroundColor: 'rgba(255, 99, 132, 1)',  // Color of the data points
            }
        },
    }
});

const humidityChart = new Chart(humidityChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Humidity (%)',
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            data: [],
            fill: true,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Real-Time Humidity',  // Your chart title
                font: {
                    size: 18,  // Title font size
                    weight: 'bold',  // Make it bold
                    family: 'Arial',  // Font family
                },
                color: '#333',  // Darker title color (dark grey)
            },
            legend: {
                labels: {
                    font: {
                        weight: 'bold',  // Make the legend label bold
                        size: 14,  // Font size for the legend labels
                    },
                    color: '#333',  // Darker color for the legend labels
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',  // Darker grid lines for x-axis
                },
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',  // Darker grid lines for y-axis
                },
            },
        },
        elements: {
            line: {
                borderWidth: 3,  // Adjust the thickness of the line (optional)
            },
            point: {
                radius: 5,  // Adjust the size of the data points (optional)
                borderWidth: 2,  // Make the data points thicker (optional)
                backgroundColor: 'rgba(255, 99, 132, 1)',  // Color of the data points
            }
        },
    }
});

const airQualityChart = new Chart(airQualityChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Air Quality (AQI)',
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            data: [],
            fill: true,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Real-Time Air-Quality',  // Your chart title
                font: {
                    size: 18,  // Title font size
                    weight: 'bold',  // Make it bold
                    family: 'Arial',  // Font family
                },
                color: '#333',  // Darker title color (dark grey)
            },
            legend: {
                labels: {
                    font: {
                        weight: 'bold',  // Make the legend label bold
                        size: 14,  // Font size for the legend labels
                    },
                    color: '#333',  // Darker color for the legend labels
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',  // Darker grid lines for x-axis
                },
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',  // Darker grid lines for y-axis
                },
            },
        },
        elements: {
            line: {
                borderWidth: 3,  // Adjust the thickness of the line (optional)
            },
            point: {
                radius: 5,  // Adjust the size of the data points (optional)
                borderWidth: 2,  // Make the data points thicker (optional)
                backgroundColor: 'rgba(255, 99, 132, 1)',  // Color of the data points
            }
        },
    }
});
