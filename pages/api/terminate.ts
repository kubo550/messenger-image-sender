import { NextApiRequest, NextApiResponse } from "next"
import fs from "fs";

type TerminateBodyType = {
    pass: string
}

export default (req: NextApiRequest, res: NextApiResponse) => {
    const { pass }: TerminateBodyType = req.body

    // DELITING FOLDER FROM ./clientImages BY SECRET pass
    fs.rmdir(`./clientImages/${pass}`, { recursive: true }, (err) => {
        err && res.status(500).json({ status: false, message: `ERROR ${err}` })
    });

    res.status(200).json({ status: true, message: `${pass} has deleted successfully` })
}