import axios from 'axios';
import cheerio from 'cheerio';
import inquirer from 'inquirer';
import ora from 'ora';

var file_id;
const regex = /(?<=(\.(?:7z)|\.(?:zip)|\.(?:rar)))\(.*\)folder/; //Removes folder and mod name after filename.

async function checkFile(game, mod, i, spinner) {
    file_id = await axios.get('https://www.nexusmods.com/'+game+'/mods/'+mod+'?tab=files&file_id='+i).catch(err => console.error('Axios error: ' +err));
            let $ = cheerio.load(file_id.data);
            if($('div.header').text() != '') {
                spinner.succeed($('div.header').text().replace(regex, '') + ' | This file exists! id: '+i)
                spinner.start('Checking files...');
                return i;
            }
            else {
                //console.log('file ID ' + i + ' does not exist!');
                if(i % 100 === 0) { //Update the user every 100 files to show progress is being made.
                    spinner.info('Reached file id ' + i);
                    spinner.start('Checking files...');
                }
                return null;
            }
}

async function exitPrompt() {
    return await inquirer.prompt([{
        name: 'exit',
        type: 'confirm',
        message: 'The process will exit after this prompt.'
    }]);
}

async function main() {
    try {
        console.log('Welcome to Nexus File Finder!\nThis program will do a brute force search for hidden files in Nexus Mods.\nPlease ensure you\'ve read the readme on the GitHub page. (https://github.com/MrFastZombie/NexusFileFinder)');
        let game = await inquirer.prompt([{
            name: 'game',
            type: 'list',
            message: 'Select the game identifer (select \'other\' if not listed)',
            choices: ['skyrimspecialedition', 'skyrim', 'oblivion', 'fallout4', 'fallout3', 'newvegas', 'morrowind', 'mountandblade2bannerlord', 'cyberpunk2077', 'witcher3', 'starfield', 'other'],
            default: 'skyrimspecialedition' //skyrim modders are the spiciest imo
        }])

        if(game.game === 'other') {
            game = await inquirer.prompt([{
                name: 'game',
                type: 'input',
                message: 'Enter the game identifer'
            }]);
        }
        
        //Input validation for game ID
        const check = await axios.get('https://www.nexusmods.com/'+ game.game).catch(err => console.error('Axios error: ' +err));
        if(check === undefined) {
            console.log('Game does not exist!');
            await exitPrompt();
            process.exit(0);
        }
    
        const modID = await inquirer.prompt([{
            name: 'modID',
            type: 'number',
            message: 'Enter the mod ID'
        }]);
    
        const startingID = await inquirer.prompt([{
            name: 'startingID',
            type: 'number',
            message: 'Enter the starting ID'
        }])

        const checkAmount = await inquirer.prompt([{
            name: 'checkAmount',
            type: 'number',
            message: 'Enter the amount of files to check',
        }])
    
        //Input validation for mod ID & starting ID & check amount
        if(isNaN(modID.modID) || isNaN(startingID.startingID || isNaN(checkAmount.checkAmount))) {
            console.log('invalid input!');
            await exitPrompt();
            process.exit(0);
        }
        
        const direction = await inquirer.prompt([{
            name: 'direction',
            type: 'list',
            message: 'Which direction should files be checked?',
            choices: ['up', 'down'],
            default: 'down'
        }])

        //Input validation for direction
        if(direction.direction == 'down') {
            if(startingID.startingID - checkAmount.checkAmount < 0) {
                console.log('Amount of files to check is too high for downwards search!');
                await exitPrompt();
                process.exit(0);
            }
        }
    
        let ids = [];
        const spinner = ora('Checking files...').start();

        if(direction.direction === 'up') {
            for(let i = startingID.startingID; i <= startingID.startingID+checkAmount.checkAmount; i++) {
                let checkedFile = await checkFile(game.game, modID.modID, i, spinner);
                if(checkedFile != null) {
                    ids.push(checkedFile);
                }
            } //end of for
        } else if(direction.direction === 'down') {
            for(let i = startingID.startingID; i >= startingID.startingID-checkAmount.checkAmount; i--) {
                let checkedFile = await checkFile(game.game, modID.modID, i, spinner);
                if(checkedFile != null) {
                    ids.push(checkedFile);
                }
            } //end of for
        } //end of if
        
        spinner.info('Found the following file IDs: ' + ids);
        spinner.succeed('Search complete!');
        await exitPrompt();
        
    } catch (error) {
        console.error(error);
    }
    
}

main();