import { CANONICAL_URL } from "../../routes";
import PageHeader from "../PageHeader";

import { Helmet } from "react-helmet";

export default function MediaPage() {
  return (
    <>
      <Helmet></Helmet>
      <PageHeader src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344">
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          MEDIA
        </h2>
        <p className="font-semibold text-neutral-200 text-sm">
          OUR CONTRIBUTION.
        </p>
      </PageHeader>
    </>
  );
}
