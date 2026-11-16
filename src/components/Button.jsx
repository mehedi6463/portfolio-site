const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap ' +
  'transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-out ' +
  'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-45';

const variants = {
  primary:
    'bg-accent text-on-accent shadow-[0_10px_30px_-12px_var(--glow)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-14px_var(--accent-2)]',
  secondary:
    'border border-line-strong bg-surface/60 text-ink hover:-translate-y-0.5 hover:border-accent-text hover:text-accent-text',
  ghost: 'text-ink hover:text-accent-text',
};

const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[0.95rem]',
  lg: 'h-14 px-7 text-base',
};

/**
 * Reusable button. Renders an <a> when `href` is set, otherwise a <button>.
 * `icon` renders after the label and nudges on hover; `iconLeft` renders before it.
 */
export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconLeft: IconLeft,
  className = '',
  children,
  disabled,
  ...props
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      {IconLeft && <IconLeft className="size-4 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
      {Icon && (
        <Icon
          className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href) {
    if (disabled) {
      return (
        <a className={classes} aria-disabled="true" role="link" {...props}>
          {content}
        </a>
      );
    }
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} disabled={disabled} {...props}>
      {content}
    </button>
  );
}
