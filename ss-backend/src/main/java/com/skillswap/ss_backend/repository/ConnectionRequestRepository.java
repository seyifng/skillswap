package com.skillswap.ss_backend.repository;

import com.skillswap.ss_backend.model.ConnectionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {
}
