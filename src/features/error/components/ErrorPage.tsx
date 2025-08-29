import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

import "./ErrorPage.scss";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div id="error-page" className="page">
      <div className="container">
        {isRouteErrorResponse(error) ? (
          <>
            <h1>
              {error.status} {error.statusText}
            </h1>
            <span>{error.data?.message || "Something went wrong."}</span>
          </>
        ) : (
          <>
            <h1>Unexpected Error</h1>
            <span>{(error as Error)?.message}</span>
          </>
        )}
        <Link className="button" to="/">
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
