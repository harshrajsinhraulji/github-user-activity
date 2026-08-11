import { kv } from "@vercel/kv";
const key = "story-votes";
export default async function handler(req, res) {
  const votes = await kv.get(key) || {};
  if (req.method === "GET") return res.status(200).json(votes);
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const story = String(req.body?.story || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(story)) return res.status(400).json({ error: "Invalid story." });
  votes[story] = (Number(votes[story]) || 0) + 1;
  await kv.set(key, votes);
  return res.status(200).json(votes);
}