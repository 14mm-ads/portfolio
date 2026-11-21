import { useEffect, useRef, useState } from 'react'
import { Clapperboard, Play, X } from 'lucide-react'
import { siteConfig } from '../config/site'
import { assetUrl } from '../lib/assetUrl'

type Props = { open: boolean; onClose: () => void }

export default function ShowreelDialog({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) {
      videoRef.current?.pause()
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      if (dialogRef.current?.open) dialogRef.current.close()
      onClose()
    }
    document.addEventListener('keydown', closeOnEscape, true)
    return () => document.removeEventListener('keydown', closeOnEscape, true)
  }, [open, onClose])

  return (
    <dialog
      ref={dialogRef}
      className="showreel-dialog"
      aria-labelledby="showreel-heading"
      onCancel={(event) => {
        event.preventDefault()
        if (dialogRef.current?.open) dialogRef.current.close()
        onClose()
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
    >
      <div className="dialog-top">
        <div>
          <p className="eyebrow">14MM / THE SHOWREEL</p>
          <h2 id="showreel-heading">A few seconds in our world.</h2>
        </div>
        <button className="dialog-close" type="button" onClick={onClose} aria-label="Close showreel"><X /></button>
      </div>
      <div className="showreel-stage">
        <img src={assetUrl('/images/archive-cover.svg')} alt="" />
        <video
          ref={videoRef}
          src={assetUrl('/videos/showreel.mp4')}
          poster={assetUrl('/images/archive-cover.svg')}
          controls
          playsInline
          muted
          preload="none"
          onError={() => setError(true)}
          aria-label="14mm demo showreel. Muted by default."
        >
          Your browser does not support embedded video.
        </video>
        <span className="showreel-placeholder"><Clapperboard size={17} /> {error ? 'SHOWREEL FILE NOT FOUND' : 'DEMO SHOWREEL PLACEHOLDER'}</span>
      </div>
      <div className="dialog-caption">
        <p>{error ? 'Place your approved MP4 at public/videos/showreel.mp4 to enable playback.' : 'Muted preview · Use player controls to start and enable sound.'}</p>
        <a href={`mailto:${siteConfig.contact.email}?subject=Showreel%20request`}>Request a viewing <Play size={14} /></a>
      </div>
    </dialog>
  )
}
