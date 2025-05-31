package com.highbelief.capstone_monitoring.controller

import com.highbelief.capstone_monitoring.entity.DailyWeatherForecast
import com.highbelief.capstone_monitoring.service.DailyWeatherForecastService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping("/api/forecast")
class DailyWeatherForecastController(
    private val service: DailyWeatherForecastService
) {

    @GetMapping
    fun getAllForecasts(): ResponseEntity<List<DailyWeatherForecast>> =
        ResponseEntity.ok(service.getAllForecasts())

    @GetMapping("/{date}")
    fun getForecastByDate(
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate
    ): ResponseEntity<DailyWeatherForecast> {
        val forecast = service.getForecastByDate(date)
        return if (forecast != null) ResponseEntity.ok(forecast)
        else ResponseEntity.notFound().build()
    }
}
