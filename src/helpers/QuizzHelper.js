class Réponse {
    constructor({text, réponse, value, id}){
        this.text = text
        this.réponse = réponse
        this.value = value
        this.id = id
    }
}

export class Question {
    constructor({
        id, question, type, réponse, content
    }){
        this.id = id
        this.question = question
        this.type = type
        this.content = content
        this.réponse = []
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