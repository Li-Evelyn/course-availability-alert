import puppeteer from "puppeteer"
import open from "open"

const url = "https://classes.uwaterloo.ca/under.html"

async function scrape() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    await page.goto(url);
    
    await page.waitForSelector("#ssubject");

    await page.select('#ssubject', 'PSYCH');
    await page.$eval('#icournum', el => el.value = '211')
    await page.click('input[type="submit"]');
    await page.waitForSelector('td');

    const entries = await page.$$eval("td", nodes => nodes.map(node => node.innerText.trim()))
    await browser.close()

    return parseInt(entries[13]) < parseInt(entries[12]);
}

async function main() {
    let available = false;
    let numRuns = 0;
    const interval = setInterval(async () => {
        available = await scrape();
        numRuns += 1;
        // console.log(`at ${numRuns} run(s), there is availability: ${available}`)
        if (available) {
            clearInterval(interval);
            open("https://www.youtube.com/watch?v=BQI1Fvp6rBw")
        }
    }, 30 * 60 * 1000);
}

main()