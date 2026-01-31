package com.skillswap.ss_backend.services.impl;

import com.skillswap.ss_backend.model.User;
import com.skillswap.ss_backend.model.UserSkill;
import com.skillswap.ss_backend.repository.UserSkillRepository;
import com.skillswap.ss_backend.services.IMatchService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchServiceImpl implements IMatchService {

    private final UserSkillRepository userSkillRepository;

    public MatchServiceImpl(UserSkillRepository userSkillRepository) {
        this.userSkillRepository = userSkillRepository;
    }

    @Override
    public List<User> findMatchesForUser(Long userId) {

        // Step 1: user's WANTED skills
        List<UserSkill> wantedSkills =
                userSkillRepository.findByUserIdAndType(userId, "WANTED");

        Set<Long> wantedSkillIds = wantedSkills.stream()
                .map(us -> us.getSkill().getId())
                .collect(Collectors.toSet());

        // Step 2: other users who OFFER those skills
        List<UserSkill> offeredMatches =
                userSkillRepository.findBySkillIdInAndType(wantedSkillIds, "OFFERED");

        // Step 3 + 4: exclude self, group by user
        return offeredMatches.stream()
                .map(UserSkill::getUser)
                .filter(user -> !user.getId().equals(userId))
                .distinct()
                .collect(Collectors.toList());
    }
}
