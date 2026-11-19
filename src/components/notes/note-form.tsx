"use client";
import { useEffect, useRef } from "react";

type NoteFormProps = {
  action: (formData: FormData) => void;
  pending: boolean;
  error?: string;
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  date: string | null;
  active: boolean;
};

export function NoteForm({ action, pending, error, title, content, onTitleChange, onContentChange, date, active }: NoteFormProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = contentRef.current;
    if (!textarea || !active) return;
    function fitContent() {
      if (!textarea) return;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    fitContent();
    // Let the document scroll as one surface, including after viewport changes.
    let previousWidth = textarea.parentElement?.clientWidth;
    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width;
      if (width !== previousWidth) {
        previousWidth = width;
        fitContent();
      }
    });
    if (textarea.parentElement) observer.observe(textarea.parentElement);
    return () => observer.disconnect();
  }, [content, active]);

  return (
    <form id="new-note-form" action={action} className="writing-area note-editor" aria-label="New note" aria-busy={pending}>
      {date && <time className="document-date" dateTime={date}>{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(date))}</time>}
      <fieldset disabled={pending} className="note-fields">
        <legend className="sr-only">Note details — all fields required</legend>
        <div className="editor-title-field" data-has-title={title.length > 0}>
          <label className="sr-only" htmlFor="note-title">Title (required, up to 120 characters)</label>
          <input id="note-title" data-writing-focus name="title" required maxLength={120} value={title} onChange={e => onTitleChange(e.target.value)} placeholder="Title" />
          <span className="title-underline" aria-hidden="true">{title || "Title"}</span>
        </div>
        <div className="editor-content-field">
          <label className="sr-only" htmlFor="note-content">Note (required, up to 10,000 characters)</label>
          <textarea ref={contentRef} id="note-content" name="content" required maxLength={10000} rows={12} value={content} onChange={e => onContentChange(e.target.value)} placeholder="Start writing…" />
        </div>
      </fieldset>
      {error && <p role="alert" className="error editor-feedback">{error}</p>}
    </form>
  );
}
