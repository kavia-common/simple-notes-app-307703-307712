let _nextId = 3;

/**
 * In-memory seed data so the UI has something to render without backend wiring.
 * Replace these functions with real API calls in the next step.
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
export async function listNotes() {
  /** List all notes (placeholder). Returns Note[] */
  await sleep(250);
  return clone(_notes.slice().sort(sortByUpdatedDesc));
}

// PUBLIC_INTERFACE
export async function createNote({ title, content }) {
  /** Create a note (placeholder). Returns created Note */
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
}

// PUBLIC_INTERFACE
export async function updateNote(noteId, patch) {
  /** Update a note by id (placeholder). Returns updated Note */
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
}

// PUBLIC_INTERFACE
export async function deleteNote(noteId) {
  /** Delete a note by id (placeholder). Returns void */
  await sleep(250);

  const before = _notes.length;
  _notes = _notes.filter((n) => n.id !== noteId);
  if (_notes.length === before) {
    const err = new Error("Note not found");
    err.code = "NOT_FOUND";
    throw err;
  }
}
