import React, { useEffect, useState } from "react"

import { CategoryWithFlashcards } from "@interfaces/category"
import { Flashcard } from "@interfaces/flashcard"
import { Button, Container, Grid, Modal } from "@material-ui/core"
import FlashcardCard from "@pages/Category/FlashcardCard"
import useStyles from "@pages/Category/StudyMode/styles"

type StudyModeProps = {
  category: CategoryWithFlashcards
  active: boolean
  onClose: () => void
  handleClickMarkAsKnown: (flashcard: Flashcard) => Promise<void>
  handleClickMarkAsBookmarked: (flashcard: Flashcard) => Promise<void>
}

const StudyMode: React.FC<StudyModeProps> = ({
  category,
  active,
  onClose,
  handleClickMarkAsBookmarked,
  handleClickMarkAsKnown,
}) => {
  const [flashcardsInRandomOrder, setFlashcardsInRandomOrder] = useState<
    Flashcard[]
  >([])
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const classes = useStyles()

  function handleNextFlashcard() {
    const flashcardsCount = flashcardsInRandomOrder.length
    const newIndex = (currentFlashcardIndex + 1) % flashcardsCount
    setCurrentFlashcardIndex(newIndex)
  }

  useEffect(() => {
    const unknownFlashcards = category.flashcards.filter(
      (flashcard) => !flashcard.isKnown
    )

    setFlashcardsInRandomOrder(unknownFlashcards)
  }, [category])

  return (
    <Modal open={active} onClose={onClose} className={classes.modal}>
      <Container maxWidth="xs" disableGutters>
        <Grid
          container
          direction="column"
          alignItems="stretch"
          spacing={2}
          style={{ width: "100%" }}
        >
          <Grid item>
            <FlashcardCard
              flashcard={category.flashcards[currentFlashcardIndex]}
              handleClickMarkAsBookmarked={handleClickMarkAsBookmarked}
              handleClickMarkAsKnown={handleClickMarkAsKnown}
            />
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextFlashcard}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Modal>
  )
}

export default StudyMode
