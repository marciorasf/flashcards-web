import React, { useState, ChangeEvent, FormEvent } from "react"
import { useHistory } from "react-router-dom"

import api from "../../api"

import { Container, Content, QuestionTextarea, AnswerTextarea, ButtonsContainer, CancelButton, AddCardButton } from "./styles"

const emptyFlashcard = {
  question: "",
  answer: ""
}

// TODO remove this mock
const user_id = 1

export default function CreateFlashcard() {

  const history = useHistory()

  const [flashcard, setFlashcard] = useState(emptyFlashcard)

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFlashcard({
      ...flashcard,
      [name]: value
    })
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload = {
      user_id,
      ...flashcard
    }

    try {
      const response = await api.post("/flashcard", payload);
      alert(`Card ${response?.data?.flashcard_id} created`)
    } catch (error) {
      console.log({ error })
      alert("Could not create card")
    }
  }

  function handleGoBack() {
    history.push("/study");
  }

  return (
    <Container>
      <Content>
        <form onSubmit={handleFormSubmit}>
          <QuestionTextarea label="Question" name="question" onChange={handleInputChange} />
          <AnswerTextarea label="Answer" name="answer" onChange={handleInputChange} />
          <ButtonsContainer>
            <CancelButton type="button" onClick={handleGoBack}>
              Cancel
            </CancelButton>

            <AddCardButton type="submit">
              Add card
            </AddCardButton>
          </ButtonsContainer>
        </form>
      </Content>
    </Container>
  )
}