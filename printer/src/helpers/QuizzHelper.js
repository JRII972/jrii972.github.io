class Réponse {
    constructor({text, réponse, value, id, next}){
        this.text = text
        this.réponse = réponse
        this.value = value
        this.id = id
        this.next = next

        if ( this.value > 0 ) {
            this.good = true
        } else {
            this.good = false
        }
    }
}

export class Question {
    constructor({
        id, question, type, réponse, content, text
    }){
        this.id = id
        this.question = question
        this.type = type
        this.content = content
        this.réponse = []
        this.text = text
        for (let index = 0; index < réponse.length; index++) {
            réponse[index].id = index;
            const element = new Réponse(réponse[index])
            this.réponse.push(element)
            if ( element.réponse ) {
                this.bonneRéponseID = index
            }
        }
    }
}