
export async function getMeaning(input){
    const response = await getItemFromWordServer(input);
    return parseItems(response);

}

async function getItemFromWordServer(input) {
    const response = await fetch("https://suggest-bar.daum.net/suggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=eng&q="+input);
    return response.json();
}

function parseItems(response) {
    if(response.items===undefined){
        return undefined;
    }
    const wordList = [];
    for(let i = 0;i<response.items.length;i++){
        const temp = response.items[i].split("|");
        wordList.push(
            {
                word:temp[1],
                mean:temp[2],
            }
        );
    }
    return wordList;
}