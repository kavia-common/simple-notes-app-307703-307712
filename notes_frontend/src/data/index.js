/**
 * Data Layer Exports
 * Centralized export point for the data/repository layer.
 *
 * UI currently imports from `./data/notesData` for compatibility.
 * Future integration can migrate to these exports gradually if desired.
 */

export { getNotesRepository } from "./notesRepository";
export * from "./notesData";
