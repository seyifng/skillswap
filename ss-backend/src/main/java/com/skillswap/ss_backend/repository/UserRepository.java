package com.skillswap.ss_backend.repository;

import com.skillswap.ss_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
