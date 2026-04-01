import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import ErrorLayout from "../components/layout/ErrorLayout";

export default function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <ErrorLayout
        code={error.status}
        message={error.statusText || undefined}
      />
    );
  }
  const message =
    (error && (error.message || error.toString())) || "An unexpected error occurred.";
  return <ErrorLayout code={500} message={message} />;
}
