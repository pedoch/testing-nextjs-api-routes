export const Input = ({ className, ...props }) => {
  return (
    <input className={`rounded px-2 py-1 border ${className}`} {...props} />
  );
};
