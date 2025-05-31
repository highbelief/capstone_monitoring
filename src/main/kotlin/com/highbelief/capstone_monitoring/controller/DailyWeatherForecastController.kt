package com.highbelief.capstone_monitoring.controller

import com.highbelief.capstone_monitoring.entity.DailyWeatherForecast
import com.highbelief.capstone_monitoring.service.DailyWeatherForecastService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController // JSON 형태의 응답을 리턴하는 REST API 컨트롤러임을 선언
@RequestMapping("/api/forecast") // 이 컨트롤러의 공통 URL 경로를 지정

class DailyWeatherForecastController(
    private val service: DailyWeatherForecastService // 서비스 의존성 주입
) {

    @GetMapping // HTTP GET 요청 처리: /api/forecast
    fun getAllForecasts(): ResponseEntity<List<DailyWeatherForecast>> =
        // 전체 예보 데이터를 가져와 HTTP 200 OK와 함께 반환
        ResponseEntity.ok(service.getAllForecasts())

    @GetMapping("/{date}") // HTTP GET 요청 처리: /api/forecast/{date}
    fun getForecastByDate(
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate // 경로 변수로 날짜 받기
    ): ResponseEntity<DailyWeatherForecast> {
        val forecast = service.getForecastByDate(date)
        return if (forecast != null)
            ResponseEntity.ok(forecast) // 예보가 존재하면 200 OK 반환
        else
            ResponseEntity.notFound().build() // 없으면 404 Not Found 반환
    }
}
