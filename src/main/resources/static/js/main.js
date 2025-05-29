// 기본 인증 헤더 설정 (admin / solar2025)
const authHeader = {
    'Authorization': 'Basic ' + btoa('admin:solar2025')
};

// 차트 객체들을 저장할 맵 (캔버스 ID별로 관리)
let chartMap = {};

// 차트 생성 및 재랜더링 함수
function renderChart(canvasId, labels, datasets) {
    // 기존 차트가 있으면 제거
    if (chartMap[canvasId]) chartMap[canvasId].destroy();

    // 캔버스 컨텍스트 가져오기
    const ctx = document.getElementById(canvasId).getContext('2d');

    // 새 차트 생성 및 저장
    chartMap[canvasId] = new Chart(ctx, {
        type: 'line',               // 선형 차트
        data: {
            labels,                // X축 라벨 (시간)
            datasets: datasets     // 선별된 데이터셋 (실측, 누적 발전량 등)
        },
        options: {
            responsive: true,      // 반응형 차트
            maintainAspectRatio: false, // 비율 고정 해제
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
                    display: true // 범례 표시
                }
            }
        }
    });
}

// ARIMA 예측 + 실측 데이터 불러오기 및 시각화
async function fetchArimaWithActual() {
    const start = document.getElementById('arimaStart').value;
    const end = document.getElementById('arimaEnd').value;

    if (!start || !end) {
        alert("조회 기간을 선택하세요.");
        return;
    }

    try {
        // ARIMA 예측 및 실측 데이터를 동시에 가져오기
        const [arimaRes, actualRes] = await Promise.all([
            fetch(`/api/forecast/arima?start=${start}&end=${end}`, { headers: authHeader }),
            fetch(`/api/measurements?start=${start}T00:00:00&end=${end}T23:59:59`, { headers: authHeader })
        ]);

        // JSON으로 변환
        const arimaData = await arimaRes.json();
        const actualData = await actualRes.json();

        // 중복 제거 및 시간순 정렬
        const uniqueActual = Array.from(new Map(actualData.map(d => [d.measuredAt, d])).values())
            .sort((a, b) => a.measuredAt.localeCompare(b.measuredAt));

        // X축 라벨: 측정 시각
        const labels = uniqueActual.map(d => d.measuredAt);

        // Y축 데이터셋 1: 시간당 발전량 (MW)
        const hourlyPower = uniqueActual.map(d => d.powerMw ?? 0);

        // Y축 데이터셋 2: 누적 발전량 (MWh)
        const cumulativeMwh = uniqueActual.map(d => d.cumulativeMwh ?? 0);

        // 차트 렌더링
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

        // 표에 ARIMA 데이터 출력
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

// SARIMA 예측 데이터 불러오기 및 표로 출력
async function fetchSarimaForecast() {
    const start = document.getElementById('sarimaStart').value;
    const end = document.getElementById('sarimaEnd').value;

    if (!start || !end) {
        alert("SARIMA 기간 선택 필요");
        return;
    }

    try {
        // SARIMA 예측 결과 API 호출
        const response = await fetch(`/api/forecast/sarima?start=${start}&end=${end}`, { headers: authHeader });
        const data = await response.json();

        // 표에 결과 출력
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
