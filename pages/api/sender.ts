import { NextApiRequest, NextApiResponse } from "next"
import puppeteer from "puppeteer"
import axios from "axios"

type SenderType = {
    messengerURL: string,
    pass: string,
    total: number
};

interface HTMLElement extends Element {
    value: string
}

const email = process.env.MESSENGER_EMAIL
const password = process.env.MESSENGER_PASSWORD

export default (req: NextApiRequest, res: NextApiResponse) => {

    const { messengerURL, pass, total }: SenderType = req.body

    if (!messengerURL || !pass || !total) {
        return res.status(401).json({ error: "Incorrect Query " })
    }

    (async () => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://www.messenger.com/");
            await page.waitForSelector(
                "button[data-testid=cookie-policy-banner-accept]"
            );

            await page.$eval("button[data-testid=cookie-policy-banner-accept]", (btn: any) =>
                btn.click()
            );

            await page.$eval(
                "#email",
                (input: HTMLElement, email: string) => {
                    input.value = email;
                },
                email
            );

            await page.$eval(
                "#pass",
                (input: HTMLElement, password: string) => {
                    input.value = password;
                },
                password
            );

            await page.$eval("#loginbutton", (btn: any) => btn.click());

            await page.waitForTimeout(3000);
            await page.goto(messengerURL, { waitUntil: "networkidle2" });

            await page.waitForTimeout(3000);

            const elementsHandle = await page.$("input[type=file]");

            for (let i = 1; i <= total; i++) {
                try {
                    await elementsHandle.uploadFile(`./clientImages/${pass}/${i}.jpeg`);
                    await page.waitForTimeout(2000);
                    await page.keyboard.press("Enter");
                    await page.waitForTimeout(1000)
                } catch (err) {
                    // ERROR WHEN FILES HAS BEEN DELETED SO ITS FINE!!
                    return res.status(200).json({ message: 'done!', status: true })
                }

            }

            // await page.screenshot({ path: "kotek.png" });

            await browser.close();
            await axios.post("http://localhost:3000/api/terminate", {
                pass,
            })
            return res.status(200).json({ message: 'done!', status: true })
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: `Error! ${err}`, status: false })
        }
    })();
}
