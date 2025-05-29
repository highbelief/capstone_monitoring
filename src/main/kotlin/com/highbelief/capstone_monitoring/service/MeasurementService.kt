package com.highbelief.capstone_monitoring.service

import com.highbelief.capstone_monitoring.dto.MeasurementSummaryDTO
import com.highbelief.capstone_monitoring.entity.Measurement
import com.highbelief.capstone_monitoring.repository.MeasurementRepository
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class MeasurementService(
    private val repo: MeasurementRepository
) {
    fun getMeasurements(start: LocalDateTime, end: LocalDateTime): List<Measurement> =
        repo.findByMeasuredAtBetween(start, end)

    fun getSummary(type: String, date: LocalDate): List<MeasurementSummaryDTO> {
        val format = when (type) {
            "daily" -> "%Y-%m-%d"
            "monthly" -> "%Y-%m"
            "yearly" -> "%Y"
            else -> throw IllegalArgumentException("Invalid summary type")
        }
        val start = when (type) {
            "daily" -> date.atStartOfDay()
            "monthly" -> date.withDayOfMonth(1).atStartOfDay()
            "yearly" -> date.withDayOfYear(1).atStartOfDay()
            else -> throw IllegalArgumentException("Invalid type")
        }
        val end = when (type) {
            "daily" -> start.plusDays(1)
            "monthly" -> start.plusMonths(1)
            "yearly" -> start.plusYears(1)
            else -> throw IllegalArgumentException("Invalid type")
        }
        return repo.getSummaryByPeriod(start, end, format).map {
            val period = it[0] as String
            val total = (it[1] as? Number)?.toDouble() ?: 0.0
            val irr = (it[2] as? Number)?.toDouble() ?: 0.0
            val temp = (it[3] as? Number)?.toDouble() ?: 0.0
            MeasurementSummaryDTO(period, total, irr, temp)
        }
    }
}