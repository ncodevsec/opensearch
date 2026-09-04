export function Icon({ name, className = "", title = "" }) {
	return (
		<i
			className={`fa-solid ${name} ${className}`.trim()}
			title={title}
			aria-hidden="true"
		/>
	);
}
