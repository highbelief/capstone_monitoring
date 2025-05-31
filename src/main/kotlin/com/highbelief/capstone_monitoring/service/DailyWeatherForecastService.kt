package com.highbelief.capstone_monitoring.service

import com.highbelief.capstone_monitoring.entity.DailyWeatherForecast
import com.highbelief.capstone_monitoring.repository.DailyWeatherForecastRepository
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class DailyWeatherForecastService(
    private val repository: DailyWeatherForecastRepository
) {
    fun getAllForecasts(): List<DailyWeatherForecast> =
        repository.findAllByOrderByForecastDateDesc()

    fun getForecastByDate(date: LocalDate): DailyWeatherForecast? =
        repository.findByForecastDate(date)
}
