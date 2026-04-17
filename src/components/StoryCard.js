"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function StoryCard({ card, isUnlocked, unlock }) {
  const [open, setOpen] = useState(false)
  const [story, setStory] = useState(null)
  const [currentNode, setCurrentNode] = useState("start")
  const [loading, setLoading] = useState(false)

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
    }

    setLoading(false)
  }

  const handleChoice = (next) => {
    const node = story[next]

    if (node.end) {
      setTimeout(() => {
        unlock(card.id)
        setOpen(false)
      }, 800)
    }

    setCurrentNode(next)
  }

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
          Empezar
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
              <p className="story-text">
                {story[currentNode].text}
              </p>

              <div className="story-choices">
                {story[currentNode].choices?.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(choice.next)}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>

              {story[currentNode].end && (
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