class _Node {
    constructor(word, next) {
        this.word = word
        this.next = next
    }
}

class LinkedList {
    constructor() {
        this.head = null
    }

    insert(word) {
        if (this.head === null) {
            this.head = new _Node(word, null)
            return
        }

        let currentNode = this.head
        
        while (currentNode.next !== null) {
            currentNode = currentNode.next
        }

        currentNode.next = new _Node(word, null)
    }

    shiftHead(shift) {
        const headWord = this.head.word

        let currentNode = this.head
        let schwifty = shift

        while (currentNode.next !== null && schwifty !== 0) {
            currentNode = currentNode.next
            schwifty--
        }

        if (currentNode.next === null) {
            headWord.next = null
        } else {
            headWord.next = currentNode.next.word.id
        }

        currentNode.next = new _Node(headWord, currentNode.next) 
        currentNode.word.next = headWord.id

        this.head = this.head.next
    }
}

module.exports = LinkedList