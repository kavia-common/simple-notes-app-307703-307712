let _nextId = 3;

/**
 * In-memory seed data so the UI has something to render without backend wiring.
 * This file intentionally matches the backend shape (id/title/content/created_at/updated_at)
 * so swapping to an API repository later is straightforward.
 */
let _notes = [
  {
    id: 1,
    title: "Welcome",
    content: "Create, edit, and delete notes from the sidebar.\n\nYour changes are saved when you click Save.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 2,
    title: "Tip",
    content: "Use the title field for quick summaries.\nKeep content for longer thoughts.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sortByUpdatedDesc = (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();

const clone = (obj) => JSON.parse(JSON.stringify(obj));

// PUBLIC_INTERFACE
export const inMemoryNotesRepository = {
  /**
   * List all notes (placeholder). Returns Note[]
   * @returns {Promise<import("../notesRepository").Note[]>}
   */
  async listNotes() {
    await sleep(250);
    return clone(_notes.slice().sort(sortByUpdatedDesc));
  },

  /**
   * Create a note (placeholder). Returns created Note
   * @param {{title: string, content: string}} input
   */
  async createNote({ title, content }) {
    await sleep(250);

    const now = new Date().toISOString();
    const note = {
      id: _nextId++,
      title: title?.trim() || "Untitled",
      content: content ?? "",
      created_at: now,
      updated_at: now
    };

    _notes = [note, ..._notes];
    return clone(note);
  },

  /**
   * Update a note by id (placeholder). Returns updated Note
   * @param {number} noteId
   * @param {{title?: string|null, content?: string|null}} patch
   */
  async updateNote(noteId, patch) {
    await sleep(250);

    const idx = _notes.findIndex((n) => n.id === noteId);
    if (idx === -1) {
      const err = new Error("Note not found");
      err.code = "NOT_FOUND";
      throw err;
    }

    const existing = _notes[idx];
    const updated = {
      ...existing,
      ...patch,
      updated_at: new Date().toISOString()
    };

    _notes = _notes.map((n) => (n.id === noteId ? updated : n)).sort(sortByUpdatedDesc);
    return clone(updated);
  },

  /**
   * Delete a note by id (placeholder). Returns void
   * @param {number} noteId
   */
  async deleteNote(noteId) {
    await sleep(250);

    const before = _notes.length;
    _notes = _notes.filter((n) => n.id !== noteId);
    if (_notes.length === before) {
      const err = new Error("Note not found");
      err.code = "NOT_FOUND";
      throw err;
    }
  }
};
