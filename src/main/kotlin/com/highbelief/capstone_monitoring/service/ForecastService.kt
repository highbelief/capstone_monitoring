package com.highbelief.capstone_monitoring.service

import com.highbelief.capstone_monitoring.entity.ForecastArima
import com.highbelief.capstone_monitoring.entity.ForecastSarima
import com.highbelief.capstone_monitoring.repository.ForecastArimaRepository
import com.highbelief.capstone_monitoring.repository.ForecastSarimaRepository
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class ForecastService(
    private val arimaRepo: ForecastArimaRepository,
    private val sarimaRepo: ForecastSarimaRepository
) {
    fun getArimaForecasts(start: LocalDate, end: LocalDate): List<ForecastArima> =
        arimaRepo.findByForecastDateBetween(start, end)

    fun getSarimaForecasts(start: LocalDate, end: LocalDate): List<ForecastSarima> =
        sarimaRepo.findByForecastStartGreaterThanEqualAndForecastEndLessThanEqual(start, end)
}