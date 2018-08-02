
import {observable,action,computed} from 'mobx'
import {toJS} from 'mobx'

export class UserStore{
    @observable userSerialNumber = "";  //For future model
    @observable userName = "";
    @observable totalSolved = 0;
    @observable totalCorrect = 0;

    setUserName(name){
        this.userName = name;
    }

    addSolvedValue(thisPhaseTotalSolved, thisPhaseTotalCorrect){
        this.totalSolved += thisPhaseTotalSolved;
        this.totalCorrect += thisPhaseTotalCorrect;
    }

    @computed get getCorrectPercent(){
        return this.totalCorrect/this.totalSolved;
    }
}