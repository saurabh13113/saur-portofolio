export default function Panel({ as: Tag = "div", tex = "stone", className = "", bump = true, children, ...rest }) {
  return (
    <Tag className={`mc-bevel tex-${tex} ${className}`} data-mc-bump={bump || undefined} {...rest}>
      {children}
    </Tag>
  );
}
