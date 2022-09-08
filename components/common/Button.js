export const Button = ({ className, children, ...props }) => {
  return (
    <button className={`rounded px-2 py-1 border ${className}`} {...props}>
      {children}
    </button>
  );
};
