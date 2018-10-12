
import {clearState, retrieveState, saveState} from "../functions/storage";
import {observable,action,computed} from 'mobx'
import {toJS} from 'mobx'

export class DictionaryStore {
    @observable wordbookID = 0;
    @observable wordID = 0;
    @observable wordbook = [];

    retrieveFromDatabase(wordbookID,wordID,wordbook){
        this.wordbookID=wordbookID;
        this.wordID=wordID;
        this.wordbook.clear();
        console.log("check if wordbook is empty",toJS(this.wordbook));
        for(let i=0;i<wordbook.length;i++){
            this.wordbook.push(wordbook[i]);
        }
    }

    addNewWordbook(title){
        this.wordbook.push(
            {
                id:this.wordbookID++,
                title:title,
                wordList:[]
            }
        );
        saveState().then(()=>{console.log("wordbook "+title+" saved")});
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
        saveState().then(()=>{console.log("word "+word+" saved")});
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
        saveState().then(()=>{console.log("word "+newWord+" saved")});
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


    //첫 번째 단어장부터 하나씩 검색해 단어가 하나라도 있는 단어장을 불러옴. 없으면 -1 리턴
    getAnyWordbookHasWord(){
        for(let i=0;i<this.wordbook.length;i++){
            console.log("mo",i);
            if(this.wordbook[i].wordList.length !== 0){
                return this.wordbook[i].id;
            }
        }
        return -1;
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
        let index = -1;
        for(let i=0;i<this.wordbook.length;i++){
            if(this.wordbook[i].id === wordbookID){
                index = i;
                break;
            }
        }
        if(index === -1)return;
        this.wordbook.splice(index,1);
        saveState().then(()=>{console.log("wordbookID "+wordbookID+" deleted")});
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
        });
        saveState().then(()=>{console.log("wordID "+wordID+" deleted")});
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
        });
        saveState().then(()=>{console.log("wordID "+wordID+" has been set important")});
    }

    setWordSolvedCount(wordbookID,wordID,correct){
        this.wordbook.map((wordbook)=>{
            if(wordbook.id === wordbookID){
                for(let i=0;i<wordbook.wordList.length;i++){
                    if(wordbook.wordList[i].id === wordID){
                        wordbook.wordList[i].totalSolved = wordbook.wordList[i].totalSolved + 1;
                        if(correct){
                            wordbook.wordList[i].totalCorrect = wordbook.wordList[i].totalCorrect + 1;
                        }
                    }
                }
            }
        });
        saveState().then(()=>{console.log("wordID "+wordID+" solved count modified")});
    }

    clear(){
        this.wordbookID = 0;
        this.wordID = 0;
        this.wordbook = [];
        clearState().then(()=>{console.log("storage cleared!")});
    }
}