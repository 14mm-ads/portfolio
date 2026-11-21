import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Clapperboard, LoaderCircle, Play } from 'lucide-react'
import type { DemoProject } from '../data/projects'
import { siteConfig } from '../config/site'
import { assetUrl } from '../lib/assetUrl'

type Props = { project: DemoProject }

export default function VideoPlayer({ project }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const isDemo = project.isDemo !== false

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause()
      },
      { threshold: 0.05 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [project.slug])

  if (!project.videoSrc) {
    return (
      <div className={`film-stage film-stage-${project.orientation.toLowerCase()}`}>
        <img className="film-poster" src={assetUrl(project.posterSrc)} alt={`${project.title} ${isDemo ? 'demo ' : ''}poster`} />
        <div className="film-poster-overlay" />
        <div className="film-unavailable">
          <span><Clapperboard size={16} /> {isDemo ? 'DEMO FILM FILE NOT ADDED' : 'PROJECT VIDEO NOT ADDED'}</span>
          <p>Replace the sample source<br />to preview this project.</p>
          <a href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(`${isDemo ? 'Demo project' : 'Project'} video — ${project.brand}`)}`}>
            {isDemo ? 'Video setup guide' : 'Contact the studio'} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`film-stage film-stage-${project.orientation.toLowerCase()}`}>
      <img className="film-poster" src={assetUrl(project.posterSrc)} alt="" />
      <video
        ref={videoRef}
        className={`film-player${status === 'ready' ? ' video-ready' : ''}`}
        src={assetUrl(project.videoSrc)}
        poster={assetUrl(project.posterSrc)}
        controls
        playsInline
        preload="metadata"
        muted
        onLoadStart={() => setStatus('loading')}
        onCanPlay={() => setStatus('ready')}
        onError={() => setStatus('error')}
        onPlay={() => {
          document.querySelectorAll<HTMLVideoElement>('.film-player').forEach((video) => {
            if (video !== videoRef.current) video.pause()
          })
        }}
        aria-label={`${project.title} ${isDemo ? 'demo ' : ''}video. Starts muted; use the player controls to unmute.`}
      >
        {project.captionSrc && <track kind="captions" src={assetUrl(project.captionSrc)} srcLang={project.language.toLowerCase().slice(0, 2)} label={project.language} default />}
        Your browser does not support the video element.
      </video>
      {status === 'idle' && (
        <button className="video-cover" type="button" onClick={() => {
          setStatus('loading')
          void videoRef.current?.play().catch(() => setStatus('error'))
        }} aria-label={`Play ${project.title} ${isDemo ? 'demo ' : ''}video, muted`}>
          <span><Play size={18} fill="currentColor" /> Play video</span>
        </button>
      )}
      {status === 'loading' && <div className="video-status" role="status"><LoaderCircle className="spinner" size={20} /> Loading preview…</div>}
      {status === 'error' && (
        <div className="video-error" role="alert">
          <AlertCircle size={20} />
          <span>Preview unavailable. Check the video source at <code>{project.videoSrc}</code>.</span>
        </div>
      )}
    </div>
  )
}
