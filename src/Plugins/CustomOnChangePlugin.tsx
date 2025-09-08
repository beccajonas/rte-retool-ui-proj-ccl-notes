import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { $generateHtmlFromNodes } from '@lexical/html'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

interface CustomOnChangePluginProps {
  value: string
  onChange: (value: string) => void
}

export default function CustomOnChangePlugin({
  value,
  onChange
}: CustomOnChangePluginProps) {
  const [editor] = useLexicalComposerContext()
  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          onChange($generateHtmlFromNodes(editor))
        })
      }}
    />
  )
}
