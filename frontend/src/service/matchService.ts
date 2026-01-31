import { api } from "./api";

export interface Match {
  id: number;
  name: string;
  bio: string;
  matchingSkills: string[];
}

export const getMatchesForUser = (userId: number): Promise<Match[]> =>
  api<Match[]>(`/skillswap/match/${userId}`);
