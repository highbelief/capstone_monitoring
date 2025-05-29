package com.highbelief.capstone_monitoring.repository

import com.highbelief.capstone_monitoring.entity.ForecastSarima
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDate

interface ForecastSarimaRepository : JpaRepository<ForecastSarima, Long> {
    fun findByForecastStartGreaterThanEqualAndForecastEndLessThanEqual(start: LocalDate, end: LocalDate): List<ForecastSarima>
}