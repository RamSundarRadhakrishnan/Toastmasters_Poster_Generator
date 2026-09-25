import { forwardRef } from 'react'
import { PosterAgenda } from './PosterAgenda'
import { PosterFooter } from './PosterFooter'
import { PosterHeader } from './PosterHeader'
import { PosterSidebar } from './PosterSidebar'

export const AgendaPoster = forwardRef(function AgendaPoster({ posterData }, ref) {
  return (
    <article ref={ref} className={`agenda-poster density-${posterData.density}`} data-density={posterData.density}>
      <PosterHeader metadata={posterData.posterMetadata} />
      <div className="poster-body">
        <PosterSidebar metadata={posterData.posterMetadata} sidebar={posterData.sidebar} />
        <PosterAgenda posterData={posterData} />
      </div>
      <PosterFooter />
    </article>
  )
})
