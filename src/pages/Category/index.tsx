import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Header, PageContentContainer, Loading } from "@components"
import useIsMobile from "@hooks/useIsMobile"
import { CategoryWithFlashcards } from "@interfaces/category"
import { Flashcard } from "@interfaces/flashcard"
import { Grid } from "@material-ui/core"
import CategorySkeleton from "@pages/Category/CategorySkeleton"
import DesktopFilters from "@pages/Category/DesktopFilters"
import FlashcardCard from "@pages/Category/FlashcardCard"
import FlashcardDialog from "@pages/Category/FlashcardDialog"
import MobileFilters from "@pages/Category/MobileFilters"
import categoryService from "@services/category"
import errorService from "@services/error"
import flashcardService, { CreateFlashcardInput } from "@services/flashcard"
import handleBackButton, { newStateName } from "@utils/handleBackButton"
import { removeAccents } from "@utils/removeAccents"
import stringToBoolean from "@utils/stringToBoolean"

async function getCategory(categoryId: number) {
  try {
    return categoryService.retrieveOne(categoryId)
  } catch (err) {
    errorService.handle(err)
    return null
  }
}

export type FilterValue = "both" | "false" | "true"

export type Filters = {
  isKnown: FilterValue
  isBookmarked: FilterValue
}

type Dialog = "create" | "edit"

