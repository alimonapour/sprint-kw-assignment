type SkeletonProps = {
  className?: string
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`}
  />
)
