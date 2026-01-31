package com.skillswap.ss_backend.services.impl;

import com.skillswap.ss_backend.model.Skill;
import com.skillswap.ss_backend.model.User;
import com.skillswap.ss_backend.model.UserSkill;
import com.skillswap.ss_backend.repository.SkillRepository;
import com.skillswap.ss_backend.repository.UserRepository;
import com.skillswap.ss_backend.repository.UserSkillRepository;
import com.skillswap.ss_backend.services.IUserSkillService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserSkillServiceImpl implements IUserSkillService {

    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public UserSkillServiceImpl(
            UserSkillRepository userSkillRepository,
            UserRepository userRepository,
            SkillRepository skillRepository
    ) {
        this.userSkillRepository = userSkillRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }

    @Override
    public UserSkill addSkillToUser(Long userId, Long skillId, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        UserSkill userSkill = new UserSkill();
        userSkill.setUser(user);
        userSkill.setSkill(skill);
        userSkill.setType(type);

        return userSkillRepository.save(userSkill);
    }

    @Override
    public void removeUserSkill(Long userSkillId) {
        userSkillRepository.deleteById(userSkillId);
    }

    @Override
    public List<UserSkill> getSkillsForUser(Long userId) {
        return userSkillRepository.findByUserId(userId);
    }

    @Override
    public List<UserSkill> getUserSkillsByType(Long userId, String type) {
        return userSkillRepository.findByUserIdAndType(userId, type);
    }
}
