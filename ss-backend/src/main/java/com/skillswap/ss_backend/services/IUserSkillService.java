package com.skillswap.ss_backend.services;

import com.skillswap.ss_backend.model.UserSkill;

import java.util.List;

public interface IUserSkillService {

    UserSkill addSkillToUser(Long userId, Long skillId, String type);

    void removeUserSkill(Long userSkillId);

    List<UserSkill> getSkillsForUser(Long userId);

    List<UserSkill> getUserSkillsByType(Long userId, String type);
}
