import axios from "axios";
import { ChangeEvent, useRef, useState } from "react";
import { Wrapper } from "../components/Home/Home.style";
import { getTerminatePass } from "../utils/createTerminatePass/createTerminatePass";

const NUM_OF_PARTS = 3;
const MESSENGER_URL = "https://www.messenger.com/t/100005543894347";
const QUALITY = 0.4; // FROM 0.1 - LOW TO 1 - HIGHT

const allowedFileTypes = ["image/jpeg", "image/png"];

const Home = () => {
  const [file, setFile] = useState<File>(null);
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState<string>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  const terminateTask = async (pass: string) => {
    const { data } = await axios.post("http://localhost:3000/api/terminate", {
      pass,
    });

    if (data.status) {
      setLoading(false);
      setFile(null);
      // TODO SWEETALERT2
    }
  };

  const prepareImage = () => {
    const pass = getTerminatePass();
    setPass(pass);
    setLoading(true);

    const width = (canvas.current.width = imgRef.current.width);
    const height = (canvas.current.height = imgRef.current.height);
    const ctx = canvas.current.getContext("2d");

    const offset = Math.floor(height / NUM_OF_PARTS);
    ctx.fillStyle = `black`;
    ctx.fillRect(0, 0, width, height);

    let count = 0;

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
            pass,
          }
        );
        if (data.isLast) {
          const { data } = await axios.post(
            "http://localhost:3000/api/sender",
            {
              messengerURL: MESSENGER_URL,
              total: NUM_OF_PARTS,
              pass,
            }
          );
          data.status && setLoading(false);
        }
      };

      sendToServer();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    if (!file || !allowedFileTypes.includes(file.type)) {
      setFile(null);
    } else {
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
    <Wrapper>
      <div className='left'></div>
      <div className='right'>
        <main>
          <form>
            Insert Image File
            <label>
              <input type='file' onChange={handleChange} />
              <span>+</span>
            </label>
          </form>
        </main>
        {loading && (
          <div>
            <h2>Loading...</h2>
            <button onClick={() => terminateTask(pass)}>TERMINATE JOB</button>
          </div>
        )}
        <div>
          {file?.name && (
            <>
              <div>
                <p> {file.name} </p>
                <img style={{ maxWidth: "80%" }} ref={imgRef} src='' alt='' />
                <br />
                <button onClick={prepareImage}>Prepare images</button>
              </div>
              <canvas ref={canvas}></canvas>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Home;
