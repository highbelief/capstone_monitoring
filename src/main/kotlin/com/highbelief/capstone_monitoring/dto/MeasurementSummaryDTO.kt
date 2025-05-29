package com.highbelief.capstone_monitoring.dto

data class MeasurementSummaryDTO(
    val period: String,
    val totalMwh: Double,
    val avgIrradiance: Double,
    val avgTemperature: Double
)