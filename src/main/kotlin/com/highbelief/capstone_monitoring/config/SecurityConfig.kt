package com.highbelief.capstone_monitoring.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.security.web.SecurityFilterChain

@Configuration
class SecurityConfig {
    @Bean
    fun userDetailsService(): UserDetailsService =
        InMemoryUserDetailsManager(
            User.withUsername("admin")
                .password("{noop}solar2025")
                .roles("USER")
                .build()
        )

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain =
        http
            .authorizeHttpRequests { it.anyRequest().authenticated() }
            .httpBasic()
            .and()
            .csrf().disable()
            .build()
}
