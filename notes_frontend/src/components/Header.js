import React from "react";

// PUBLIC_INTERFACE
export default function Header() {
  /** Top header for the notes application. */
  return (
    <header className="appHeader" role="banner">
      <div className="appHeader__brand">
        <div className="appHeader__mark" aria-hidden="true" />
        <div className="appHeader__text">
          <div className="appHeader__title">Simple Notes</div>
          <div className="appHeader__subtitle">A lightweight notes editor</div>
        </div>
      </div>
    </header>
  );
}
