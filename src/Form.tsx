import { useState } from "react"
import { Box } from "@chakra-ui/react"
import { RichTextEditor } from "./RichTextEditor"

type ChildProps = {
  setNote: (newValue: string) => void
}

export default function Form({ setNote }: ChildProps) {
  const [value, setValue] = useState("")

  return (
    <Box p={1}>
      <RichTextEditor
        setNote={setNote}
        placeholder="Write note here"
        name="text"
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </Box>
  )
}
