import { NextApiRequest, NextApiResponse } from "next"
import fs from "fs";

export default (req: NextApiRequest, res: NextApiResponse) => {
    type ReqBodyType = {
        image: string,
        count: number,
        total: number
    }

    const pass = "test"

    const { image, count, total }: ReqBodyType = req.body;
    const name = `./clientImages/${pass}${count}.jpeg`;
    const base64Data = image.replace("data:image/jpeg;base64,", "");

    fs.mkdir('./clientImages', { recursive: true }, (err) => {
        err && console.log(err)
    });

    fs.writeFile(name, base64Data, "base64", (err) => {
        err && console.log(err)
    })

    return res.status(200).json({ name, isLast: total === count, pass })
}