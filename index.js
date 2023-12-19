const axios = require('axios');
const cheerio = require('cheerio');

var file_id;

async function main() {
    var ids = [];
    
    for(i = 38510; i > 30000; i--) {
        file_id = await axios.get('https://www.nexusmods.com/mountandblade2bannerlord/mods/5150?tab=files&file_id='+i);
        let $ = cheerio.load(file_id.data);
        if($('div.header').text() != '') {
            console.log($('div.header').text());
            console.log('this file exists! id: ' + i);
            ids.push(i);
        }
        else console.log('this file does not exist!');
    }
    
    console.log(ids);
}

main();