const Categories: React.FC = () => {
  const [category, setCategory] = useState<CategoryWithFlashcards | null>()
  const [openDialog, setOpenDialog] = useState<Dialog | null>(null)
  const [searchText, setSearchText] = useState("")
  const [filters, setFilters] = useState<Filters>({
    isKnown: "both",
    isBookmarked: "both",
  })
  const [
    currentFlashcardOnEdition,
    setCurrentFlashcardOnEdition,
  ] = useState<Flashcard>()
  const [loading, setLoading] = useState(true)

  const isMobile = useIsMobile()

  const { id: categoryId } = useParams<{ id: string }>()

  function handleCloseDialog() {
    setOpenDialog(null)

    if (window.history.state === newStateName) {
      window.history.back()
    }
  }

  function handleOpenDialog(dialog: Dialog) {
    setOpenDialog(dialog)

    handleBackButton(handleCloseDialog)
  }

  function insertFlashcardOnCategory(createdFlashcard: Flashcard) {
    if (!category) {
      return
    }

    const updatedFlashcards = [...category?.flashcards, createdFlashcard]

    setCategory({
      ...category,
      flashcards: updatedFlashcards,
    })
  }

  async function handleCreateFlashcard(flashcardData: CreateFlashcardInput) {
    try {
      const createdFlashcard = await flashcardService.create(
        +categoryId,
        flashcardData
      )
      insertFlashcardOnCategory(createdFlashcard)
    } catch (err) {
      errorService.handle(err)
    }
  }

  function handleClickEditFlashcard(flashcard: Flashcard) {
    setCurrentFlashcardOnEdition(flashcard)
    handleOpenDialog("edit")
  }

  function updateFlashcardOnCategory(updatedFlashcard: Flashcard) {
    if (!category) {
      return
    }

    const updatedFlashcards = category?.flashcards.map((flashcard) => {
      if (flashcard.id === updatedFlashcard.id) {
        return updatedFlashcard
      }

      return flashcard
    })

    setCategory({
      ...category,
      flashcards: updatedFlashcards,
    })
  }

  async function handleEditFlashcard(flashcardData: CreateFlashcardInput) {
    const flashcardId = currentFlashcardOnEdition?.id

    if (flashcardId) {
      try {
        const updatedFlashcard = await flashcardService.update(
          +flashcardId,
          flashcardData
        )
        updateFlashcardOnCategory(updatedFlashcard)
      } catch (err) {
        errorService.handle(err)
      }
    }
  }

  async function handleToggleIsFlashcardKnown(flashcard: Flashcard) {
    try {
      const updatedFlashcard = await flashcardService.update(flashcard.id, {
        isKnown: !flashcard.isKnown,
      })
      updateFlashcardOnCategory(updatedFlashcard)
    } catch (err) {
      errorService.handle(err)
    }
  }

  async function handleToggleIsFlashcardBookmarked(flashcard: Flashcard) {
    try {
      const updatedFlashcard = await flashcardService.update(flashcard.id, {
        isBookmarked: !flashcard.isBookmarked,
      })
      updateFlashcardOnCategory(updatedFlashcard)
    } catch (err) {
      errorService.handle(err)
    }
  }

  function deleteFlashcardOnCategory(deletedFlashcard: Flashcard) {
    if (!category) {
      return
    }

    const updatedFlashcards = category.flashcards.filter(
      (card) => card.id !== deletedFlashcard.id
    )

    setCategory({
      ...category,
      flashcards: updatedFlashcards,
    })
  }

  async function handleDeleteFlashcard(flashcard: Flashcard) {
    try {
      deleteFlashcardOnCategory(flashcard)
      await flashcardService.delete(flashcard.id)
    } catch (err) {
      errorService.handle(err)
    }
  }

  function filterFlashcards(flashcard: Flashcard) {
    const normalizedQuestion = removeAccents(flashcard.question.toLowerCase())
    const normalizedId = flashcard.id.toString()
    const normalizedAnswer = removeAccents(flashcard.answer.toLowerCase())
    const normalizedSearchText = removeAccents(searchText.toLowerCase())

    // Remove flashcards that not match search text
    if (
      !(
        normalizedId.includes(normalizedSearchText) ||
        normalizedQuestion.includes(normalizedSearchText) ||
        normalizedAnswer.includes(normalizedSearchText)
      )
    ) {
      return false
    }

    if (filters.isKnown !== "both") {
      if (flashcard.isKnown !== stringToBoolean(filters.isKnown)) {
        return false
      }
    }

    if (filters.isBookmarked !== "both") {
      if (flashcard.isBookmarked !== stringToBoolean(filters.isBookmarked)) {
        return false
      }
    }

    return true
  }

  useEffect(() => {
    async function getAndUpdateCategory() {
      setLoading(true)

      const categoryData = await getCategory(+categoryId)
      setCategory(categoryData)

      setLoading(false)
    }

    getAndUpdateCategory()
  }, [categoryId])

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header
          title={category?.name}
          goBackTo="/categories"
          fabFn={() => handleOpenDialog("create")}
        >
          {isMobile ? (
            <MobileFilters
              searchText={searchText}
              setSearchText={setSearchText}
              filters={filters}
              setFilters={setFilters}
            />
          ) : (
            <DesktopFilters
              searchText={searchText}
              setSearchText={setSearchText}
              filters={filters}
              setFilters={setFilters}
            />
          )}
        </Header>
      </Grid>

      <Grid item xs={12}>
        <PageContentContainer>
          <Loading
            loading={loading}
            customLoadingElement={<CategorySkeleton />}
          >
            <Grid container spacing={2} alignItems="stretch">
              {category?.flashcards
                ?.filter(filterFlashcards)
                ?.map((flashcard) => (
                  <Grid key={flashcard.id} item md={4} sm={6} xs={12}>
                    <FlashcardCard
                      key={flashcard.id}
                      flashcard={flashcard}
                      handleClickEdit={handleClickEditFlashcard}
                      handleClickDelete={handleDeleteFlashcard}
                      handleClickMarkAsKnown={handleToggleIsFlashcardKnown}
                      handleClickMarkAsBookmarked={
                        handleToggleIsFlashcardBookmarked
                      }
                    />
                  </Grid>
                ))}
            </Grid>
          </Loading>

          <FlashcardDialog
            title="Add flashcard"
            open={openDialog === "create"}
            onClose={handleCloseDialog}
            onOk={handleCreateFlashcard}
            okButtonLabel="add"
          />

          <FlashcardDialog
            title="Edit flashcard"
            open={openDialog === "edit"}
            onClose={handleCloseDialog}
            onOk={handleEditFlashcard}
            okButtonLabel="save"
            initialValues={{
              question: currentFlashcardOnEdition?.question || "",
              answer: currentFlashcardOnEdition?.answer || "",
            }}
          />
        </PageContentContainer>
      </Grid>
    </Grid>
  )
}

export default Categories
