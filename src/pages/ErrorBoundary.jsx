import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import ErrorPage from "./ErrorPage";

export default function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <ErrorPage
        code={error.status}
        message={error.statusText || undefined}
      />
    );
  }
  const message =
    (error && (error.message || error.toString())) || "An unexpected error occurred.";
  return <ErrorPage code={500} message={message} />;
}
