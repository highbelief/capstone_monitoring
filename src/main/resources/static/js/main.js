const authHeader = {
    'Authorization': 'Basic ' + btoa('admin:solar2025')
};

let chartMap = {};

function renderChart(canvasId, labels, datasets) {
    if (chartMap[canvasId]) chartMap[canvasId].destroy();
    const ctx = document.getElementById(canvasId).getContext('2d');
    chartMap[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '발전량 (MW 또는 MWh)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '시간'
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

async function fetchArimaWithActual() {
    const start = document.getElementById('arimaStart').value;
    const end = document.getElementById('arimaEnd').value;

    if (!start || !end) {
        alert("조회 기간을 선택하세요.");
        return;
    }

    try {
        const [arimaRes, actualRes] = await Promise.all([
            fetch(`/api/forecast/arima?start=${start}&end=${end}`, { headers: authHeader }),
            fetch(`/api/measurements?start=${start}T00:00:00&end=${end}T23:59:59`, { headers: authHeader })
        ]);

        const arimaData = await arimaRes.json();
        const actualData = await actualRes.json();

        const uniqueActual = Array.from(new Map(actualData.map(d => [d.measuredAt, d])).values())
            .sort((a, b) => a.measuredAt.localeCompare(b.measuredAt));

        const labels = uniqueActual.map(d => d.measuredAt);
        const hourlyPower = uniqueActual.map(d => d.powerMw ?? 0);
        const cumulativeMwh = uniqueActual.map(d => d.cumulativeMwh ?? 0);

        renderChart("arimaCombinedChart", labels, [
            {
                label: "시간당 발전량 (MW)",
                data: hourlyPower,
                borderColor: "gray",
                backgroundColor: "gray",
                fill: false,
                tension: 0.3
            },
            {
                label: "실측 누적 발전량 (MWh)",
                data: cumulativeMwh,
                borderColor: "blue",
                backgroundColor: "blue",
                fill: false,
                tension: 0.3
            }
        ]);

        const tbody = document.querySelector("#arimaTable tbody");
        tbody.innerHTML = "";
        arimaData.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${item.forecastDate}</td>
        <td>${item.predictedMwh}</td>
        <td>${item.actualMwh ?? '-'}</td>
        <td>${item.rmse ?? '-'}</td>
        <td>${item.mae ?? '-'}</td>
        <td>${item.mape ?? '-'}</td>
      `;
            tbody.appendChild(tr);
        });

    } catch (e) {
        console.error("ARIMA 데이터 오류", e);
        alert("데이터 불러오기 실패");
    }
}

async function fetchSarimaForecast() {
    const start = document.getElementById('sarimaStart').value;
    const end = document.getElementById('sarimaEnd').value;

    if (!start || !end) {
        alert("SARIMA 기간 선택 필요");
        return;
    }

    try {
        const response = await fetch(`/api/forecast/sarima?start=${start}&end=${end}`, { headers: authHeader });
        const data = await response.json();
        const tbody = document.querySelector("#sarimaTable tbody");
        tbody.innerHTML = "";

        data.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${row.forecastStart}</td>
        <td>${row.forecastEnd}</td>
        <td>${row.predictedMwh}</td>
        <td>${row.actualMwh ?? '-'}</td>
        <td>${row.rmse ?? '-'}</td>
        <td>${row.mae ?? '-'}</td>
        <td>${row.mape ?? '-'}</td>
      `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error("SARIMA 오류", e);
        alert("SARIMA 데이터 불러오기 실패");
    }
}
