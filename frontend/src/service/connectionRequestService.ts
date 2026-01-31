import { api } from "./api";

export interface ConnectionRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

// Backend expects query params, not JSON body
export const sendConnectionRequest = (
  senderId: number,
  receiverId: number,
): Promise<ConnectionRequest> =>
  api<ConnectionRequest>(
    `/skillswap/request?requesterId=${senderId}&receiverId=${receiverId}`,
    { method: "POST" },
  );

export const getRequestsForUser = (
  userId: number,
): Promise<ConnectionRequest[]> =>
  api<ConnectionRequest[]>(`/skillswap/request/user/${userId}`);

// Optional: accept/decline/complete requests
export const acceptRequest = (id: number): Promise<ConnectionRequest> =>
  api<ConnectionRequest>(`/skillswap/request/${id}/accept`, { method: "PUT" });

export const declineRequest = (id: number): Promise<ConnectionRequest> =>
  api<ConnectionRequest>(`/skillswap/request/${id}/decline`, { method: "PUT" });

export const completeRequest = (id: number): Promise<ConnectionRequest> =>
  api<ConnectionRequest>(`/skillswap/request/${id}/complete`, {
    method: "PUT",
  });
