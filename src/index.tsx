import React, { StrictMode } from "react"
import { Retool } from "@tryretool/custom-component-support"
import App from "./App"
import { Button } from "@chakra-ui/react"

export function richTextEditor() {
  const [name, _setName] = Retool.useStateString({
    name: "name",
    label: "other",
    inspector: "text",
    initialValue: "message"
  })

  return (
    <StrictMode>
      <App setName={_setName} />
    </StrictMode>
  )
}
