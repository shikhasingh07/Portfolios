import React from "react";

// Splits a heading into letters for the entrance animation,
// while screen readers still get one plain word.
const Rise = ({ text }) => (
  <>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">
      {text.split(" ").map((word, w) => (
        <React.Fragment key={word}>
          {w > 0 && " "}
          <span className="rise-word">
            {word.split("").map((c, i) => (
              <span className="rise" key={i}>{c}</span>
            ))}
          </span>
        </React.Fragment>
      ))}
    </span>
  </>
);

export default Rise;
