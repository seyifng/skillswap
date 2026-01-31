package com.skillswap.ss_backend.controllers;

import com.skillswap.ss_backend.model.User;
import com.skillswap.ss_backend.services.impl.MatchServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skillswap/match")
public class MatchController {

    private final MatchServiceImpl matchServiceImpl;

    public MatchController(MatchServiceImpl matchServiceImpl) {
        this.matchServiceImpl = matchServiceImpl;
    }

    @GetMapping("/{userId}")
    public List<User> getMatches(@PathVariable Long userId) {
        return matchServiceImpl.findMatchesForUser(userId);
    }
}
