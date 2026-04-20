"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function StoryCard({ card, isUnlocked, unlock }) {
  const [open, setOpen] = useState(false)
  const [story, setStory] = useState(null)
  const [currentNode, setCurrentNode] = useState("start")
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  if (isUnlocked) return null

  const loadStory = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("id", card.story_id)
      .single()

    if (!error) {
      setStory(data.nodes)
      setCurrentNode("start")
      setHistory([])
    }

    setLoading(false)
  }

  const handleChoice = (next) => {
    const node = story[next]

    setHistory((prev) => [...prev, currentNode])
    setCurrentNode(next)

    if (node?.end) {
      setTimeout(() => {
        unlock(card.id)
      }, 800)
    }
  }

  const goBack = () => {
    if (!history.length) return

    const prev = [...history]
    const last = prev.pop()

    setHistory(prev)
    setCurrentNode(last)
  }

  const node = story?.[currentNode]

  return (
    <>
      <div className="game-card">
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

      {open && story && node && (
        <div className="modal-overlay">
          <div className="modal story-modal">
            <div className="modal-header">
              <h2>{story.title || "Historia"}</h2>

              <button className="close" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="story-content">
              <p className="story-text">
                {node.text}
              </p>

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

              <div className="story-actions">
                {history.length > 0 && !node.end && (
                  <button
                    className="story-back"
                    onClick={goBack}
                  >
                    ← Volver
                  </button>
                )}
              </div>

              {node.end && (
                <div className="story-end">
                  🎉 Fin de la historia
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}