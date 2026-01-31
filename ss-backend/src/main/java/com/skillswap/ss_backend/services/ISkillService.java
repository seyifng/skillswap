package com.skillswap.ss_backend.services;

import com.skillswap.ss_backend.model.Skill;

import java.util.List;

public interface ISkillService {

    Skill createSkill(Skill skill);

    List<Skill> getAllSkills();
}
