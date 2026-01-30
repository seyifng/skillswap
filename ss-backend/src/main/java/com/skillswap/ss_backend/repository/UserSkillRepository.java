package com.skillswap.ss_backend.repository;

import com.skillswap.ss_backend.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

}
