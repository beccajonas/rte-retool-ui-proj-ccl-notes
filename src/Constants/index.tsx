import {
  ArrowClockwise,
  ArrowCounterclockwise,
  Code,
  Highlighter,
  TypeBold,
  TypeItalic,
  TypeStrikethrough,
  TypeUnderline
} from "react-bootstrap-icons"

export enum RichTextAction {
  Bold = "bold",
  Italics = "italics",
  Underline = "underline",
  Strikethrough = "strikethrough",
  Superscript = "superscript",
  Subscript = "subscript",
  Highlight = "highlight",
  Code = "code",
  LeftAlign = "leftAlign",
  CenterAlign = "centerAlign",
  RightAlign = "rightAlign",
  JustifyAlign = "justifyAlign",
  Divider1 = "button-divider-1",
  Divider2 = "button-divider-2",
  Divider3 = "button-divider-3",
  Undo = "undo",
  Redo = "redo"
}

export const RICH_TEXT_OPTIONS = [
  { id: RichTextAction.Bold, icon: <TypeBold />, label: "Bold" },
  { id: RichTextAction.Italics, icon: <TypeItalic />, label: "Italics" },
  { id: RichTextAction.Underline, icon: <TypeUnderline />, label: "Underline" },
  { id: RichTextAction.Divider1 },
  {
    id: RichTextAction.Highlight,
    icon: <Highlighter />,
    label: "Highlight",
    fontSize: 10
  },
  {
    id: RichTextAction.Strikethrough,
    icon: <TypeStrikethrough />,
    label: "Strikethrough"
  },
  {
    id: RichTextAction.Code,
    icon: <Code />,
    label: "Code"
  }
]

export const LOW_PRIORIRTY = 1
export const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"]
