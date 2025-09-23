import React from "react";
export default function ActionBar({ actions = [], onAction, disabled = false, title = "Actions" }) {
	return (
		<div style={wrap}>
			<div style={header}>{title}</div>
			<div style={row}>
				{actions.map((a) => {
					const isOnCd = (a.remainingCooldown ?? 0) > 0;
					const isDisabled = disabled || isOnCd || a.disabled === true || a.canUse === false;
					const cdText = isOnCd ? ` (${a.remainingCooldown})` : "";
					return (
						<button
							key={a.id}
							style={{ ...btn, ...(isDisabled ? btnDisabled : {}), ...(a.variant === "primary" ? btnPrimary : {}) }}
							onClick={() => !isDisabled && onAction?.(a)}
							disabled={isDisabled}
							title={a.tooltip || a.description || a.name}
						>
							{a.icon ? <span style={ico}>{a.icon}</span> : null}
							<span>{a.name}{cdText}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}


const wrap = {
	position: "absolute",
	left: "50%",
	bottom: "4%",
	transform: "translateX(-50%)",
	display: "flex",
	flexDirection: "column",
	gap: 8,
	width: "min(840px, 92vw)",
};


const header = {
	fontSize: 14,
	opacity: 0.9,
	letterSpacing: 0.4,
};


const row = {
	display: "flex",
	flexWrap: "wrap",
	gap: 10,
	justifyContent: "center",
};


const btn = {
	padding: "12px 16px",
	border: "1px solid rgba(255,255,255,0.12)",
	background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
	color: "#fff",
	borderRadius: 10,
	cursor: "pointer",
	fontSize: 16,
	fontWeight: 600,
	letterSpacing: 0.3,
	boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
	transition: "transform 120ms ease, box-shadow 120ms ease, background 200ms ease, opacity 120ms ease",
};


const btnPrimary = {
	borderColor: "rgba(59,130,246,0.5)",
};


const btnDisabled = {
	opacity: 0.5,
	cursor: "not-allowed",
};


const ico = { marginRight: 8 };