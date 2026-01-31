package com.skillswap.ss_backend.controllers;

import com.skillswap.ss_backend.model.ConnectionRequest;
import com.skillswap.ss_backend.services.impl.ConnectionRequestServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skillswap/request")
public class ConnectionRequestController {

    private final ConnectionRequestServiceImpl connectionRequestServiceImpl;

    public ConnectionRequestController(ConnectionRequestServiceImpl connectionRequestServiceImpl) {
        this.connectionRequestServiceImpl = connectionRequestServiceImpl;
    }

    @PostMapping
    public ConnectionRequest createRequest(
            @RequestParam Long requesterId,
            @RequestParam Long receiverId
    ) {
        return connectionRequestServiceImpl.createRequest(requesterId, receiverId);
    }

    @PutMapping("/{id}/accept")
    public ConnectionRequest acceptRequest(@PathVariable Long id) {
        return connectionRequestServiceImpl.acceptRequest(id);
    }

    @PutMapping("/{id}/decline")
    public ConnectionRequest declineRequest(@PathVariable Long id) {
        return connectionRequestServiceImpl.declineRequest(id);
    }

    @PutMapping("/{id}/complete")
    public ConnectionRequest completeRequest(@PathVariable Long id) {
        return connectionRequestServiceImpl.completeRequest(id);
    }

    @GetMapping("/user/{userId}")
    public List<ConnectionRequest> getRequestsForUser(@PathVariable Long userId) {
        return connectionRequestServiceImpl.getRequestsForUser(userId);
    }
}
