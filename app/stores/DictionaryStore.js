
import {observable,action,computed} from 'mobx'
import {toJS} from 'mobx'

export class DictionaryStore {
    @observable wordbookID = 0;
    @observable wordID = 0;
    @observable wordbook = [];

    addNewWordbook(title){
        this.wordbook.push(
            {
                id:this.wordbookID++,
                title:title,
                wordList:[]
            }
        )
    }

    addNewWord(wordbookID,word,mean){
        this.wordbook.map((wordbook) => {
            if(wordbook.id === wordbookID){
                wordbook.wordList.push(
                    {
                        id:this.wordID++,
                        word:word,
                        mean:mean,
                        totalSolved:0,
                        totalCorrect:0,
                        markedImportant:false,
                    }
                )
            }
        });
    }

    reviseWord(wordbookID,wordID,newWord,newMean){
        for(let i=0;i<this.wordbook.length;i++) {
            if (this.wordbook[i].id === wordbookID) {
                for (let j = 0; j < this.wordbook[i].wordList.length; j++) {
                    if(this.wordbook[i].wordList[j].id === wordID){
                        this.wordbook[i].wordList[j].word = newWord;
                        this.wordbook[i].wordList[j].mean = newMean;
                    }
                }
            }
        }
    }


    getWordbookById(wordbookID){
        for(let i=0;i<this.wordbook.length;i++){
            if(wordbookID === this.wordbook[i].id){
                return toJS(this.wordbook[i]);
            }
        }
        return undefined;
    }

    getWordbookIndexById(wordbookID){
        for(let i=0;i<this.wordbook.length;i++){
            if(wordbookID === this.wordbook[i].id){
                return i;
            }
        }
        return undefined;
    }


    getWordIndexById(wordbookID,wordID){
        for(let i=0;i<this.wordbook.length;i++){
            for(let j=0;j<this.wordbook[i].wordList.length;j++){
                if(this.wordbook[i].wordList[j].id === wordID){
                    return i;
                }
            }
        }
        this.wordbook.map((wordbook)=>{
            if(wordbook.id === wordbookID){
                for(let i=0;i<wordbook.wordList.length;i++){

                }
                return undefined;
            }
        })
    }


    deleteWordbook(wordbookID){
        if(this.wordbook.length===1){return}
        let index = -1;
        for(let i=0;i<this.wordbook.length;i++){
            if(this.wordbook[i].id === wordbookID){
                index = i;
                break;
            }
        }
        if(index === -1)return;
        this.wordbook.splice(index,1);
    }

    deleteWord(wordbookID,wordID){
        this.wordbook.map((wordbook)=>{
            if(wordbook.id === wordbookID){
                let index = -1;
                for(let i=0;i<wordbook.wordList.length;i++){
                    if(wordbook.wordList[i].id === wordID){
                        index = i;
                        break;
                    }
                }
                if(index === -1)return;
                wordbook.wordList.splice(index,1);
            }
        })
    }

    getAlphabeticalWordbook(wordbookID){
        let index = -1;
        for(let i=0;i<this.wordbook.length;i++) {
            if (this.wordbook[i].id === wordbookID) {
                index = i;
            }
        }
        return toJS(this.wordbook[index].wordList).sort((word1,word2)=>{
            if(word1.word.toLowerCase() < word2.word.toLowerCase()) return -1;
            if(word1.word.toLowerCase() > word2.word.toLowerCase()) return 1;
            return 0;
        })

    }

    setWordImportant(wordbookID,wordID,markImportant){
        this.wordbook.map((wordbook)=>{
            if(wordbook.id === wordbookID){
                for(let i=0;i<wordbook.wordList.length;i++){
                    if(wordbook.wordList[i].id === wordID){
                        wordbook.wordList[i].markedImportant = markImportant;
                    }
                }
            }
        })
    }

    clear(){
        this.wordbookID = 0;
        this.wordID = 0;
        this.wordbook = [];
    }
}