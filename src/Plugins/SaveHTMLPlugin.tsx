import React from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $generateHtmlFromNodes } from "@lexical/html"
import { $getRoot, $createParagraphNode } from "lexical"

type ChildProps = {
  setNote: (newValue: string) => void
}

export default function SaveHtmlPlugin({ setNote }: ChildProps) {
  const [editor] = useLexicalComposerContext()

  // This plugin now only handles the HTML generation logic
  // The send button has been moved to the toolbar
  React.useEffect(() => {
    const saveHtml = () => {
      let htmlString = ""

      // 1️⃣ Generate + clear inside Lexical update
      editor.update(() => {
        htmlString = $generateHtmlFromNodes(editor)
        console.log("Editor HTML:", htmlString)
        setNote(htmlString)

        // Clear editor after saving
        const root = $getRoot()
        root.clear()
        root.append($createParagraphNode())
      })
    }

    // Expose saveHtml function globally or through a ref if needed
    // For now, this plugin just handles the HTML generation logic
  }, [editor, setNote])

  return null // This plugin doesn't render anything anymore
}
