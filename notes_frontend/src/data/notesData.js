/**
 * Legacy Data Module (Compatibility Layer)
 * ---------------------------------------
 * The UI currently imports from `./data/notesData`.
 *
 * To keep UI/UX and state flows intact while preparing for API integration,
 * this file delegates to a swappable repository implementation.
 *
 * Next step: swap `getNotesRepository()` to an API-backed repository without
 * touching component props/state wiring.
 */

import { getNotesRepository } from "./notesRepository";

// PUBLIC_INTERFACE
export async function listNotes() {
  /** List all notes. Returns Note[] */
  return getNotesRepository().listNotes();
}

// PUBLIC_INTERFACE
export async function createNote({ title, content }) {
  /** Create a note. Returns created Note */
  return getNotesRepository().createNote({ title, content });
}

// PUBLIC_INTERFACE
export async function updateNote(noteId, patch) {
  /** Update a note by id. Returns updated Note */
  return getNotesRepository().updateNote(noteId, patch);
}

// PUBLIC_INTERFACE
export async function deleteNote(noteId) {
  /** Delete a note by id. Returns void */
  return getNotesRepository().deleteNote(noteId);
}
