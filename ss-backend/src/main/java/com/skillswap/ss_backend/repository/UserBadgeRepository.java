package com.skillswap.ss_backend.repository;

import com.skillswap.ss_backend.model.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
}
