/**
 * Notes Repository Abstraction
 * ----------------------------
 * This module defines the contract that any notes data source must implement.
 *
 * Today, the app uses an in-memory placeholder repository.
 * In the next step, we can swap this to a real API-backed repository by changing
 * only `getNotesRepository()` in this file (or wiring a different provider),
 * without changing the UI components or App state flows.
 */

/**
 * @typedef {Object} Note
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {string} created_at ISO timestamp
 * @property {string} updated_at ISO timestamp
 */

/**
 * @typedef {Object} NotesRepository
 * @property {() => Promise<Note[]>} listNotes
 * @property {(input: {title: string, content: string}) => Promise<Note>} createNote
 * @property {(noteId: number, patch: {title?: string|null, content?: string|null}) => Promise<Note>} updateNote
 * @property {(noteId: number) => Promise<void>} deleteNote
 */

import { inMemoryNotesRepository } from "./repositories/inMemoryNotesRepository";

// PUBLIC_INTERFACE
export function getNotesRepository() {
  /** Returns the current notes repository implementation. Swap this to API later. */
  return inMemoryNotesRepository;
}
