import { api } from "./api";

export interface Skill {
  id: number;
  name: string;
}

export const getAllSkills = (): Promise<Skill[]> =>
  api<Skill[]>("/skillswap/skills");
