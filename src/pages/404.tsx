import ErrorView from "@components/ErrorView"

export default function NotFound() {
  return <ErrorView code={404} message="This page could not be found." />
}
