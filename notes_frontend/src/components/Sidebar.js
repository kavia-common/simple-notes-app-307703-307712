import React, { useMemo } from "react";

// PUBLIC_INTERFACE
export default function Sidebar({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  isBusy,
  isLoading,
  error
}) {
  /** Sidebar list of notes with create/delete actions. */
  const hasNotes = notes && notes.length > 0;

  const selected = useMemo(
    () => notes?.find((n) => n.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  return (
    <aside className="sidebar" aria-label="Notes sidebar">
      <div className="sidebar__top">
        <div className="sidebar__heading">
          <div className="sidebar__title">Notes</div>
          <div className="sidebar__count">{notes?.length ?? 0}</div>
        </div>

        <button
          type="button"
          className="btn btnPrimary btnFull"
          onClick={onCreateNote}
          disabled={isBusy || isLoading}
        >
          + New note
        </button>

        {error ? (
          <div className="inlineMessage inlineMessage--error" role="alert">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="inlineMessage inlineMessage--info" aria-live="polite">
            Loading notes…
          </div>
        ) : null}

        {!isLoading && !hasNotes ? (
          <div className="inlineMessage inlineMessage--muted">No notes yet. Create one.</div>
        ) : null}
      </div>

      <div className="sidebar__list" role="listbox" aria-label="Notes list">
        {notes?.map((note) => {
          const isSelected = note.id === selectedNoteId;
          return (
            <div
              key={note.id}
              className={`noteRow ${isSelected ? "noteRow--selected" : ""}`}
              role="option"
              aria-selected={isSelected}
              tabIndex={0}
              onClick={() => onSelectNote(note.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelectNote(note.id);
              }}
            >
              <div className="noteRow__main">
                <div className="noteRow__title">{note.title || "Untitled"}</div>
                <div className="noteRow__meta">
                  Updated {new Date(note.updated_at).toLocaleString()}
                </div>
              </div>

              <button
                type="button"
                className="iconBtn iconBtnDanger"
                aria-label={`Delete note "${note.title || "Untitled"}"`}
                title="Delete note"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                disabled={isBusy || isLoading}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>

      <div className="sidebar__bottom">
        {selected ? (
          <div className="sidebar__selectedHint">
            Selected: <strong>{selected.title || "Untitled"}</strong>
          </div>
        ) : (
          <div className="sidebar__selectedHint">Select a note to edit.</div>
        )}
      </div>
    </aside>
  );
}
