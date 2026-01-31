const BASE_URL = "http://localhost:8080/api";

export async function api<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "API error");
  }

  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as unknown as T);
}
