import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase environment variables on server.");
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

function sendJson(response, status, data) {
  response.status(status).setHeader("Content-Type", "application/json");
  response.send(JSON.stringify(data));
}

export default async function handler(request, response) {
  try {
    const supabase = getClient();

    if (request.method === "GET") {
      const { data, error } = await supabase
        .from("certificates")
        .select("id,title,issuer,date,url,created_at")
        .order("date", { ascending: false });

      if (error) {
        return sendJson(response, 500, { error: error.message });
      }

      return sendJson(response, 200, { data });
    }

    if (request.method === "POST") {
      const { title, issuer, date, url } = request.body || {};

      if (!title || !issuer || !date) {
        return sendJson(response, 400, {
          error: "title, issuer, and date are required.",
        });
      }

      const { data, error } = await supabase
        .from("certificates")
        .insert({
          title: String(title).trim(),
          issuer: String(issuer).trim(),
          date: String(date),
          url: url ? String(url).trim() : null,
        })
        .select("id,title,issuer,date,url,created_at")
        .single();

      if (error) {
        return sendJson(response, 500, { error: error.message });
      }

      return sendJson(response, 201, { data });
    }

    if (request.method === "DELETE") {
      const id = Number(request.query?.id);

      if (!id) {
        return sendJson(response, 400, { error: "id query parameter is required." });
      }

      const { error } = await supabase.from("certificates").delete().eq("id", id);

      if (error) {
        return sendJson(response, 500, { error: error.message });
      }

      return sendJson(response, 200, { success: true });
    }

    return sendJson(response, 405, { error: "Method not allowed." });
  } catch (error) {
    return sendJson(response, 500, { error: error.message });
  }
}
