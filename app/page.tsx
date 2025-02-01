import Image from "next/image";
import LikeButton from './calculate';
import axios from 'axios';
import Script from "next/script";
import rosu from "rosu-pp-js";

export default function Home() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const balls = async(bID: number, uID: number) => {
    let response = await fetch("http://localhost:3000/api/get_score?bID="+bID+"&uID="+uID);
    response = await response.json();
  }
  const data = balls(2496318, 754792);
  console.log(JSON.stringify(data))
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <h2>External Post API Request | GeeksForGeeks</h2>
            <input type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Post Title" />

            <input type="text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter Post Body" />
            <button onClick={balls}>Submit</button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
