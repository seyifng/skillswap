import { api } from "./api";

export type SkillType = "OFFERED" | "WANTED";

export interface UserSkill {
  id: number;
  skill: {
    id: number;
    name: string;
  };
  type: SkillType;
}

export interface AddUserSkillRequest {
  userId: number;
  skillId: number; // pass existing skill id
  type: SkillType;
}

// Get all skills for a user
export const getUserSkills = (userId: number): Promise<UserSkill[]> =>
  api<UserSkill[]>(`/skillswap/user-skill/user/${userId}`);

// Add a skill to a user (backend expects query params)
export const addUserSkill = (data: AddUserSkillRequest): Promise<UserSkill> =>
  api<UserSkill>(
    `/skillswap/user-skill?userId=${data.userId}&skillId=${data.skillId}&type=${data.type}`,
    { method: "POST" },
  );

// Optional: delete user skill
export const removeUserSkill = (userSkillId: number): Promise<void> =>
  api<void>(`/skillswap/user-skill/${userSkillId}`, { method: "DELETE" });
