export default function Panel({ as: Tag = "div", tex = "stone", className = "", children, ...rest }) {
  return (
    <Tag className={`mc-bevel tex-${tex} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
