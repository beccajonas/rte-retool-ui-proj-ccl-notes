import React, { StrictMode } from "react"
import { Retool } from "@tryretool/custom-component-support"
import App from "./App"
import { Button } from "@chakra-ui/react"

export function richTextEditor() {
  const [note, _setNote] = Retool.useStateString({
    name: "note",
    initialValue: "My note"
  })

  return (
    <StrictMode>
      <App setNote={_setNote} />
    </StrictMode>
  )
}
