package com.skillswap.ss_backend.services.impl;

import com.skillswap.ss_backend.model.ConnectionRequest;
import com.skillswap.ss_backend.model.User;
import com.skillswap.ss_backend.repository.ConnectionRequestRepository;
import com.skillswap.ss_backend.repository.UserRepository;
import com.skillswap.ss_backend.services.IConnectionRequestService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConnectionRequestServiceImpl implements IConnectionRequestService {

    private final ConnectionRequestRepository connectionRequestRepository;
    private final UserRepository userRepository;

    public ConnectionRequestServiceImpl(
            ConnectionRequestRepository connectionRequestRepository,
            UserRepository userRepository
    ) {
        this.connectionRequestRepository = connectionRequestRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ConnectionRequest createRequest(Long requesterId, Long receiverId) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Requester not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        ConnectionRequest request = new ConnectionRequest();
        request.setRequester(requester);
        request.setReceiver(receiver);
        request.setStatus("PENDING");

        return connectionRequestRepository.save(request);
    }

    @Override
    public ConnectionRequest acceptRequest(Long requestId) {
        ConnectionRequest request = getById(requestId);
        request.setStatus("ACCEPTED");
        return connectionRequestRepository.save(request);
    }

    @Override
    public ConnectionRequest declineRequest(Long requestId) {
        ConnectionRequest request = getById(requestId);
        request.setStatus("DECLINED");
        return connectionRequestRepository.save(request);
    }

    @Override
    public ConnectionRequest completeRequest(Long requestId) {
        ConnectionRequest request = getById(requestId);
        request.setStatus("COMPLETED");

        User requester = request.getRequester();
        requester.setCompletedTask(requester.getCompletedTask() + 1);
        userRepository.save(requester);

        return connectionRequestRepository.save(request);
    }

    @Override
    public List<ConnectionRequest> getRequestsForUser(Long userId) {
        return connectionRequestRepository.findByRequesterIdOrReceiverId(userId, userId);
    }

    private ConnectionRequest getById(Long id) {
        return connectionRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }
}
