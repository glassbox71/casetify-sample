import React from "react";
import { Link } from "react-router-dom";
import "./scss/EmptyState.scss";

export default function EmptyState({
  title,
  strong,
  desc = "다른 조건으로 다시 시도해 보세요.",
  btnText = "홈으로 돌아가기",
  btnLink = "/",
  icon = "!",
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>

      <p className="empty-state-title">
        {strong && <strong>{strong}</strong>}
        {title}
      </p>

      {desc && <p className="empty-state-desc">{desc}</p>}

      {btnText && btnLink && (
        <Link to={btnLink} className="empty-state-btn">
          {btnText}
        </Link>
      )}
    </div>
  );
}