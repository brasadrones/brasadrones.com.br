import type { APIRoute } from "astro";
import { getRedirects } from "@/lib/redirects";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const map = await getRedirects({ forceRefresh: true });
    const redirects = Object.fromEntries(map);

    return new Response(
      JSON.stringify(
        {
          ok: true,
          count: map.size,
          updatedAt: new Date().toISOString(),
          redirects,
        },
        null,
        2
      ),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
