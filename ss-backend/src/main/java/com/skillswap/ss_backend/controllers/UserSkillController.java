package com.skillswap.ss_backend.controllers;

import com.skillswap.ss_backend.model.UserSkill;
import com.skillswap.ss_backend.services.impl.UserSkillServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skillswap/user-skill")
public class UserSkillController {

    private final UserSkillServiceImpl userSkillServiceImpl;

    public UserSkillController(UserSkillServiceImpl userSkillServiceImpl) {
        this.userSkillServiceImpl = userSkillServiceImpl;
    }

    @PostMapping
    public UserSkill addSkillToUser(
            @RequestParam Long userId,
            @RequestParam Long skillId,
            @RequestParam String type
    ) {
        return userSkillServiceImpl.addSkillToUser(userId, skillId, type);
    }

    @DeleteMapping("/{id}")
    public void removeUserSkill(@PathVariable Long id) {
        userSkillServiceImpl.removeUserSkill(id);
    }

    @GetMapping("/user/{userId}")
    public List<UserSkill> getSkillsForUser(@PathVariable Long userId) {
        return userSkillServiceImpl.getSkillsForUser(userId);
    }
}
