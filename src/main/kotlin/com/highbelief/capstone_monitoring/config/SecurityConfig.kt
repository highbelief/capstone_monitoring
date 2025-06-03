package com.highbelief.capstone_monitoring.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.security.web.SecurityFilterChain

// Spring Security 설정 클래스로 등록
@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .authorizeHttpRequests {
                it
                    .requestMatchers("/login.html", "/css/**", "/js/**").permitAll()
                    .anyRequest().authenticated()
            }
            .formLogin {
                it.loginPage("/login.html")
                    .loginProcessingUrl("/login")
                    .defaultSuccessUrl("/index.html", true)  // <-- 여기만 수정
                    .permitAll()
            }
            .logout {
                it.logoutUrl("/logout")
                    .logoutSuccessUrl("/login.html")
            }

        return http.build()
    }

    @Bean
    fun userDetailsService(): UserDetailsService {
        val user = User.withUsername("admin")
            .password("{noop}solar2025")  // {noop}은 비암호화 저장 방식
            .roles("USER")
            .build()
        return InMemoryUserDetailsManager(user)
    }
}
