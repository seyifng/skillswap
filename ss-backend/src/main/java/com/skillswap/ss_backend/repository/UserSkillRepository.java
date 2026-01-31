package com.skillswap.ss_backend.repository;

import com.skillswap.ss_backend.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUserIdAndType(Long userId, String type);
    List<UserSkill> findByUserId(Long userId);
    List<UserSkill> findBySkillIdInAndType(Set<Long> skillIds, String type);

}
