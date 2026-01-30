package com.skillswap.ss_backend.controllers;

import com.skillswap.ss_backend.model.User;
import com.skillswap.ss_backend.services.impl.UserServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skillswap")
public class SkillSwapController {

    private final UserServiceImpl userServiceImpl;

    public SkillSwapController(UserServiceImpl userServiceImpl) {
        this.userServiceImpl = userServiceImpl;
    }

    @PostMapping("/user")
    public User createUser(@RequestBody User user) {
        return userServiceImpl.createUser(user);
    }

    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable Long id) {
        return userServiceImpl.getUserById(id);
    }

    @GetMapping("/user")
    public List<User> getAllUsers() {
        return userServiceImpl.getAllUsers();
    }

    @PutMapping("/user/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userServiceImpl.updateUser(id, user);
    }
}
