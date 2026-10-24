import ErrorView from "@components/ErrorView"

export default function ServerError() {
  return <ErrorView code={500} message="Something went wrong. Please try again later." />
}
