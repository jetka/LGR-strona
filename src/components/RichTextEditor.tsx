"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { TextStyle, Color, FontFamily, FontSize } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { useCallback, useRef } from "react";
import {
    Bold, Italic, UnderlineIcon, Strikethrough, AlignLeft, AlignCenter,
    AlignRight, AlignJustify, List, ListOrdered, Heading1, Heading2,
    Heading3, Image as ImageIcon, Link2, Undo, Redo, Highlighter,
    Type, Palette, RemoveFormatting
} from "lucide-react";

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "40px", "48px"];
const FONTS = ["Arial", "Georgia", "Times New Roman", "Verdana", "Roboto", "serif"];
const COLORS = [
    "#ffffff", "#B4000F", "#FF4444", "#FF8800", "#FFDD00",
    "#44CC44", "#00BBFF", "#8844FF", "#FF44AA", "#888888", "#000000"
];
const HIGHLIGHTS = [
    "#B4000F", "#FF880044", "#FFDD0044", "#44CC4444", "#00BBFF44",
    "#8844FF44", "transparent"
];

function ToolbarButton({ onClick, active, title, children }: {
    onClick: () => void; active?: boolean; title: string; children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            title={title}
            className={`p-1.5 rounded transition-colors text-sm ${active
                ? "bg-[var(--color-lgr-red)] text-white"
                : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
        >
            {children}
        </button>
    );
}

function Separator() {
    return <div className="w-px h-6 bg-white/10 mx-1 self-center" />;
}

interface Props {
    value: string;
    onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            TextStyle,
            Color,
            FontSize,
            Highlight.configure({ multicolor: true }),
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Image.configure({ inline: false, allowBase64: true }),
            FontFamily,
            Link.configure({ openOnClick: false }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: "min-h-[320px] outline-none text-gray-100 leading-relaxed prose prose-invert max-w-none px-1",
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    const addImage = useCallback(() => {
        fileRef.current?.click();
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        const reader = new FileReader();
        reader.onload = () => {
            editor.chain().focus().setImage({ src: reader.result as string }).run();
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    }, [editor]);

    const setLink = useCallback(() => {
        const url = window.prompt("URL linku:");
        if (!url || !editor) return;
        editor.chain().focus().setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-black/60">
            {/* ── TOOLBAR ── */}
            <div className="bg-[#111] border-b border-white/10 px-3 py-2 flex flex-wrap items-center gap-1">
                {/* Undo/Redo */}
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Cofnij">
                    <Undo size={15} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Powtórz">
                    <Redo size={15} />
                </ToolbarButton>

                <Separator />

                {/* Headings */}
                <ToolbarButton active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Nagłówek 1">
                    <Heading1 size={15} />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Nagłówek 2">
                    <Heading2 size={15} />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Nagłówek 3">
                    <Heading3 size={15} />
                </ToolbarButton>

                <Separator />

                {/* Font size select */}
                <select
                    onChange={e => (editor.chain().focus() as any).setFontSize(e.target.value).run()}
                    className="bg-black/50 border border-white/10 rounded text-gray-200 text-xs px-2 py-1.5 focus:outline-none"
                    title="Rozmiar czcionki"
                    defaultValue=""
                >
                    <option value="" disabled>Rozmiar</option>
                    {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                {/* Font family */}
                <select
                    onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
                    className="bg-black/50 border border-white/10 rounded text-gray-200 text-xs px-2 py-1.5 focus:outline-none max-w-[110px]"
                    title="Czcionka"
                    defaultValue=""
                >
                    <option value="" disabled>Czcionka</option>
                    {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                </select>

                <Separator />

                {/* Bold / Italic / Underline / Strike */}
                <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Pogrubienie (Ctrl+B)">
                    <Bold size={15} />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Kursywa (Ctrl+I)">
                    <Italic size={15} />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Podkreślenie">
                    <UnderlineIcon size={15} />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Przekreślenie">
                    <Strikethrough size={15} />
                </ToolbarButton>

                <Separator />

                {/* Text colour */}
                <div className="flex items-center gap-0.5" title="Kolor tekstu">
                    <Palette size={14} className="text-gray-500 mr-0.5" />
                    {COLORS.map(c => (
                        <button
                            key={c}
                            type="button"
                            onMouseDown={e => { e.preventDefault(); editor.chain().focus().setColor(c).run(); }}
                            className="w-4 h-4 rounded-sm border border-white/20 hover:scale-110 transition-transform"
                            style={{ background: c }}
                            title={c}
                        />
                    ))}
                </div>

                <Separator />

                {/* Highlight */}
                <div className="flex items-center gap-0.5" title="Kolor tła">
                    <Highlighter size={14} className="text-gray-500 mr-0.5" />
                    {HIGHLIGHTS.map(c => (
                        <button
                            key={c}
                            type="button"
                            onMouseDown={e => {
                                e.preventDefault();
                                if (c === "transparent") {
                                    editor.chain().focus().unsetHighlight().run();
                                } else {
                                    editor.chain().focus().setHighlight({ color: c }).run();
                                }
                            }}
                            className="w-4 h-4 rounded-sm border border-white/20 hover:scale-110 transition-transform"
                            style={{ background: c === "transparent" ? "repeating-conic-gradient(#aaa 0% 25%, #555 0% 50%) 0 0 / 8px 8px" : c }}
                            title={c === "transparent" ? "Brak tła" : c}
                        />
                    ))}
                </div>

                <Separator />

                {/* Alignment */}
                <ToolbarButton active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Wyrównaj do lewej">
                    <AlignLeft size={15} />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Wyśrodkuj">
                    <AlignCenter size={15} />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Wyrównaj do prawej">
                    <AlignRight size={15} />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Justify">
                    <AlignJustify size={15} />
                </ToolbarButton>

                <Separator />

                {/* Lists */}
                <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista punktowana">
                    <List size={15} />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerowana">
                    <ListOrdered size={15} />
                </ToolbarButton>

                <Separator />

                {/* Image + Link */}
                <ToolbarButton onClick={addImage} title="Wstaw obrazek z komputera">
                    <ImageIcon size={15} />
                </ToolbarButton>
                <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Wstaw link">
                    <Link2 size={15} />
                </ToolbarButton>

                <Separator />

                {/* Clear formatting */}
                <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Usuń formatowanie">
                    <RemoveFormatting size={15} />
                </ToolbarButton>
            </div>

            {/* ── EDITOR AREA ── */}
            <div className="p-4 min-h-[320px]">
                <EditorContent editor={editor} />
            </div>

            {/* Hidden file input */}
            <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleFileChange} />

            {/* Tiptap prose styles injected — needed bc Turbopack doesn't preload them */}
            <style>{`
        .ProseMirror h1 { font-size: 2em; font-weight: 900; margin-bottom: .4em; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: 800; margin-bottom: .3em; }
        .ProseMirror h3 { font-size: 1.2em; font-weight: 700; margin-bottom: .2em; }
        .ProseMirror ul { list-style: disc; padding-left: 1.5em; margin: .5em 0; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.5em; margin: .5em 0; }
        .ProseMirror p { margin-bottom: .6em; }
        .ProseMirror strong { font-weight: 700; }
        .ProseMirror em { font-style: italic; }
        .ProseMirror u { text-decoration: underline; }
        .ProseMirror s { text-decoration: line-through; }
        .ProseMirror a { color: #B4000F; text-decoration: underline; }
        .ProseMirror img { max-width: 100%; border-radius: 8px; margin: .8em 0; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #555;
          pointer-events: none;
          float: left;
          height: 0;
        }
      `}</style>
        </div>
    );
}
