import ErrorView from "@components/ErrorView"

export default function ServerError() {
  return <ErrorView code={500} message="server" />
}
