import { useEffect, useRef, useState } from 'react'
import { AgendaPoster } from './AgendaPoster'

export function PosterPreview({ posterData, posterRef }) {
  const viewportRef = useRef(null)
  const [scale, setScale] = useState(0.65)

  useEffect(() => {
    const element = viewportRef.current
    if (!element) return undefined
    const updateScale = () => setScale(Math.min(1, (element.clientWidth - 32) / 1000))
    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="poster-viewport" ref={viewportRef}>
      <div className="poster-scale-stage" style={{ width: 1000 * scale, height: 1400 * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <AgendaPoster ref={posterRef} posterData={posterData} />
        </div>
      </div>
    </div>
  )
}
