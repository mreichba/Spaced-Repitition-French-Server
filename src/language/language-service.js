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
}

module.exports = LanguageService
