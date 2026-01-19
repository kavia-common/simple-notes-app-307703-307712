/**
 * HTTP Notes Repository
 * ---------------------
 * Implements the NotesRepository contract using the backend REST API.
 *
 * Backend endpoints (per OpenAPI):
 *  - GET    /api/notes
 *  - POST   /api/notes
 *  - PUT    /api/notes/{note_id}
 *  - DELETE /api/notes/{note_id}
 *
 * Base URL:
 *  - Prefer REACT_APP_API_BASE (e.g. "http://localhost:3001/api")
 *  - Fallback to REACT_APP_BACKEND_URL + "/api" (e.g. "http://localhost:3001")
 *
 * This file is intentionally dependency-free (uses fetch).
 */

/**
 * @typedef {import("../notesRepository").Note} Note
 */

/**
 * Normalize/derive the API base URL from environment variables.
 * Examples:
 *  - REACT_APP_API_BASE="http://localhost:3001/api" => base "http://localhost:3001/api"
 *  - REACT_APP_BACKEND_URL="http://localhost:3001"  => base "http://localhost:3001/api"
 */
function getApiBase() {
  const explicit = process.env.REACT_APP_API_BASE;
  if (explicit && String(explicit).trim()) {
    const cleaned = String(explicit).trim().replace(/\/+$/, "");
    // Allow either ".../api" or just a host; normalize to include /api.
    return cleaned.endsWith("/api") ? cleaned : `${cleaned}/api`;
  }

  const backend = process.env.REACT_APP_BACKEND_URL;
  if (backend && String(backend).trim()) {
    const cleaned = String(backend).trim().replace(/\/+$/, "");
    // Allow BACKEND_URL to already include /api.
    return cleaned.endsWith("/api") ? cleaned : `${cleaned}/api`;
  }

  /**
   * In many hosted preview environments, the frontend is served behind a gateway that can route
   * /api/* to the backend service. Using a same-origin relative base is the most portable default.
   */
  return "/api";
}

/**
 * Build a URL by joining base + path segments without double slashes.
 * @param {string} base
 * @param {string} path
 */
function joinUrl(base, path) {
  return `${String(base).replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`;
}

/**
 * Read response body and throw a useful error on non-2xx responses.
 * @param {Response} res
 * @param {string} fallbackMessage
 */
async function assertOk(res, fallbackMessage) {
  if (res.ok) return;

  let detail = "";
  try {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await res.json();
      // FastAPI typical error shape: { detail: ... }
      if (json?.detail) detail = typeof json.detail === "string" ? json.detail : JSON.stringify(json.detail);
      else detail = JSON.stringify(json);
    } else {
      detail = await res.text();
    }
  } catch {
    // ignore parsing issues, use fallback
  }

  const msg = detail ? `${fallbackMessage} (${res.status}): ${detail}` : `${fallbackMessage} (${res.status})`;
  const err = new Error(msg);
  err.status = res.status;
  throw err;
}

// PUBLIC_INTERFACE
export const httpNotesRepository = {
  /**
   * List all notes.
   * @returns {Promise<Note[]>}
   */
  async listNotes() {
    const base = getApiBase();
    const url = joinUrl(base, "/notes");

    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    await assertOk(res, "Failed to list notes");
    return res.json();
  },

  /**
   * Create a note.
   * @param {{title: string, content: string}} input
   * @returns {Promise<Note>}
   */
  async createNote({ title, content }) {
    const base = getApiBase();
    const url = joinUrl(base, "/notes");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ title, content })
    });

    await assertOk(res, "Failed to create note");
    return res.json();
  },

  /**
   * Update a note (partial update supported by backend).
   * @param {number} noteId
   * @param {{title?: string|null, content?: string|null}} patch
   * @returns {Promise<Note>}
   */
  async updateNote(noteId, patch) {
    const base = getApiBase();
    const url = joinUrl(base, `/notes/${encodeURIComponent(noteId)}`);

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(patch ?? {})
    });

    await assertOk(res, "Failed to update note");
    return res.json();
  },

  /**
   * Delete a note.
   * @param {number} noteId
   * @returns {Promise<void>}
   */
  async deleteNote(noteId) {
    const base = getApiBase();
    const url = joinUrl(base, `/notes/${encodeURIComponent(noteId)}`);

    const res = await fetch(url, {
      method: "DELETE"
    });

    // Backend returns 204 No Content on success.
    await assertOk(res, "Failed to delete note");
  }
};
