'use client';
import { useRef, useState, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (htmlContent: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtmlView, setIsHtmlView] = useState(false);
  const [rawHtml, setRawHtml] = useState(value);
  const isUpdatingRef = useRef(false);

  // Sync value from props to editor DOM when value changes externally
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setRawHtml(value || '');
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      const html = editorRef.current.innerHTML;
      setRawHtml(html);
      onChange(html);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  };

  const handleRawHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawHtml(val);
    onChange(val);
    if (editorRef.current) {
      editorRef.current.innerHTML = val;
    }
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleInsertLink = () => {
    const url = prompt('लिंक का यूआरएल (URL) दर्ज करें:', 'https://');
    if (url && url !== 'https://') {
      execCmd('createLink', url);
    }
  };

  const handleInsertImage = () => {
    const url = prompt('इमेज का URL दर्ज करें (या कंप्यूटर/मोबाइल फ़ाइल अपलोड ऑप्शन प्रयोग करें):', 'https://');
    if (url) {
      execCmd('insertImage', url);
    }
  };

  const handleInsertVideo = () => {
    const url = prompt('यूट्यूब वीडियो या Shorts का लिंक दर्ज करें:', 'https://www.youtube.com/watch?v=');
    if (url) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]+)/);
      const videoId = match ? match[1] : null;
      if (videoId) {
        const embedHtml = `<div class="embedded-video-box" style="position:relative;padding-top:56.25%;margin:16px 0;background:#000;border-radius:8px;overflow:hidden;"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allowfullscreen loading="lazy"></iframe></div>`;
        document.execCommand('insertHTML', false, embedHtml);
        handleInput();
      } else {
        alert('अमान्य यूट्यूब लिंक!');
      }
    }
  };

  const handleFormatBlock = (tagName: string) => {
    execCmd('formatBlock', `<${tagName}>`);
  };

  return (
    <div
      className="blogger-style-editor"
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}
    >
      {/* BLOGGER-STYLE TOOLBAR */}
      <div
        className="editor-toolbar"
        style={{
          background: '#f8fafc',
          borderBottom: '1px solid #cbd5e1',
          padding: '8px 12px',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        {/* VIEW TOGGLE (COMPOSE VS HTML) */}
        <button
          type="button"
          title="Compose / HTML Source View Switch"
          onClick={() => setIsHtmlView(!isHtmlView)}
          style={{
            background: isHtmlView ? '#0f172a' : '#e2e8f0',
            color: isHtmlView ? '#ffffff' : '#0f172a',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            marginRight: '6px'
          }}
        >
          {isHtmlView ? '💻 HTML Code' : '✏️ Compose'}
        </button>

        <span style={{ height: '18px', width: '1px', background: '#cbd5e1', margin: '0 4px' }}></span>

        {!isHtmlView && (
          <>
            {/* UNDO / REDO */}
            <button type="button" title="Undo" onClick={() => execCmd('undo')} style={btnStyle}>
              ↩️
            </button>
            <button type="button" title="Redo" onClick={() => execCmd('redo')} style={btnStyle}>
              ↪️
            </button>

            <span style={{ height: '18px', width: '1px', background: '#cbd5e1', margin: '0 4px' }}></span>

            {/* HEADING / FORMAT SELECTOR */}
            <select
              title="Paragraph Format"
              onChange={(e) => handleFormatBlock(e.target.value)}
              defaultValue="p"
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
                fontSize: '12px',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="p">Normal Text</option>
              <option value="h2">H2 — मुख्य शीर्षक (Heading)</option>
              <option value="h3">H3 — उप-शीर्षक (Subheading)</option>
              <option value="blockquote">Quote (उद्धरण)</option>
            </select>

            <span style={{ height: '18px', width: '1px', background: '#cbd5e1', margin: '0 4px' }}></span>

            {/* BOLD, ITALIC, UNDERLINE, STRIKETHROUGH */}
            <button type="button" title="Bold" onClick={() => execCmd('bold')} style={{ ...btnStyle, fontWeight: 900 }}>
              B
            </button>
            <button type="button" title="Italic" onClick={() => execCmd('italic')} style={{ ...btnStyle, fontStyle: 'italic' }}>
              I
            </button>
            <button type="button" title="Underline" onClick={() => execCmd('underline')} style={{ ...btnStyle, textDecoration: 'underline' }}>
              U
            </button>
            <button type="button" title="Strikethrough" onClick={() => execCmd('strikeThrough')} style={{ ...btnStyle, textDecoration: 'line-through' }}>
              S
            </button>

            <span style={{ height: '18px', width: '1px', background: '#cbd5e1', margin: '0 4px' }}></span>

            {/* COLOR PICKERS */}
            <label title="Text Color" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', padding: '2px 4px', background: '#fff', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11px', fontWeight: 700 }}>
              🎨 Text:
              <input
                type="color"
                onChange={(e) => execCmd('foreColor', e.target.value)}
                style={{ width: '18px', height: '18px', border: 'none', background: 'none', cursor: 'pointer', marginLeft: '4px' }}
              />
            </label>

            <label title="Background Highlight" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', padding: '2px 4px', background: '#fff', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11px', fontWeight: 700 }}>
              🖍️ Bg:
              <input
                type="color"
                onChange={(e) => execCmd('hiliteColor', e.target.value)}
                style={{ width: '18px', height: '18px', border: 'none', background: 'none', cursor: 'pointer', marginLeft: '4px' }}
              />
            </label>

            <span style={{ height: '18px', width: '1px', background: '#cbd5e1', margin: '0 4px' }}></span>

            {/* ALIGNMENT */}
            <button type="button" title="Align Left" onClick={() => execCmd('justifyLeft')} style={btnStyle}>
              ⬅️
            </button>
            <button type="button" title="Align Center" onClick={() => execCmd('justifyCenter')} style={btnStyle}>
              ↔️
            </button>
            <button type="button" title="Align Right" onClick={() => execCmd('justifyRight')} style={btnStyle}>
              ➡️
            </button>
            <button type="button" title="Justify" onClick={() => execCmd('justifyFull')} style={btnStyle}>
              📄
            </button>

            <span style={{ height: '18px', width: '1px', background: '#cbd5e1', margin: '0 4px' }}></span>

            {/* LISTS */}
            <button type="button" title="Bulleted List" onClick={() => execCmd('insertUnorderedList')} style={btnStyle}>
              • Bullet
            </button>
            <button type="button" title="Numbered List" onClick={() => execCmd('insertOrderedList')} style={btnStyle}>
              1. Number
            </button>

            <span style={{ height: '18px', width: '1px', background: '#cbd5e1', margin: '0 4px' }}></span>

            {/* MEDIA & LINKS */}
            <button type="button" title="Insert Link" onClick={handleInsertLink} style={btnStyle}>
              🔗 Link
            </button>
            <button type="button" title="Insert Image URL" onClick={handleInsertImage} style={btnStyle}>
              🖼️ Image
            </button>
            <button type="button" title="Embed YouTube Video" onClick={handleInsertVideo} style={btnStyle}>
              🎬 Video
            </button>
            <button type="button" title="Horizontal Divider Line" onClick={() => execCmd('insertHorizontalRule')} style={btnStyle}>
              ➖ Line
            </button>

            <span style={{ height: '18px', width: '1px', background: '#cbd5e1', margin: '0 4px' }}></span>

            {/* CLEAR FORMATTING */}
            <button type="button" title="Remove Formatting" onClick={() => execCmd('removeFormat')} style={{ ...btnStyle, color: '#dc2626' }}>
              🧹 Clear
            </button>
          </>
        )}
      </div>

      {/* EDITOR CANVAS AREA */}
      {isHtmlView ? (
        <textarea
          value={rawHtml}
          onChange={handleRawHtmlChange}
          rows={16}
          style={{
            width: '100%',
            padding: '16px',
            border: 'none',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.6',
            background: '#0f172a',
            color: '#38bdf8',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          style={{
            minHeight: '300px',
            padding: '18px 24px',
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#1e293b',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#334155'
};
