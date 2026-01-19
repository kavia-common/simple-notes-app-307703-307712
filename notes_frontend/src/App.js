import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import { createNote, deleteNote, listNotes, updateNote } from "./data/notesData";

// PUBLIC_INTERFACE
function App() {
  /** Notes SPA: sidebar list + main editor panel. Data layer is currently a placeholder. */
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const isBusy = isLoading || isCreating || isDeleting || isSaving;

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const result = await listNotes();
        if (cancelled) return;
        setNotes(result);
        setSelectedNoteId((prev) => {
          if (prev && result.some((n) => n.id === prev)) return prev;
          return result.length ? result[0].id : null;
        });
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Failed to load notes.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await listNotes();
      setNotes(result);
      setSelectedNoteId((prev) => {
        if (prev && result.some((n) => n.id === prev)) return prev;
        return result.length ? result[0].id : null;
      });
    } catch (e) {
      setError(e?.message || "Failed to refresh notes.");
    } finally {
      setIsLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleCreate = async () => {
    /** Create a new note and select it. */
    setIsCreating(true);
    setError("");
    try {
      const created = await createNote({ title: "Untitled", content: "" });
      // Optimistic UI: prepend immediately
      setNotes((prev) => [created, ...prev]);
      setSelectedNoteId(created.id);
    } catch (e) {
      setError(e?.message || "Failed to create note.");
    } finally {
      setIsCreating(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleDelete = async (noteId) => {
    /** Delete a note and adjust selection. */
    if (isBusy) return;

    const toDelete = notes.find((n) => n.id === noteId);
    const ok = window.confirm(`Delete "${toDelete?.title || "Untitled"}"? This cannot be undone.`);
    if (!ok) return;

    setIsDeleting(true);
    setError("");

    // Optimistic remove
    const prevNotes = notes;
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    setSelectedNoteId((prevSelected) => {
      if (prevSelected !== noteId) return prevSelected;
      const remaining = prevNotes.filter((n) => n.id !== noteId);
      return remaining.length ? remaining[0].id : null;
    });

    try {
      await deleteNote(noteId);
    } catch (e) {
      // Rollback on failure
      setNotes(prevNotes);
      setSelectedNoteId((prevSelected) => prevSelected ?? noteId);
      setError(e?.message || "Failed to delete note.");
    } finally {
      setIsDeleting(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleSave = async (noteId, patch) => {
    /** Save changes to a note (title/content). */
    setIsSaving(true);
    setError("");
    try {
      const updated = await updateNote(noteId, patch);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setSelectedNoteId(updated.id);
    } catch (e) {
      setError(e?.message || "Failed to save note.");
      // If update failed due to stale data, refresh list to re-sync.
      await refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="appShell">
      <Header />

      <div className="appBody">
        <Sidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onCreateNote={handleCreate}
          onDeleteNote={handleDelete}
          isBusy={isBusy}
          isLoading={isLoading}
          error={error}
        />

        <main className="main" aria-label="Main content">
          {error ? (
            <div className="banner banner--error" role="alert">
              <div className="banner__text">{error}</div>
            </div>
          ) : null}

          <NoteEditor note={selectedNote} onSave={handleSave} isSaving={isSaving} isBusy={isBusy} />

          <div className="helpBar" aria-label="Help">
            <div className="helpBar__left">
              {isBusy ? (
                <span className="pill pill--info">Working…</span>
              ) : (
                <span className="pill pill--ok">Ready</span>
              )}
              <span className="helpBar__sep">•</span>
              <span className="helpBar__muted">
                Backend wiring will replace the placeholder data layer next.
              </span>
            </div>
            <div className="helpBar__right">
              <button type="button" className="btn btnGhost" onClick={refresh} disabled={isBusy}>
                Refresh
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
