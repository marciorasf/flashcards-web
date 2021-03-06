import { Flashcard } from "@interfaces/flashcard"
import apiService from "@services/api"

export type CreateFlashcardInput = {
  question: string
  answer: string
}

type CreateFlashcardResponse = {
  flashcard: Flashcard
}

type RetrieveAllFlashcardsResponse = {
  flashcards: Flashcard[]
}

type RetrieveOneFlashcardResponse = {
  flashcard: Flashcard
}

export type UpdateFlashcardInput = Partial<CreateFlashcardInput> & {
  isKnown?: boolean
  isBookmarked?: boolean
}

type UpdateFlashcardResponse = CreateFlashcardResponse

const flashcardService = {
  async create(categoryId: number, inputData: CreateFlashcardInput) {
    const response = await apiService.post("flashcards", {
      ...inputData,
      categoryId,
    })
    const data = response.data as CreateFlashcardResponse
    return data.flashcard
  },

  async retrieveAll() {
    const response = await apiService.get("flashcards")
    const data = response.data as RetrieveAllFlashcardsResponse
    return data.flashcards
  },

  async retrieveOne(flashcardId: number) {
    const response = await apiService.get(`flashcards/${flashcardId}`)
    const data = response.data as RetrieveOneFlashcardResponse
    return data.flashcard
  },

  async update(flashcardId: number, inputData: UpdateFlashcardInput) {
    const response = await apiService.put(
      `flashcards/${flashcardId}`,
      inputData
    )
    const data = response.data as UpdateFlashcardResponse
    return data.flashcard
  },

  async delete(flashcardId: number) {
    await apiService.delete(`flashcards/${flashcardId}`)
  },
}

export default flashcardService
