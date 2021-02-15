import { NextApiRequest, NextApiResponse } from "next"
import fs from "fs";

export default (req: NextApiRequest, res: NextApiResponse) => {
    type ReqBodyType = {
        image: string,
        count: number,
        total: number
        pass: string
    }

    const { image, count, total, pass }: ReqBodyType = req.body;

    if (!image || !count || !total || !pass) {
        return res.status(401)
    }

    const name = `./clientImages/${pass}/${count}.jpeg`;
    const base64Data = image.replace("data:image/jpeg;base64,", "");

    // ROOT
    fs.mkdir('./clientImages', { recursive: true }, (err) => {
        err && console.log(err)
    });

    // ONE CLIENT'S FOLDER
    fs.mkdir(`./clientImages/${pass}`, { recursive: true }, (err) => {
        err && console.log(err)
    });

    // CREATE SINGLE IMAGE .jpeg 
    fs.writeFile(name, base64Data, "base64", (err) => {
        err && console.log(err)
    })

    return res.status(200).json({ name, isLast: total === count, pass })
}