package com.highbelief.capstone_monitoring.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "measurement")
data class Measurement(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "measured_at")
    val measuredAt: LocalDateTime,

    @Column(name = "power_mw")
    val powerMw: Float?,

    @Column(name = "cumulative_mwh")
    val cumulativeMwh: Float?,

    @Column(name = "irradiance_wm2")
    val irradianceWm2: Float?,

    @Column(name = "temperature_c")
    val temperatureC: Float?,

    @Column(name = "wind_speed_ms")
    val windSpeedMs: Float?,

    @Column(name = "forecast_irradiance_wm2")
    val forecastIrradianceWm2: Float?,

    @Column(name = "forecast_temperature_c")
    val forecastTemperatureC: Float?,

    @Column(name = "forecast_wind_speed_ms")
    val forecastWindSpeedMs: Float?,

    @Column(name = "created_at", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    val createdAt: LocalDateTime? = null
)
