// MeasurementRepository.kt
package com.highbelief.capstone_monitoring.repository

import com.highbelief.capstone_monitoring.entity.Measurement
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.LocalDateTime

interface MeasurementRepository : JpaRepository<Measurement, Long> {
    fun findByMeasuredAtBetween(start: LocalDateTime, end: LocalDateTime): List<Measurement>

    @Query(
        value = """
        SELECT DATE_FORMAT(measured_at, :format) AS period,
               SUM(cumulative_mwh) AS totalMwh,
               AVG(irradiance_wm2) AS avgIrradiance,
               AVG(temperature_c) AS avgTemperature
        FROM measurement
        WHERE measured_at BETWEEN :start AND :end
        GROUP BY period
        ORDER BY period
        """,
        nativeQuery = true
    )
    fun getSummaryByPeriod(
        @Param("start") start: LocalDateTime,
        @Param("end") end: LocalDateTime,
        @Param("format") format: String
    ): List<Array<Any>>
}
