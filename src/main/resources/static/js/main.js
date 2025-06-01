// main.js - HelioCast 대시보드 통합 스크립트 (날짜 및 요약 표시, SVG 경로 매핑 포함 전체 코드)

window.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page === 'dashboard') {
        setupRealtimeClock();
        setupLogoutButton();
        setupNavigation();
        fetchWeatherForecast();
        fetchShortTermForecast();
        fetchMidTermForecast();
        drawGenerationChart();
        enhanceUI();
    }
});

function setupRealtimeClock() {
    const clock = document.getElementById('clock');
    if (!clock) return;
    setInterval(() => {
        const now = new Date();
        clock.textContent = now.toLocaleString('ko-KR');
    }, 1000);
}

function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('auth');
        window.location.href = '/login.html';
    });
}

function setupNavigation() {
    document.getElementById('toDashboard')?.addEventListener('click', () => location.href = 'dashboard.html');
    document.getElementById('toLogs')?.addEventListener('click', () => location.href = 'log.html');
}

function enhanceUI() {
    const navBar = document.getElementById('topNavbar');
    if (navBar) {
        navBar.classList.add('navbar', 'navbar-expand-lg', 'navbar-dark', 'bg-primary', 'mb-4', 'px-3');
        navBar.innerHTML = `
            <a class="navbar-brand" href="#">☀️ HelioCast</a>
            <div class="ms-auto d-flex align-items-center">
                <span id="clock" class="text-white me-3"></span>
                <button id="toDashboard" class="btn btn-outline-light btn-sm me-2">Dashboard</button>
                <button id="toLogs" class="btn btn-outline-light btn-sm me-2">Logs</button>
                <button id="logoutBtn" class="btn btn-warning btn-sm">Logout</button>
            </div>
        `;
    }
}

function fetchWeatherForecast() {
    fetch('/api/forecast')
        .then(res => res.json())
        .then(data => {
            const cardsContainer = document.getElementById('weeklyWeatherCards');
            if (!cardsContainer) return;
            cardsContainer.innerHTML = '';

            data.slice(0, 7).forEach(item => {
                const date = new Date(item.forecastDate);
                const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' });
                const card = document.createElement('div');
                card.className = 'card text-center shadow-sm bg-light border-primary';
                card.style.width = '120px';
                card.style.cursor = 'pointer';
                card.innerHTML = `
                    <div class="card-body p-2">
                        <h6 class="card-title">${weekday}</h6>
                        <p class="mb-0">🌡 ${item.forecastTemperaturePmC.toFixed(1)}°C</p>
                        <p class="mb-0">☁ ${item.forecastSkyPm}</p>
                        <p class="mb-0">☔ ${item.forecastPrecipProbPm}%</p>
                    </div>
                `;
                card.addEventListener('click', () => showWeatherDetail(item));
                cardsContainer.appendChild(card);
            });
        });
}

function fetchShortTermForecast() {
    fetch('/api/forecast/arima')
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('shortTermPredictionBody');
            if (!tbody) return;
            tbody.innerHTML = '';
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.hour}시</td>
                    <td>${row.prediction.toFixed(2)}</td>
                    <td>${(row.prediction * 130).toLocaleString()}</td>
                `;
                tbody.appendChild(tr);
            });
        });
}

function fetchMidTermForecast() {
    fetch('/api/forecast/sarima')
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('midTermPredictionBody');
            if (!tbody) return;
            tbody.innerHTML = '';
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.date}</td>
                    <td>${row.prediction.toFixed(2)}</td>
                `;
                tbody.appendChild(tr);
            });
        });
}

function drawGenerationChart() {
    fetch('/api/measurement/today')
        .then(res => res.json())
        .then(data => {
            const ctx = document.getElementById('generationChart').getContext('2d');
            const labels = data.map(d => `${d.hour}시`);
            const values = data.map(d => d.generation);
            const cumulated = values.reduce((acc, val, i) => {
                acc.push((acc[i - 1] || 0) + val);
                return acc;
            }, []);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        { label: '시간당 발전량', data: values, borderColor: 'orange', tension: 0.4 },
                        { label: '누적 발전량', data: cumulated, borderColor: 'green', tension: 0.4 }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'top' } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        });
}

window.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page === 'dashboard') {
        setupRealtimeClock();
        setupLogoutButton();
        setupNavigation();
        fetchWeatherForecast();
        fetchShortTermForecast();
        fetchMidTermForecast();
        drawGenerationChart();
        enhanceUI();
    }
});

function getIconPath(sky) {
    const nameMap = {
        '맑음': 'sun.svg',
        '구름많음': 'sun-cloud.svg',
        '구름조금': 'cloudy.svg',
        '흐림': 'cloud.svg',
        '흐리고 비': 'rain.svg',
        '비': 'rain.svg',
        '소나기': 'shower.svg',
        '비 또는 눈': 'cloud-snow.svg',
        '눈 또는 비': 'cloud-snow.svg',
        '눈': 'snow.svg',
        '구름많고 눈': 'cloud-snow.svg',
        '구름많고 비': 'cloud-rain.svg',
        '천둥': 'thunder.svg',
        '안개': 'fog.svg'
    };
    return `/img/weather-icons/${nameMap[sky] || 'sun.svg'}`;
}

let weatherModal;
function showWeatherDetail(item) {
    const tbody = document.getElementById('weatherDetailBody');
    const summary = document.getElementById('weatherSummary');
    const title = document.getElementById('weatherModalTitle');

    if (!tbody || !summary || !title) return;
    tbody.innerHTML = '';

    const date = new Date(item.forecastDate);
    const weekday = date.toLocaleDateString('ko-KR', { weekday: 'long', month: 'long', day: 'numeric' });
    title.textContent = `📅 ${weekday} 일기예보 상세`;

    const rows = [
        ['오전', item.forecastTemperatureAmC, item.forecastSkyAm, item.forecastPrecipProbAm],
        ['오후', item.forecastTemperaturePmC, item.forecastSkyPm, item.forecastPrecipProbPm]
    ];

    rows.forEach(([time, temp, sky, rain]) => {
        const row = document.createElement('tr');
        const icon = `<img src="${getIconPath(sky)}" class="weather-icon me-2" alt="${sky}">`;
        row.innerHTML = `
            <td>${time}</td>
            <td>${temp.toFixed(1)}</td>
            <td>${icon}${sky}</td>
            <td>${rain}%</td>
        `;
        tbody.appendChild(row);
    });

    summary.textContent = `${item.forecastSkyAm === item.forecastSkyPm ? item.forecastSkyAm : `오전 ${item.forecastSkyAm} · 오후 ${item.forecastSkyPm}`} / 평균 강수확률 ${(item.forecastPrecipProbAm + item.forecastPrecipProbPm) / 2}%`;

    if (!weatherModal) {
        weatherModal = new bootstrap.Modal(document.getElementById('weatherDetailModal'));
    }
    weatherModal.show();
}
