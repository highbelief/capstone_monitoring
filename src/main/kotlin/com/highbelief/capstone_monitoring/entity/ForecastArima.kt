package com.highbelief.capstone_monitoring.entity

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "forecast_arima")
data class ForecastArima(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val forecastDate: LocalDate,
    val predictedMwh: Float,
    val actualMwh: Float?,
    val rmse: Float?,
    val mae: Float?,
    val mape: Float?,
    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    val createdAt: LocalDateTime? = null
)
