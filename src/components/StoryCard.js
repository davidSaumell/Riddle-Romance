"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

export default function StoryCard({ card, isUnlocked, unlock }) {
  const [open, setOpen] = useState(false)
  const [story, setStory] = useState(null)
  const [currentNode, setCurrentNode] = useState("start")
  const [loading, setLoading] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [gallery, setGallery] = useState([])
  const [photoIndex, setPhotoIndex] = useState(0)
  const [photoFade, setPhotoFade] = useState(false)
  const [galleryLoading, setGalleryLoading] = useState(false)

  useEffect(() => {
    if (!gallery.length) return
    const next = gallery[(photoIndex + 1) % gallery.length]
    const prev = gallery[(photoIndex - 1 + gallery.length) % gallery.length]
    
    preloadImage(next)
    preloadImage(prev)
  }, [photoIndex, gallery])

  if (isUnlocked) return null
  
  const loadStory = async () => {
    setLoading(true)

    const { data } = await supabase
      .from("stories")
      .select("*")
      .eq("id", card.story_id)
      .single()

    if (data) {
      setStory(data.nodes)
      setCurrentNode("start")
    }

    setLoading(false)
  }

  const node = story?.[currentNode]

  const handleChoice = (next) => {
    setCurrentNode(next)
  }

  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.src = src
      img.onload = resolve
      img.onerror = reject
    })
  }

  const changePhoto = async (direction) => {
    const nextIndex = (() => {
      if (direction === "next") {
        return photoIndex === gallery.length - 1 ? 0 : photoIndex + 1
      } else {
        return photoIndex === 0 ? gallery.length - 1 : photoIndex - 1
      }
    })()

    setPhotoFade(true)

    const nextSrc = gallery[nextIndex]

    try {
      await preloadImage(nextSrc)
    } catch (e) {
      console.error("Error precargando imagen", e)
    }

    setPhotoIndex(nextIndex)

    setPhotoFade(false)
  }

  const loadGallery = async () => {
    const folders = node?.folders || []
    if (!folders.length) return

    setGallery([])
    setPhotoIndex(0)
    setGalleryOpen(true)
    setGalleryLoading(true)

    try {
      const allImages = []

      for (const folder of folders) {
        const res = await fetch(`/story/${folder}/index.json`)
        const files = await res.json()

        files.forEach((file) => {
          allImages.push(`/story/${folder}/${file}`)
        })
      }

      setGallery(allImages)
    } catch (error) {
      console.error(error)
    }

    setGalleryLoading(false)
  }

  return (
    <>
      <div className="game-card story-card">
        <h3>Historia final</h3>
        <p>Descubre el desenlace</p>

        <button
          onClick={() => {
            loadStory()
            setOpen(true)
          }}
        >
          {loading ? "Cargando..." : "Empezar"}
        </button>
      </div>

      {open && story && (
        <div className="modal-overlay">
          <div className="modal story-modal">
            <div className="modal-header">
              <h2>Historia</h2>

              <button className="close" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="story-content">
              <p className="story-text">{node.text}</p>

              {node.choices?.length > 0 && (
                <div className="story-divider">
                  <span className="story-divider-icon">✦</span>
                </div>
              )}

              <div className="story-choices">
                {node.choices?.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(choice.next)}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>

              {node.end && (
                <div className="story-end">
                  <div>🎉 Final de la història</div>

                  <button
                    className="story-gallery-btn"
                    onClick={loadGallery}
                  >
                    {galleryLoading
                      ? "Cargando fotos..."
                      : "Veure la història amb fotos"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {galleryOpen && (
        <div className="modal-overlay">
          <div className="modal photo-modal">
            <div className="modal-header">
              <h2>Records 📸</h2>

              <button
                className="close"
                onClick={() => {
                  unlock(card.id)
                  setGalleryOpen(false)
                  setOpen(false)
                }}
              >
                ✕
              </button>
            </div>

            <div className="photo-viewer">
              {galleryLoading && gallery.length === 0 ? (
                <div className="gallery-loader">
                  Cargando recuerdos...
                </div>
              ) : (
                <Image
                  src={gallery[photoIndex]}
                  alt="Foto historia"
                  width={420}
                  height={420}
                  className={`story-photo ${photoFade ? "fade-out" : "fade-in"}`}
                  onLoadingComplete={() => setPhotoFade(false)}
                />
              )}
            </div>

            <div className="photo-controls">
              <button onClick={() => changePhoto("prev")}>
                ←
              </button>

              <span className="photo-counter">
                {String(photoIndex + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
              </span>

              <button onClick={() => changePhoto("next")}>
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}