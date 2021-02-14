import axios from "axios";
import { ChangeEvent, useRef, useState } from "react";

const allowedFileTypes = ["image/jpeg", "image/png"];

const Home = () => {
  const [file, setFile] = useState<File>(null);
  const [loading, setLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  const prepareImage = () => {
    const NUM_OF_PARTS = 5;
    const MESSENGER_URL = "https://www.messenger.com/t/100005543894347";
    const PASS = "test";
    const QUALITY = 0.4; // FROM 0.1 - LOW TO 1 - HIGHT

    const width = (canvas.current.width = imgRef.current.width);
    const height = (canvas.current.height = imgRef.current.height);
    const ctx: CanvasRenderingContext2D = canvas.current.getContext("2d");

    const offset = Math.floor(height / NUM_OF_PARTS);
    ctx.fillStyle = `black`;
    ctx.fillRect(0, 0, width, height);

    let count = 0;

    setLoading(true);

    for (let y = offset; y <= height; y += offset) {
      ctx.drawImage(imgRef.current, 0, 0);
      ctx.fillRect(0, y, width, height);

      const image = canvas.current.toDataURL("image/jpeg", QUALITY);
      const sendToServer = async () => {
        const { data } = await axios.post(
          "http://localhost:3000/api/createImage",
          {
            image,
            count: ++count,
            total: NUM_OF_PARTS,
          }
        );
        if (data.isLast) {
          const { data } = await axios.post(
            "http://localhost:3000/api/sender",
            {
              messengerURL: MESSENGER_URL,
              total: NUM_OF_PARTS,
              pass: PASS,
            }
          );
          if (data.status) {
            setLoading(false);
          }
        }
      };

      sendToServer();
    }
  };

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    if (!file) {
      return setFile(null);
    }

    if (allowedFileTypes.includes(file.type)) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        imgRef.current.alt = "loading...";
        imgRef.current.src = reader.result.toString();
      });

      setFile(file);
    }
  };

  return (
    <div>
      <h1>Helllooo from home Component</h1>
      <div>
        <h2>Insert Image File</h2>
        <input type='file' onChange={handleChangeFile} />

        <p>Password</p>
        <input type='text' />
      </div>
      {loading && <h2> Loading... </h2>}
      <div>
        {file?.name && (
          <>
            <div>
              <p> {file.name} </p>
              <img ref={imgRef} src='' alt='' />
              <br />
              <button onClick={prepareImage}>Prepare images</button>
            </div>
            <canvas ref={canvas}></canvas>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
