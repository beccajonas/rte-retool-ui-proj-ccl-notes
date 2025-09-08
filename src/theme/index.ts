import { type EditorThemeClasses } from "lexical"
import "./index.css"
import "./editor.css"

export const theme: EditorThemeClasses = {
  text: {
    bold: "bold",
    underline: "underline",
    strikethrough: "strikethrough",
    underlineStrikethrough: "underlineStrikethrough",
    italic: "italic",
    code: "code"
  },
  code: "editorCode",
  list: {
    ul: "my-ul-class",
    ol: "my-ol-class",
    listitem: "my-li-class"
  },
  link: "editor-link"
}
