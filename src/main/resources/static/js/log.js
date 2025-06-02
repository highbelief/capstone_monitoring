// log.js - HelioCast 로그 페이지 스크립트

window.addEventListener('DOMContentLoaded', () => {
    setupRealtimeClock();
    setupLogoutButton();
    setupNavigation();
    setupLogTabs();
});

function setupRealtimeClock() {
    const clock = document.getElementById('clockDisplay');
    setInterval(() => {
        const now = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        clock.textContent = now.toLocaleString('ko-KR', options);
    }, 1000);
}

function setupLogoutButton() {
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('auth');
        window.location.href = '/login.html';
    });
}

function setupNavigation() {
    document.getElementById('toDashboard')?.addEventListener('click', () => location.href = 'dashboard.html');
    document.getElementById('toLogs')?.addEventListener('click', () => location.href = 'log.html');
}

function setupLogTabs() {
    document.querySelectorAll('.log-range-form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const type = form.dataset.type;
            const start = form.querySelector('.start-date').value;
            const end = form.querySelector('.end-date').value;
            if (start && end) fetchLogData(type, start, end);
        });
    });
}

function fetchLogData(type, start, end) {
    let url = '', parser;
    switch (type) {
        case 'weather':
            url = `/api/forecast/daily?start=${start}&end=${end}`;
            parser = renderWeatherLogs;
            break;
        case 'measurement':
            url = `/api/measurements?start=${start}T00:00:00&end=${end}T23:59:59`;
            parser = renderMeasurementLogs;
            break;
        case 'arima':
            url = `/api/forecast/arima?start=${start}&end=${end}`;
            parser = renderArimaLogs;
            break;
        case 'sarima':
            url = `/api/forecast/sarima?start=${start}&end=${end}`;
            parser = renderSarimaLogs;
            break;
    }
    fetch(url)
        .then(res => res.json())
        .then(data => parser(data))
        .catch(err => console.error(`${type} 로그 불러오기 실패`, err));
}

function renderWeatherLogs(data) {
    const tbody = document.getElementById('weatherLogBody');
    tbody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.forecastDate}</td>
            <td>${row.forecastSkyAm ?? '-'}</td>
            <td>${row.forecastSkyPm ?? '-'}</td>
            <td>${row.forecastPrecipProbAm ?? '-'}%</td>
            <td>${row.forecastPrecipProbPm ?? '-'}%</td>
            <td>${row.forecastTemperatureAmC?.toFixed(1) ?? '-'}</td>
            <td>${row.forecastTemperaturePmC?.toFixed(1) ?? '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderMeasurementLogs(data) {
    const tbody = document.getElementById('measurementLogBody');
    tbody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.measuredAt}</td>
            <td>${row.powerMw}</td>
            <td>${row.cumulative_mwh}</td>
            <td>${row.irradianceWm2}</td>
            <td>${row.temperatureC}</td>
            <td>${row.windSpeedMs}</td>
            <td>${row.forecastIrradianceWm2}</td>
            <td>${row.forecastTemperatureC}</td>
            <td>${row.forecastWindSpeedMs}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderArimaLogs(data) {
    const tbody = document.getElementById('arimaLogBody');
    tbody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.forecastDate}</td>
            <td>${row.predictedMwh.toFixed(2)}</td>
            <td>${row.actualMwh != null ? row.actualMwh.toFixed(2) : '-'}</td>
            <td>${row.rmse ?? '-'}</td>
            <td>${row.mae ?? '-'}</td>
            <td>${row.mape ?? '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderSarimaLogs(data) {
    const tbody = document.getElementById('sarimaLogBody');
    tbody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.forecastStart} ~ ${row.forecastEnd}</td>
            <td>${row.predictedMwh.toFixed(2)}</td>
            <td>${row.actualMwh != null ? row.actualMwh.toFixed(2) : '-'}</td>
            <td>${row.rmse ?? '-'}</td>
            <td>${row.mae ?? '-'}</td>
            <td>${row.mape ?? '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}
