const LinkedList = require('./LinkedList')

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  updateLanguageWords(db, list) {
    return db.transaction(async trx => {
      let currentNode = list.headId
      
      while (currentNode !== null) {
        await trx
          .from('word')
          .where('id', currentNode.word.id)
          .update({
            memory_value: currentNode.word.memory_value,
            correct_count: currentNode.word.correct_count,
            incorrect_count: currentNode.word.incorrect_count,
            next: currentNode.word.next
          })
          currentNode = currentNode.next
      }
    })
  },

  getLanguageHead(db, id) {
    return db
      .from('language')
      .where('language.id', id)
      .join('word', 'language.head', '=', 'word.id')
      .select(
        'word.original',
        'word.translation',
        'word.correct_count',
        'word.incorrect_count',
        'language.total_score'
      )
      .first()
  },

  updateLanguageHead(db, langId, newHeadId, updatedTotalScore) {
    return db
      .from('language')
      .where('id', langId)
      .update({
        head: newHeadId,
        total_score: updatedTotalScore
      })
  },

  getLinkedList(words, headId) {
    const LL = new LinkedList()

    let nextId = headId

    while (nextId !== null) {
      for (let i = 0; i < words.length; i++) {
        if (words[i].id === nextId) {
          nextId = words[i].next
          LL.insert(words[i])
        }
      }
    }

    return LL
  },

  updateLinkedList(list, correct) {
    const { word } = list.head
    if (correct) {
      word.correct_count += 1
      word.memory_value *= 2
    } else {
      word.incorrect_count += 1
      word.memory_value = 1
    }

    list.shiftHead(word.memory_value)

    return {
      wordCorrectCount: word.correct_count,
      wordIncorrectCount: word.incorrect_count,
      answer: word.translation
    }
  }
}

module.exports = LanguageService
