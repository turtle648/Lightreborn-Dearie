export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full w-full min-h-[200px]" role="status" aria-label="로딩 중">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <span className="sr-only">로딩 중...</span>
    </div>
  )
}
