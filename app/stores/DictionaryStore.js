
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

    getWordbookById(wordbookID){
        for(let i=0;i<this.wordbook.length;i++){
            if(wordbookID === this.wordbook[i].id){
                return toJS(this.wordbook[i]);
            }
        }
        return undefined;
    }

    deleteWordbook(wordbookID){
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

    clear(){
        this.wordbookID = 0;
        this.wordID = 0;
        this.wordbook = [];
    }
}