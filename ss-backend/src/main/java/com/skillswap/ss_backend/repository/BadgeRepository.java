package com.skillswap.ss_backend.repository;

import com.skillswap.ss_backend.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BadgeRepository extends JpaRepository<Badge, Long> {
}
