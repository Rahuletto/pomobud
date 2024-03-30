import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [pomo, setPomo] = useState(25);
  const [short, setShort] = useState(5);
  const [long, setLong] = useState(15);

  const [mode, setMode] = useState<"pomodoro" | "long" | "short">("pomodoro");
  const [count, setCount] = useState(1);

  const longBreakInterval = 5;

  const [remainingTime, setRem] = useState(pomo * 60);
  const [total, setTotal] = useState(pomo * 60);

  const [min, setMin] = useState(
    Math.floor(remainingTime / 60) < 0 ? 0 : Math.floor(remainingTime / 60)
  );
  const [sec, setSec] = useState(
    remainingTime % 60 < 0 ? 0 : remainingTime % 60
  );
  const [started, setStarted] = useState(false);

  const intervalRef = useInterval(
    () => {
      if (started) {
        handleChange();
      } else {
        window.clearInterval(intervalRef.current);
      }
    },
    !started ? null : 1000
  );

  const handleClose = () => {
    const dialog = document.getElementById("dialog") as HTMLDialogElement;
    dialog.classList.remove("close");
    dialog?.showModal();
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === 32) {
        setStarted((e) => !e);
      } else if (event.key === "r") {
        reset();
      }
    };

    const dialog = document.getElementById("dialog");

    function handleBackdrop(event: MouseEvent) {
      let rect = (event.target as HTMLElement)?.getBoundingClientRect();

      if (
        rect.left > event.clientX ||
        rect.right < event.clientX ||
        rect.top > event.clientY ||
        rect.bottom < event.clientY
      ) {
        (dialog as HTMLDialogElement).classList.add("close");
        setTimeout(() => (dialog as HTMLDialogElement)?.close(), 500);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    dialog?.addEventListener("click", handleBackdrop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      dialog?.removeEventListener("click", handleBackdrop);
    };
  }, []);

  useEffect(() => {
    setMin(
      Math.floor(remainingTime / 60) < 0 ? 0 : Math.floor(remainingTime / 60)
    );
    setSec(remainingTime % 60 < 0 ? 0 : remainingTime % 60);
    handleProgress();
  }, [remainingTime, started]);

  useEffect(() => {
    switch (mode) {
      case "pomodoro": {
        setRem(pomo * 60);
        setTotal(pomo * 60);
        break;
      }
      case "short": {
        setRem(short * 60);
        setTotal(short * 60);
        break;
      }
      case "long": {
        setRem(long * 60);
        setTotal(long * 60);
        break;
      }
      default: {
      }
    }
  }, [pomo, short, long]);

  useEffect(() => {
    var r: any = document.querySelector(":root");
    if (mode == "short") r?.style?.setProperty("--green", "var(--blue)");
    else if (mode == "long") r?.style?.setProperty("--green", "var(--gold)");
    else if (mode == "pomodoro")
      r?.style?.setProperty("--green", "var(--green-cache)");
  }, [mode]);

  function reset() {
    setStarted(false);
    setMode("pomodoro");
    setRem(pomo * 60);
    setTotal(pomo * 60);
    setCount(1);
    handleProgress(pomo * 60);
  }

  function handleProgress(n: number = remainingTime) {
    const percent = (n / total) * 100;

    const degree = percent * 3.6;

    const progressBar =
      document.querySelector<HTMLElement>(".circular-progress");
    const progressColor = progressBar?.getAttribute("data-progress-color");
    const bgColor = progressBar?.getAttribute("data-bg-color");

    if (progressBar) {
      progressBar.style.background = `conic-gradient(${progressColor} ${degree}deg, ${bgColor} 0deg)`;
      progressBar.style.boxShadow = `0px 0px 10px ${bgColor} inset`;
    }
  }

  function handleChange() {
    if (remainingTime <= 0) {
      const audio: HTMLAudioElement | null =
        document.querySelector("audio#done");
      const win: HTMLAudioElement | null = document.querySelector("audio#win");

      if (mode === "pomodoro") {
        if ((count + 1) % longBreakInterval === 0) {
          if (win) win.play();
          setMode("long");
          setRem(long * 60);
          setTotal(long * 60);
        } else {
          if (win) win.play();
          setMode("short");
          setRem(short * 60);
          setTotal(short * 60);
        }
      } else {
        if (audio) audio.play();
        if (mode === "long") {
          setCount(1);
        }

        if (mode == "short") setCount((e) => e + 1);
        setMode("pomodoro");
        setRem(pomo * 60);
        setTotal(pomo * 60);
      }
    } else setRem((r) => r - 1);
  }

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />

        <meta name="application-name" content="Pomobud" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pomobud" />
        <meta
          name="description"
          content="Pomobud is a normal, simple yet minimal pomodoro timer (or) Tomato timer so you can focus and break that procrastination."
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#131313" />
        <meta name="msapplication-tap-highlight" content="no" />

        <title>
          {started
            ? `${mode.charAt(0).toUpperCase() + mode.slice(1)} - Pomobud`
            : !started && remainingTime == total
            ? "Pomobud"
            : `Paused - Pomobud`}
        </title>
        <meta name="title" content="Pomobud" />
        <meta
          name="description"
          content="Pomobud is a normal, simple yet minimal pomodoro timer (or) Tomato timer so you can focus and break that procrastination."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pomobud.vercel.app" />
        <meta property="og:title" content="Pomobud" />
        <meta property="og:color" content="#131313" />
        <meta property="og:image" content="/screenshot/wide.png" />
        <meta
          name="theme-color"
          content={
            started
              ? mode == "long"
                ? "#dec057"
                : mode == "short"
                ? "#5287d6"
                : "#62d153"
              : "#d65252"
          }
        />
        <meta
          property="og:description"
          content="Pomobud is a normal, simple yet minimal pomodoro timer (or) Tomato timer so you can focus and break that procrastination."
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://pomobud.vercel.app" />
        <meta property="twitter:title" content="Pomobud" />

        <meta
          property="twitter:description"
          content="Pomobud is a normal, simple yet minimal pomodoro timer (or) Tomato timer so you can focus and break that procrastination."
        />

        <link
          key="icon"
          rel="icon"
          href={
            started
              ? mode == "long"
                ? "/icons/long.png"
                : mode == "short"
                ? "/icons/short.png"
                : "/icons/pomo.png"
              : !started && remainingTime == total
              ? "/favicon.png"
              : "/icons/pause.png"
          }
        />
      </Head>

      <main
        className={[styles.main, "circular-progress"].join(" ")}
        data-inner-circle-color="red"
        data-bg-color="black"
        data-percentage="0"
        data-progress-color={
          started
            ? mode === "pomodoro"
              ? "var(--green)"
              : mode === "short"
              ? "var(--blue)"
              : "var(--gold)"
            : "var(--red)"
        }
      >
        <div id={started ? `page-${mode}` : ""} className={styles.page}>
          <div className={styles.clock}>
            <div className={styles.clockButtons}>
              <div
                id="start"
                className={started ? "on" : "off"}
                onClick={() => setStarted(true)}
              />
              <div
                id="stop"
                className={started ? "on" : "off"}
                onClick={() => setStarted(false)}
              />
            </div>
            <div className={styles.clockDisplay}>
              <h1>
                {min.toString().padStart(2, "0")}:
                {sec.toString().padStart(2, "0")}
              </h1>
            </div>
            <span className={styles.mode}>
              {mode === "long" || mode == "short" ? `${mode} break` : mode}
              <span className={styles.count} title="Number of sessions">
                {count}
              </span>
            </span>
          </div>
          <div className={styles.controls}>
            <button
              id="start-btn"
              className={started ? "on" : "off"}
              disabled={started}
              onClick={() => setStarted(true)}
            >
              Start
            </button>
            <button
              id="stop-btn"
              className={started ? "on" : "off"}
              disabled={!started}
              onClick={() => setStarted(false)}
            >
              Pause
            </button>
            <button className={styles.reset} onClick={reset}>
              Reset
            </button>
          </div>
          <button className={styles.configButton} onClick={() => handleClose()}>
            <svg
              width="20px"
              height="20px"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
            </svg>
          </button>

          <dialog id="dialog" className={styles.settings}>
            <div className={styles.settingsDiv}>
              <div className={styles.labelled}>
                <label htmlFor="pomo-input">Pomodoro timer</label>
                <input
                  id="pomo-input"
                  title="Customize the pomodoro timer"
                  className={styles.input}
                  type="number"
                  placeholder="Pomodoro timer"
                  value={pomo}
                  onChange={(e) => setPomo(Number(e.target.value))}
                />
              </div>

              <div className={styles.labelled}>
                <label htmlFor="short-input">Short break</label>
                <input
                  id="short-input"
                  title="Customize the short break timer"
                  className={styles.input}
                  type="number"
                  placeholder="Short break"
                  value={short}
                  onChange={(e) => setShort(Number(e.target.value))}
                />
              </div>
              <div className={styles.labelled}>
                <label htmlFor="long-input">Long break</label>
                <input
                  id="long-input"
                  title="Customize the long break timer"
                  className={styles.input}
                  type="number"
                  placeholder="Long break"
                  value={long}
                  onChange={(e) => setLong(Number(e.target.value))}
                />
              </div>
            </div>
          </dialog>
        </div>

        {/* Audios provided by Pixabay | https://pixabay.com/ */}
        <audio id="done" src="/audio/beep.mp3" />
        <audio id="win" src="/audio/win.mp3" />
      </main>
    </>
  );
}

function useInterval(callback: any, delay: number | null) {
  const intRef: any = useRef();
  const cb = useRef(callback);

  useEffect(() => {
    cb.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof delay === "number") {
      intRef.current = window.setInterval(() => cb.current(), delay);

      return () => window.clearInterval(intRef.current);
    }
  }, [delay]);

  return intRef;
}
