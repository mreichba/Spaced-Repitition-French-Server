const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LL = require('./LinkedList')

const languageRouter = express.Router()
const jsonBodyParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const head = await LanguageService.getLanguageHead(
        req.app.get('db'),
        req.language.id
      )

      res.json({
        nextWord: head.original,
        wordCorrectCount: head.correct_count,
        wordIncorrectCount: head.incorrect_count,
        totalScore: head.total_score
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    try {
      const { guess } = req.body

      if (!guess) {
        return res.status(400).json({
          error: `Missing 'guess' in request body`
        })
      }

      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      )

      if (!words) {
        res.status(400).json({
          error: `You don't have any words`
        })
      }

      const LL = LanguageService.getLinkedList(words, req.language.head)

      const isCorrect = guess === LL.head.word.translation
      const {
        wordCorrectCount,
        wordIncorrectCount,
        answer
      } = await LanguageService.updateLinkedList(LL, isCorrect)

      const updatedTotalScore = isCorrect
        ? req.language.total_score + 1
        : req.language.total_score - 1 < 0
          ? 0
          : req.language.total_score - 1

      await LanguageService.updateLanguageHead(
        req.app.get('db'),
        req.language.id,
        LL.head.word.id,
        updatedTotalScore
      )

      await LanguageService.updateLanguageWords(req.app.get('db'), LL)

      const newHead = await LanguageService.getLanguageHead(
        req.app.get('db'),
        req.language.id
      )

      res.json({
        nextWord: newHead.original,
        totalScore: newHead.total_score,
        wordCorrectCount,
        wordIncorrectCount,
        answer,
        isCorrect
      })

      next()
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter
