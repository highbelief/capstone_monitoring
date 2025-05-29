package com.highbelief.capstone_monitoring.repository

import com.highbelief.capstone_monitoring.entity.ForecastArima
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDate

interface ForecastArimaRepository : JpaRepository<ForecastArima, Long> {
    fun findByForecastDateBetween(start: LocalDate, end: LocalDate): List<ForecastArima>
}