import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import Form from "./Form"

type ChildProps = {
  setName: (newValue: string) => void // ✅ expects a string
}

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#E9EBDF"
      }
    }
  }
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 0
    }
  }
})

export default function App({ setName }: ChildProps) {
  return (
    <ChakraProvider theme={theme}>
      <Form setName={setName} />
    </ChakraProvider>
  )
}
