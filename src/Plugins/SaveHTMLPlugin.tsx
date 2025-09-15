import React from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $generateHtmlFromNodes } from "@lexical/html"
import { $getRoot, $createParagraphNode } from "lexical"
import { Button } from "@chakra-ui/react"

type ChildProps = {
  setNote: (newValue: string) => void
}

export default function SaveHtmlPlugin({ setNote }: ChildProps) {
  const [editor] = useLexicalComposerContext()

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

  return (
    <Button colorScheme="blue" size="xs" onClick={saveHtml}>
      Send Note
    </Button>
  )
}
