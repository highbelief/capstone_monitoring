package com.highbelief.capstone_monitoring.controller

import com.highbelief.capstone_monitoring.dto.MeasurementSummaryDTO
import com.highbelief.capstone_monitoring.entity.Measurement
import com.highbelief.capstone_monitoring.service.MeasurementService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/measurements")
class MeasurementController(
    private val service: MeasurementService
) {
    @GetMapping
    fun getMeasurements(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) start: LocalDateTime,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) end: LocalDateTime
    ): List<Measurement> = service.getMeasurements(start, end)

    @GetMapping("/summary")
    fun getSummary(
        @RequestParam type: String,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate
    ): List<MeasurementSummaryDTO> = service.getSummary(type, date)
}
