"use client"
import Popup from "reactjs-popup"
import useProcessingStatus from "../../lib/hooks/data/useProcessingStatus"

export function statusMessage(running: boolean) {
  if (running) {
    return <span className="text-rose-500">Running</span>
  }

  return <span className="text-lime-500">Idle</span>
}

export default function StatusPage() {
  const { data } = useProcessingStatus()

  const errorPopup = (key: number, triggerText: string, error: string, details: Map<string, string>) => {
    return (
      <Popup
        key={key}
        trigger={
          <span key={key} className={`bg-rose-950 rounded-md px-2 py-0 m-1`}>
            {triggerText}
          </span>
        }
        position="bottom right"
        arrow={true}
        arrowStyle={{ color: "rgb(15 23 42)" }}
      >
        <div className="rounded-lg bg-slate-900 w-auto h-auto p-4">
          <div>{error}</div>
          <div>{Array.from(details.entries()).map((e) => `${e[0]}: ${e[1]}`)}</div>
        </div>
      </Popup>
    )
  }

  if (!data) {
    return (
      <div className="flex justify-center">
        <div className="text-xs text-gray-300">Waiting for the status response...</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 p-8 rounded-md">
      <h2 className="mb-4 font-bold">Statistics</h2>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <h4>Galleries</h4>
          <div>Status: {statusMessage(data.Scan.Running)}</div>
          <div className="flex flex-wrap">
            Found:
            {data.Scan.FoundGalleries.map((g, i) => (
              <span key={i} className="bg-emerald-800 rounded-md px-2 py-0 m-1">
                {g}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap">
            Skipped:
            {data.Scan.SkippedGalleries.map((g, i) => (
              <span key={i} className="bg-slate-950 rounded-md px-2 py-0 m-1">
                {g}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap">
            Errors:
            {data.Scan.Errors.map((g, i) => errorPopup(i, g.UUIDOrPath, g.Error, g.Details))}
          </div>
        </div>
        <div className="flex flex-col">
          <h4>Metadata</h4>
          <div>Status: {statusMessage(data.Metadata.Running)}</div>
          <div className="flex flex-wrap">
            Errors:
            {data.Scan.Errors.map((g, i) => errorPopup(i, g.UUIDOrPath, g.Error, g.Details))}
          </div>
        </div>
        <div className="flex flex-col">
          <h4>Thumbnails</h4>
          <div>Status: {statusMessage(data.Thumbnails.Running)}</div>
          <div>Cover thumbnails generated: {data.Thumbnails.GeneratedCovers}</div>
          <div>Page thumbnails generated: {data.Thumbnails.GeneratedPages}</div>
          <div className="flex flex-wrap">
            Errors:
            {data.Scan.Errors.map((g, i) => errorPopup(i, g.UUIDOrPath, g.Error, g.Details))}
          </div>
        </div>
      </div>
    </div>
  )
}
