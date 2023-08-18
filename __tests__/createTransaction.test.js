import { readFileSync } from 'fs'
import { JSDOM } from 'jsdom'

const html = readFileSync('dist/index.html')
// const script = fs.readFileSync('dist/script.js')

describe('Create Transaction - Test Suite', () => {
  let dom,
    document,
    createTransactionButton,
    modalOverlay,
    cancelTransactionCreationButton

  beforeEach(() => {
    dom = new JSDOM(html)
    document = dom.window.document

    createTransactionButton = document.querySelector('#createTransactionButton')
    modalOverlay = document.querySelector('.modal-overlay')
    cancelTransactionCreationButton = document.querySelector(
      '#cancelTransactionCreationButton'
    )
  })

  test('O usuário inicia o fluxo de criação de uma transação, mas cancela a operação', async () => {
    createTransactionButton.click()

    console.log(Array.from(modalOverlay.classList))
    console.log(createTransactionButton)
    console.log(createTransactionButton.toString())

    console.log(modalOverlay)
    console.log(String(modalOverlay))
    const modalIsActive = Array.from(modalOverlay.classList).includes('active')
    console.log(modalIsActive)
  })
})
