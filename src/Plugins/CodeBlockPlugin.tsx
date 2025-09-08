import React, { useEffect } from "react"
import { CodeSquare } from "react-bootstrap-icons"
import { IconButton } from "@chakra-ui/react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { registerCodeHighlighting, $createCodeNode } from "@lexical/code"
import { $getSelection, $isRangeSelection } from "lexical"
import { $wrapNodes } from "@lexical/selection"

export default function CodeBlockPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    registerCodeHighlighting(editor)
  }, [editor])

  const onAddCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createCodeNode())
      }
    })
  }

  return (
    <div>
      <IconButton
        icon={<CodeSquare />}
        aria-label="Add Code Block"
        size="xs"
        variant="ghost"
        color="#333"
        onClick={onAddCodeBlock}
        paddingBottom={1}
      />
    </div>
  )
}
