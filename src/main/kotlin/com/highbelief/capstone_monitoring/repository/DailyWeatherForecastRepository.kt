package com.highbelief.capstone_monitoring.repository

import com.highbelief.capstone_monitoring.entity.DailyWeatherForecast
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDate

interface DailyWeatherForecastRepository : JpaRepository<DailyWeatherForecast, Long> {
    fun findByForecastDate(date: LocalDate): DailyWeatherForecast?
    fun findAllByOrderByForecastDateDesc(): List<DailyWeatherForecast>
}
