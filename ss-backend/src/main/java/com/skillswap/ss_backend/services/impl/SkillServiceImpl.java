package com.skillswap.ss_backend.services.impl;

import com.skillswap.ss_backend.model.Skill;
import com.skillswap.ss_backend.repository.SkillRepository;
import com.skillswap.ss_backend.services.ISkillService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillServiceImpl implements ISkillService {

    private final SkillRepository skillRepository;

    public SkillServiceImpl(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Override
    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    @Override
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }
}
