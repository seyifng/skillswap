package com.skillswap.ss_backend.services;

import com.skillswap.ss_backend.model.User;

import java.util.List;

public interface IMatchService {

    List<User> findMatchesForUser(Long userId);
}
