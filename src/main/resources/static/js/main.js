const authHeader = {
    'Authorization': 'Basic ' + btoa('admin:solar2025')
};

// 공통 차트 관리 객체
let chartMap = {};
function renderChart(canvasId, labels, datasets) {
    if (chartMap[canvasId]) chartMap[canvasId].destroy();
    const ctx = document.getElementById(canvasId).getContext('2d');
    chartMap[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: datasets.map(ds => ({
                label: ds.label,
                data: ds.data,
                borderColor: ds.borderColor || getRandomColor(),
                borderWidth: 2,
                pointRadius: 2,
                tension: 0.2,
                fill: false
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,  // ✅ 기본 비율 유지,
            scales: {
                x: {
                    title: { display: true, text: "시간" }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "발전량 (MWh 또는 MW)" },
                    suggestedMax: 600 // 화면 이탈 방지용
                }
            }
        }
    });
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return `rgb(${r},${g},${b})`;
}

// 실측 + ARIMA 예측
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

        const arimaMap = new Map(arimaData.map(item => [item.forecastDate, item.predictedMwh]));
        const predictedMwh = labels.map(time => {
            return arimaMap.has(time) ? arimaMap.get(time) : null;
        });

        renderChart("arimaCombinedChart", labels, [
            { label: "시간당 발전량 (MW)", data: hourlyPower, borderColor: "gray" },
            { label: "실측 누적 발전량 (MWh)", data: cumulativeMwh, borderColor: "blue" },
            { label: "ARIMA 예측 발전량 (MWh)", data: predictedMwh, borderColor: "orange" }
        ]);
    } catch (e) {
        console.error("데이터 불러오기 실패", e);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
    }
}

// SARIMA
async function fetchSarimaForecast() {
    const start = document.getElementById('sarimaStart').value;
    const end = document.getElementById('sarimaEnd').value;

    if (!start || !end) {
        alert("조회 기간을 선택하세요.");
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
        console.error("SARIMA 데이터 불러오기 실패", e);
        alert("SARIMA 데이터를 불러오는 중 오류 발생");
    }
}
