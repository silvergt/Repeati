
class DictionaryStore {
    wordbookID = 0;
    wordID = 0;
    wordbook = [
        {
            id:0,
            title:"TITLE",
            wordList:[
                {
                    id:0,
                    word:"word",
                    mean:"mean",
                    totalSolved:0,
                    totalCorrect:0,
                    markedImportant:false,
                },
                {
                    id:1,
                    word:"word",
                    mean:"mean",
                    totalSolved:0,
                    totalCorrect:0,
                    markedImportant:false,
                }
            ]
        },
        {
            id:1,
            title:"TITLE",
            wordList:[
                {
                    id:2,
                    word:"word",
                    mean:"mean",
                    totalSolved:0,
                    totalCorrect:0,
                    markedImportant:false,
                },
                {
                    id:3,
                    word:"word",
                    mean:"mean",
                    totalSolved:0,
                    totalCorrect:0,
                    markedImportant:false,
                }
            ]
        }
    ];

}

class UserStore {
    userSerialNumber = "";
    userName = "";
    totalSolved = 0;
    totalCorrect = 0;

}