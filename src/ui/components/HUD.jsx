import React from "react";


export default function HUD({ turn = 1, currentActor = null, logs = [] }) {
	return (
		<div style={hudWrap}>
			<div style={topBar}>
				<div>Tour <strong>#{turn}</strong></div>
				<div>Acteur courant : <strong>{currentActor?.name ?? "—"}</strong></div>
			</div>
			<div style={logBox}>
				{logs.length === 0 ? (
					<div style={logEmpty}>Le combat commence…</div>
				) : (
					logs.slice(-8).map((l, i) => (
						<div key={i} style={logLine}>• {l}</div>
					))
				)}
			</div>
		</div>
	);
}


const hudWrap = {
	position: "absolute",
	top: "2%",
	left: "50%",
	transform: "translateX(-50%)",
	width: "min(900px, 92vw)",
	display: "flex",
	flexDirection: "column",
	gap: 8,
};


const topBar = {
	display: "flex",
	gap: 16,
	justifyContent: "center",
	fontSize: 14,
	opacity: 0.95,
};


const logBox = {
	maxHeight: 160,
	overflowY: "auto",
	border: "1px solid rgba(255,255,255,0.12)",
	borderRadius: 10,
	padding: 10,
	background: "rgba(255,255,255,0.03)",
};


const logLine = { fontSize: 14, lineHeight: 1.4, opacity: 0.95 };
const logEmpty = { fontSize: 14, opacity: 0.7, fontStyle: "italic" };