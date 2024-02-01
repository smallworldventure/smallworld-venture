import React from "react";
import { useRouter } from "next/router";

function ViewPDF() {
  const { id } = useRouter().query;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: "0",
        zIndex: 2,
      }}
    >
      <object
        data={`https://backend.smallworldventure.com/public/upload/pdf/${
          id && id
        }`}
        // data={`http://localhost:5000/public/upload/pdf/${id && id}`}
        type="application/pdf"
        width="100%"
        height="100%"
        aria-labelledby="pdf viewer"
      />
    </div>
  );
}

export default ViewPDF;
