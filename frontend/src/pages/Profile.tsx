// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { getUserById, updateUser } from "../service/userService";
import { api } from "../service/api";
import {
  getUserSkills,
  addUserSkill,
  removeUserSkill,
  type UserSkill,
  type SkillType,
} from "../service/userSkillService";
import { getAllSkills, type Skill } from "../service/skillService";

// Badge type
interface Badge {
  id: number;
  name: string;
  description: string;
}

// User profile type
interface UserProfile {
  name: string;
  bio: string;
  skills: UserSkill[];
  badges: Badge[];
  completedTasks: number;
}

export const Profile = () => {
  const defaultProfile: UserProfile = {
    name: "Alex Kim",
    bio: "Can help with math, wants guitar lessons",
    skills: [],
    badges: [
      {
        id: 1,
        name: "Spring Boot Master",
        description: "Completed first skill exchange",
      },
    ],
    completedTasks: 1,
  };

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved =
        typeof window !== "undefined" ? localStorage.getItem("profile") : null;
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);

  const [skillName, setSkillName] = useState("");
  const [skillType, setSkillType] = useState<SkillType>("OFFERED");

  // Load user data and skills
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const userId = Number(localStorage.getItem("userId") || 1);

        // Load all skills
        const skills = await getAllSkills();
        setAllSkills(skills || []);

        // Load user info
        const user = await getUserById(userId);
        if (user) {
          setProfile((prev) => ({
            ...prev,
            name: user.name || prev.name,
            bio: user.bio || prev.bio,
            completedTasks: user.completedTask ?? prev.completedTasks,
            badges: (user as any).badges || prev.badges,
          }));
        }

        // Load user skills
        const userSkills = await getUserSkills(userId);
        if (userSkills && Array.isArray(userSkills)) {
          setProfile((p) => ({ ...p, skills: userSkills }));
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  // Save profile info
  const saveProfile = async () => {
    setLoading(true);
    try {
      const userId = Number(localStorage.getItem("userId") || 1);
      await updateUser(userId, { name: profile.name, bio: profile.bio });
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setLoading(false);
    }
  };

  // Add skill
  const addSkill = async () => {
    if (!skillName.trim()) return;
    setLoading(true);

    try {
      const userId = Number(localStorage.getItem("userId") || 1);

      // Find existing skill by name (case-insensitive)
      let skill = allSkills.find(
        (s) => s.name.toLowerCase() === skillName.trim().toLowerCase(),
      );

      // If skill doesn't exist, create it
      if (!skill) {
        const newSkill = await api<Skill>("/skillswap/skills", {
          method: "POST",
          body: JSON.stringify({ name: skillName.trim() }),
        });
        if (newSkill) {
          setAllSkills((prev) => [...prev, newSkill]);
          skill = newSkill;
        } else {
          throw new Error("Failed to create skill");
        }
      }

      // Add skill to user
      const userSkill = await addUserSkill({
        userId,
        skillId: skill.id,
        type: skillType,
      });

      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, userSkill],
      }));

      setSkillName("");
    } catch (err) {
      console.error("Failed to add skill", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete skill
  const deleteSkill = async (userSkillId: number) => {
    setLoading(true);
    try {
      await removeUserSkill(userSkillId);
      setProfile((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s.id !== userSkillId),
      }));
    } catch (err) {
      console.error("Failed to delete skill", err);
    } finally {
      setLoading(false);
    }
  };

  const offeredSkills = profile.skills.filter((s) => s.type === "OFFERED");
  const wantedSkills = profile.skills.filter((s) => s.type === "WANTED");

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {/* Name & Bio */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Name</label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full border p-2 rounded mb-3"
        />

        <label className="block font-semibold mb-1">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <div className="mt-3">
          <button
            onClick={saveProfile}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>

      {/* Add Skills */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Add Skill</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Skill name"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <select
            value={skillType}
            onChange={(e) => setSkillType(e.target.value as SkillType)}
            className="border p-2 rounded"
          >
            <option value="OFFERED">Offer</option>
            <option value="WANTED">Want</option>
          </select>
          <button
            onClick={addSkill}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Offered Skills */}
        <div className="mb-2">
          <p className="font-semibold">Offered Skills:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {offeredSkills.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <span className="bg-blue-200 px-2 py-1 rounded">
                  {s.skill.name}
                </span>
                <button
                  onClick={() => deleteSkill(s.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  disabled={loading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Wanted Skills */}
        <div>
          <p className="font-semibold">Wanted Skills:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {wantedSkills.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <span className="bg-yellow-200 px-2 py-1 rounded">
                  {s.skill.name}
                </span>
                <button
                  onClick={() => deleteSkill(s.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  disabled={loading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Trust Score</h2>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded text-white
      ${
        profile.completedTasks === 0
          ? "bg-gray-400"
          : profile.completedTasks <= 2
            ? "bg-orange-600"
            : profile.completedTasks <= 5
              ? "bg-gray-300 text-black"
              : "bg-yellow-500 text-black"
      }`}
        >
          🏅 {profile.completedTasks}
        </div>
      </div>
    </div>
  );
};
