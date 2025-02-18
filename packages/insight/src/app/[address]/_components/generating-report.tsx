import { Spinner } from '../../../components/core/spinner'

export function GeneratingReport() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
      <span className="font-oswald text-5xl font-bold">
        Generating report...
      </span>
      <Spinner className="size-20 stroke-highlight" />
    </div>
  )
}
