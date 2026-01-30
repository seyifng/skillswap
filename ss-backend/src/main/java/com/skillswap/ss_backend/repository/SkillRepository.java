package com.skillswap.ss_backend.repository;

import com.skillswap.ss_backend.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
}
