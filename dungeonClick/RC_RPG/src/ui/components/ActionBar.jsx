import React from "react";

export default function ActionBar({
  actions = [],
  onAction,
  disabled = false,
  title = "Actions",
  showPass = false,
  onPass,
  passDisabled = false,
}) {
  return (
    <div className="actionbar">
      <div className="actionbar__head">
        <div className="actionbar__title">{title}</div>
        <div className="actionbar__spacer" />
        {showPass && (
          <button
            className="actionbar__pass"
            onClick={() => !passDisabled && onPass?.()}
            disabled={passDisabled}
            title="Terminer votre tour maintenant"
          >
            Passer le tour
          </button>
        )}
      </div>

      <div className="actionbar__row">
        {actions.map((a) => {
          const isOnCd = (a.remainingCooldown ?? 0) > 0;
          const isDisabled = disabled || isOnCd || a.disabled === true || a.canUse === false;
          const cdText = isOnCd ? ` (${a.remainingCooldown})` : "";
          return (
            <button
              key={a.id}
              className={`actionbar__btn ${a.variant === "primary" ? "actionbar__btn--primary" : ""}`}
              onClick={() => !isDisabled && onAction?.(a)}
              disabled={isDisabled}
              title={a.tooltip || a.description || a.name}
            >
              {a.icon ? <span className="actionbar__ico">{a.icon}</span> : null}
              <span>{a.name}{cdText}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
