package com.skillswap.ss_backend.services.impl;

import com.skillswap.ss_backend.model.User;
import com.skillswap.ss_backend.repository.UserRepository;
import com.skillswap.ss_backend.services.IUserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        User existing = getUserById(id);

        existing.setName(updatedUser.getName());
        existing.setBio(updatedUser.getBio());
        existing.setEmail(updatedUser.getEmail());

        return userRepository.save(existing);
    }
}
