import { useState } from "react"
import { Box } from "@chakra-ui/react"
import { RichTextEditor } from "./RichTextEditor"

type ChildProps = {
  setName: (newValue: string) => void
}

export default function Form({ setName }: ChildProps) {
  const [value, setValue] = useState("")

  return (
    <Box p={1}>
      <RichTextEditor
        setName={setName}
        placeholder="Type here"
        name="text"
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </Box>
  )
}
