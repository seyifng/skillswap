package com.skillswap.ss_backend.services;

import com.skillswap.ss_backend.model.User;

import java.util.List;

public interface IUserService {

    User createUser(User user);

    User getUserById(Long id);

    List<User> getAllUsers();

    User updateUser(Long id, User updatedUser);
}
