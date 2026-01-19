import React, { useEffect, useMemo, useState } from "react";

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onSave, isSaving, isBusy }) {
  /** Main note editor panel for the selected note. */
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setLocalError("");
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
  }, [note?.id, note?.title, note?.content]); // reset when switching notes / when note content changes externally

  const isEmptySelection = !note;

  const isDirty = useMemo(() => {
    if (!note) return false;
    return (title ?? "") !== (note.title ?? "") || (content ?? "") !== (note.content ?? "");
  }, [note, title, content]);

  const updatedAtLabel = useMemo(() => {
    if (!note?.updated_at) return "";
    try {
      return new Date(note.updated_at).toLocaleString();
    } catch {
      return "";
    }
  }, [note?.updated_at]);

  const canSave = !isEmptySelection && isDirty && !isSaving && !isBusy;

  const handleSave = async () => {
    setLocalError("");
    if (!note) return;

    const trimmedTitle = (title ?? "").trim();
    if (!trimmedTitle) {
      setLocalError("Title is required.");
      return;
    }

    await onSave(note.id, { title: trimmedTitle, content: content ?? "" });
  };

  return (
    <section className="editor" aria-label="Note editor">
      <div className="editor__header">
        <div>
          <div className="editor__title">Editor</div>
          <div className="editor__subtitle">
            {note ? (
              <>
                Note ID <strong>#{note.id}</strong>
                {updatedAtLabel ? <span className="editor__dot">•</span> : null}
                {updatedAtLabel ? <>Last updated {updatedAtLabel}</> : null}
              </>
            ) : (
              "No note selected"
            )}
          </div>
        </div>

        <div className="editor__actions">
          <button
            type="button"
            className="btn btnSuccess"
            onClick={handleSave}
            disabled={!canSave}
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {localError ? (
        <div className="inlineMessage inlineMessage--error" role="alert">
          {localError}
        </div>
      ) : null}

      {isEmptySelection ? (
        <div className="editor__emptyState">
          <div className="emptyStateCard">
            <div className="emptyStateCard__title">Select a note</div>
            <div className="emptyStateCard__desc">
              Choose a note from the sidebar, or create a new one to start writing.
            </div>
          </div>
        </div>
      ) : (
        <form
          className="editor__form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <label className="field">
            <span className="field__label">Title</span>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              disabled={isBusy || isSaving}
              maxLength={200}
            />
          </label>

          <label className="field field--grow">
            <span className="field__label">Content</span>
            <textarea
              className="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note…"
              disabled={isBusy || isSaving}
              rows={12}
            />
          </label>

          <div className="editor__footer">
            <div className="editor__status" aria-live="polite">
              {isDirty ? "Unsaved changes" : "All changes saved"}
            </div>

            <button type="submit" className="btn btnSuccess" disabled={!canSave}>
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
