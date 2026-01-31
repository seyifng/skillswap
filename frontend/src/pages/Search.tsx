import { useState, useEffect } from "react";
import { getAllSkills, type Skill } from "../service/skillService";
import { getAllUsers, type User } from "../service/userService";
import { getUserSkills, type UserSkill } from "../service/userSkillService";
import {
  sendConnectionRequest,
  getRequestsForUser,
} from "../service/connectionRequestService";

const Search = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<
    Array<{ user: User; matchingSkills: UserSkill[] }>
  >([]);

  const [requestMap, setRequestMap] = useState<
    Record<number, "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED">
  >({});

  const USER_ID = Number(localStorage.getItem("userId") || 1);

  const fetchRequests = async () => {
    try {
      const reqs = await getRequestsForUser(USER_ID);
      const map: Record<number, (typeof requestMap)[number]> = {};
      const statusCodeMap: Record<number, (typeof requestMap)[number]> = {
        5: "PENDING",
        4: "ACCEPTED",
        3: "REJECTED",
        2: "COMPLETED",
      };

      reqs.forEach((r) => {
        const otherId = r.senderId === USER_ID ? r.receiverId : r.senderId;
        let status: any = r.status;
        if (typeof status === "number")
          status = statusCodeMap[status] || "PENDING";
        else status = (status || "").toString().toUpperCase();
        map[otherId] = status as (typeof requestMap)[number];
      });

      setRequestMap(map);
    } catch (e) {
      console.error("Failed to load requests", e);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleConnect = async (receiverId: number) => {
    try {
      await sendConnectionRequest(USER_ID, receiverId);
      await fetchRequests();
    } catch (e) {
      console.error("Failed to send request", e);
    }
  };

  const doSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // 1. find matching skill ids (case-insensitive, partial)
      const allSkills = await getAllSkills();
      const matchedSkills: Skill[] = allSkills.filter((s) =>
        s.name.toLowerCase().includes(query.trim().toLowerCase()),
      );
      if (matchedSkills.length === 0) {
        setResults([]);
        return;
      }

      const skillIds = new Set(matchedSkills.map((s) => s.id));

      // 2. get all users and check their offered skills
      const users = await getAllUsers();

      const checks = await Promise.all(
        users.map(async (u) => {
          const skills = await getUserSkills(u.id);
          const offered = skills.filter((s) => s.type === "OFFERED");
          const matching = offered.filter((s) => skillIds.has(s.skill.id));
          return matching.length ? { user: u, matchingSkills: matching } : null;
        }),
      );

      setResults(
        checks.filter(Boolean) as Array<{
          user: User;
          matchingSkills: UserSkill[];
        }>,
      );
    } catch (e) {
      console.error(e);
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Search by Skill</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Skill name (e.g. Cooking)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={doSearch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error ? <p className="text-red-500">{error}</p> : null}

      <div className="space-y-4">
        {results.length === 0 && !loading ? (
          <p className="text-gray-500">No matches yet. Try another skill.</p>
        ) : null}

        {results.map(({ user, matchingSkills }) => {
          const status = requestMap[user.id];
          return (
            <div key={user.id} className="border rounded p-4">
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{user.bio}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {matchingSkills.map((ms) => (
                  <span
                    key={ms.id}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {ms.skill.name}
                  </span>
                ))}
              </div>

              <div>
                {status === "PENDING" ? (
                  <span className="text-gray-600 font-semibold px-3 py-1 rounded border">
                    Pending
                  </span>
                ) : status === "ACCEPTED" ? (
                  <span className="text-green-600 font-semibold px-3 py-1 rounded border">
                    Accepted
                  </span>
                ) : (
                  <button
                    onClick={() => handleConnect(user.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Request
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Search;
