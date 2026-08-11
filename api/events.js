import { kv } from "@vercel/kv";
const key = "community-events";
const safe = value => String(value || "").trim().slice(0, 280);
export default async function handler(req, res) {
  if (req.method === "GET") return res.status(200).json(await kv.get(key) || []);
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const events = await kv.get(key) || [];
  const body = req.body || {};
  if (body.action === "add") {
    const title = safe(body.title), date = safe(body.date), link = safe(body.link);
    if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: "A title and valid date are required." });
    events.unshift({ id: crypto.randomUUID(), title, date, link: /^https?:\/\//.test(link) ? link : "", votes: 0, createdAt: Date.now() });
  } else if (body.action === "vote") {
    const event = events.find(item => item.id === body.id);
    if (!event) return res.status(404).json({ error: "Event not found." });
    event.votes += 1;
  } else return res.status(400).json({ error: "Unknown action." });
  await kv.set(key, events.slice(0, 200));
  return res.status(200).json(events);
}