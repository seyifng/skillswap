package com.skillswap.ss_backend.services;

import com.skillswap.ss_backend.model.ConnectionRequest;

import java.util.List;

public interface IConnectionRequestService {

    ConnectionRequest createRequest(Long requesterId, Long receiverId);

    ConnectionRequest acceptRequest(Long requestId);

    ConnectionRequest declineRequest(Long requestId);

    ConnectionRequest completeRequest(Long requestId);

    List<ConnectionRequest> getRequestsForUser(Long userId);
}
