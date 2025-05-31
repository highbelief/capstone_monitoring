package com.highbelief.capstone_monitoring.entity

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(
    name = "daily_weather_forecast",
    uniqueConstraints = [UniqueConstraint(columnNames = ["forecast_date"])]
)
data class DailyWeatherForecast(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "forecast_date", nullable = false)
    val forecastDate: LocalDate,

    val location: String,

    @Column(name = "forecast_temperature_am_c")
    val forecastTemperatureAmC: Float? = null,

    @Column(name = "forecast_temperature_pm_c")
    val forecastTemperaturePmC: Float? = null,

    @Column(name = "forecast_precip_prob_am")
    val forecastPrecipProbAm: Float? = null,

    @Column(name = "forecast_precip_prob_pm")
    val forecastPrecipProbPm: Float? = null,

    @Column(name = "forecast_temperature_min_c")
    val forecastTemperatureMinC: Float? = null,

    @Column(name = "forecast_temperature_max_c")
    val forecastTemperatureMaxC: Float? = null,

    @Column(name = "forecast_precip_prob")
    val forecastPrecipProb: Float? = null,

    @Column(name = "forecast_sky_am")
    val forecastSkyAm: String? = null,

    @Column(name = "forecast_sky_pm")
    val forecastSkyPm: String? = null,

    @Column(name = "created_at")
    val createdAt: LocalDateTime? = null
)
