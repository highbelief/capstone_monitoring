package com.highbelief.capstone_monitoring.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.security.web.SecurityFilterChain

// Spring Security 설정 클래스로 등록
@Configuration
class SecurityConfig {

    // 사용자 정보를 메모리에 저장하는 UserDetailsService 빈 정의
    @Bean
    fun userDetailsService(): UserDetailsService =
        InMemoryUserDetailsManager(
            // 사용자명: admin, 비밀번호: solar2025, 권한: USER
            User.withUsername("admin")
                .password("{noop}solar2025") // {noop}은 암호를 암호화하지 않고 사용하겠다는 의미
                .roles("USER") // USER 권한 부여
                .build()
        )

    // HTTP 보안 설정을 정의하는 SecurityFilterChain 빈 정의
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain =
        http
            .authorizeHttpRequests {
                // 모든 요청은 인증 필요
                it.anyRequest().authenticated()
            }
            // 기본 인증 (브라우저 팝업 방식) 활성화
            .httpBasic()
            .and()
            // CSRF 보호 비활성화 (REST API에선 주로 비활성화)
            .csrf().disable()
            // 설정을 기반으로 SecurityFilterChain 빌드
            .build()
}

