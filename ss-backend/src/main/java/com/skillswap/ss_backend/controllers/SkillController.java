package com.skillswap.ss_backend.controllers;

import com.skillswap.ss_backend.model.Skill;
import com.skillswap.ss_backend.services.impl.SkillServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/skillswap/skills")
public class SkillController {

    private final SkillServiceImpl skillServiceImpl;

    public SkillController(SkillServiceImpl skillServiceImpl) {
        this.skillServiceImpl = skillServiceImpl;
    }

    @PostMapping
    public Skill createSkill(@RequestBody Skill skill) {
        return skillServiceImpl.createSkill(skill);
    }

    @GetMapping
    public List<Skill> getAllSkills() {
        return skillServiceImpl.getAllSkills();
    }
}
