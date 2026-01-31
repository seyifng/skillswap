import { useEffect, useState } from "react";
import { getMatchesForUser, type Match } from "../service/matchService";
import { getUserSkills, type UserSkill } from "../service/userSkillService";
import {
  sendConnectionRequest,
  getRequestsForUser,
  acceptRequest,
  declineRequest,
  type ConnectionRequest,
} from "../service/connectionRequestService";

const USER_ID = 1; // hardcoded MVP user

interface MatchWithSkills extends Match {
  offeredSkills?: UserSkill[];
  wantedSkills?: UserSkill[];
}

export const Home = () => {
  const [matches, setMatches] = useState<MatchWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sentRequests, setSentRequests] = useState<number[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>(
    [],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const matchesData = await getMatchesForUser(USER_ID);

        const matchesWithSkills: MatchWithSkills[] = await Promise.all(
          matchesData.map(async (match) => {
            const skills = await getUserSkills(match.id);
            return {
              ...match,
              offeredSkills: skills.filter((s) => s.type === "OFFERED"),
              wantedSkills: skills.filter((s) => s.type === "WANTED"),
            };
          }),
        );

        setMatches(matchesWithSkills);

        const requests = await getRequestsForUser(USER_ID);
        setSentRequests(
          requests
            .filter((r) => r.senderId === USER_ID)
            .map((r) => r.receiverId),
        );
        setIncomingRequests(
          requests.filter(
            (r) => r.receiverId === USER_ID && r.status === "PENDING",
          ),
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load matches or requests");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleConnect = async (receiverId: number) => {
    try {
      const request = await sendConnectionRequest(USER_ID, receiverId);
      setSentRequests((prev) => [...prev, receiverId]);
      console.log("Request sent:", request);
    } catch (err) {
      console.error("Failed to send request", err);
    }
  };

  const handleAccept = async (requestId: number) => {
    try {
      await acceptRequest(requestId);
      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Failed to accept request", err);
    }
  };

  const handleDecline = async (requestId: number) => {
    try {
      await declineRequest(requestId);
      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Failed to decline request", err);
    }
  };

  if (loading) return <p className="p-6">Loading matches...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Matches</h1>

      {matches.length === 0 ? (
        <p className="text-gray-500">No matches yet. Add more skills!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((match) => {
            const sent = sentRequests.includes(match.id);
            const incomingRequest = incomingRequests.find(
              (r) => r.senderId === match.id,
            );
            const pending = sent && !incomingRequest; // sent by current user and still pending

            return (
              <div
                key={match.id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition relative"
              >
                <h2 className="text-xl font-semibold">{match.name}</h2>
                <p className="text-gray-600 mt-1">
                  {match.bio || "No bio available"}
                </p>

                {match.offeredSkills?.length ? (
                  <div className="mt-2">
                    <p className="text-sm font-semibold">Offered:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {match.offeredSkills.map((s) => (
                        <span
                          key={s.skill.id}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                        >
                          {s.skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {match.wantedSkills?.length ? (
                  <div className="mt-2">
                    <p className="text-sm font-semibold">Wants:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {match.wantedSkills.map((s) => (
                        <span
                          key={s.skill.id}
                          className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm"
                        >
                          {s.skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Buttons */}
                <div className="mt-3 flex gap-2 items-center">
                  {incomingRequest ? (
                    <>
                      <button
                        onClick={() => handleAccept(incomingRequest.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(incomingRequest.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect(match.id)}
                      disabled={sent}
                      className={`px-3 py-1 rounded text-white transition ${
                        sent
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {pending
                        ? "Pending..."
                        : sent
                          ? "Request Sent"
                          : "Connect"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
