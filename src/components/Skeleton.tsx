import clsx from 'clsx'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export const Skeleton = ({
  className,
  variant = 'rectangular',
  width,
  height,
  ...props
}: SkeletonProps) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-700'

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={clsx(baseClasses, variantClasses[variant], className)}
      style={style}
      {...props}
      aria-busy="true"
      aria-label="Loading"
    />
  )
}
