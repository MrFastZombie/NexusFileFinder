# DISCLAIMERS

This script sends repeated HTTP requests to Nexus Mods. **By using this software, you accept the risk that Nexus Mods may block your IP.** 

For context, I've had a tempoary 10 minute IP block from using this. The message may read something like this:

```
Your access to Nexus Mods has been temporarily suspended due to an abnormally high number of requests coming from your IP address. We do this to protect our services from malicious users and, more specifically, DDoS attacks.

This suspension will automatically lift so please try again in 10 minutes. Please do not contact us about this issue.
```
There may still be a risk of permament IP blocking after repeated temp blocks.

Do **NOT** bother modders with support requests for versions of mods found with this tool. If a version of a mod is hidden, they likely do not wish to support it. You may have other resources for support but you are basically on your own otherwise.

# Why?

Sometimes modders hide older versions of their mods that are compatible with older versions of games. This is often due to an unwillingness to support older versions of their mods. While I am fine with developers not supporting older versions of their mods, I do not think it is reasonable to completely cut off users from older versions. So, I've created this tool to give users a way to bypass these restrictions.

Bypassing archived files has already been done before, but usually required that you know the ID of the file you wish to download. This tool helps find such IDs, as they can be easily lost for smaller mods.

# How does it work?

This tool takes a brute force approach to finding mod files. A starting ID is provided as well as an amount to check and direction to iterate.

On each iteration, NMF will send an HTTP GET request to Nexus Mod's servers for a URL that looks something like  `https://www.nexusmods.com/examplegame/mods/34861?tab=files&file_id=38567 ` and check for a div titled `header` which currently indicates that a file is present at this URL.

# Requirements

To run directly, you need Node.js. This version was built with Node.js version 18.15.0, but may work with older or newer versions.

Executables from the releases section do not have requirements.

# Compilation

If you want to compile the program yourself and do not wish to run it with node directly, install pkg with `npm i pkg -g` and then run `npm run build` in the program's directory.

# Usage

First, open the page for the mod that you wish to search, and copy the URL. It should look something like `https://www.nexusmods.com/examplegame/mods/4867`. What you have in place of `examplegame` is your **game identifier** and the number at the end of the URL is your **mod id** (4867 in this example).

Next, you should find a starting file ID. I recommend going to the files tab and hovering over one of the download buttons for the oldest file that is newer than the files you wish to search for. In the lower left of your browser (on most browsers) you should see a URL that looks something like `https://www.nexusmods.com/Core/Libs/Common/Widgets/ModRequirementsPopUp?id=39468&game_id=3174`. The number after `?id=` is the file ID you should start at, `39468` in this example.

Now you are ready to start the program. You have two ways to run this program:

1. Open a terminal in the folder that contains `index.js` and run `npm install` to install dependencies. Then, use `node index.js` to run the program.
2. Use the executable from the releases section.

The program will ask you to input the following:

### game identifer

Initially there will be a list of the most common options. What you want is the one that matches your game identifier you found above. If you do not see it in the list, select `other` and input your game identifier exactly as it appears in the URL.

### modID

Enter the first number you found above.

### starting ID

Enter the second number you found above.

### amount of files

This is where you have to use your own judgement. Think about which direction you are checking (down in our example), and then think about how deep you want to search. If it's been a while between updates, you may need to search thousands of files. In my actual test case, I found all files within a distance of 6000 indices; but I expect this to vary wildly between mods.

### direction

Pick a direction to search. In most cases, including our example, you should search down. Regardless, up is an option if needed.

---

After all this input, the tool will begin its search and update you on every 100 files, and when it finds a file. At the end, a list of the IDs found will be output to the terminal. You can access the file by visiting a URL like `https://www.nexusmods.com/examplegame/mods/4789?tab=files&file_id=38921` where `examplegame` is your **game identifier**, `4789` is the **mod id**, and `38921` is the ID of the file you wish to download.
