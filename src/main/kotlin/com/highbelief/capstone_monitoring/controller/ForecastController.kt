package com.highbelief.capstone_monitoring.controller

import com.highbelief.capstone_monitoring.entity.ForecastArima
import com.highbelief.capstone_monitoring.entity.ForecastSarima
import com.highbelief.capstone_monitoring.service.ForecastService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping("/api/forecast")
class ForecastController(
    private val service: ForecastService
) {
    @GetMapping("/arima")
    fun getArimaForecasts(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) start: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) end: LocalDate
    ): List<ForecastArima> = service.getArimaForecasts(start, end)

    @GetMapping("/sarima")
    fun getSarimaForecasts(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) start: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) end: LocalDate
    ): List<ForecastSarima> = service.getSarimaForecasts(start, end)
}
