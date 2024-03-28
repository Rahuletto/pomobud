import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [pomo, setPomo] = useState(25);
  const [mode, setMode] = useState("pomodoro");
  const [count, setCount] = useState(1);
  const short = 5;
  const long = 15;
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === 32) {
        setStarted((e) => !e);
      } else if (event.key === "r") {
        reset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
    setRem(pomo * 60);
    setTotal(pomo * 60);
  }, [pomo]);

  function reset() {
    setStarted(false);
    setRem(pomo * 60);
    setTotal(pomo * 60);
    setCount(1);
    setMode("pomodoro");
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
      if (mode === "pomodoro") {
        if ((count + 1) % longBreakInterval === 0) {
          setMode("long");
          setRem(long * 60);
          setTotal(long * 60);
        } else {
          setMode("short");
          setRem(short * 60);
          setTotal(short * 60);
        }
      } else {
        if (mode === "long") {
          setCount(1);
        }

        if (mode == "short") setCount((e) => e + 1);
        setMode("pomodoro");
        setRem(pomo * 60);
      }
    } else setRem((r) => r - 1);
  }

  return (
    <>
      <Head>
        <title>Pomodoro</title>
      </Head>

      <main
        className={[styles.main, "circular-progress"].join(" ")}
        data-inner-circle-color="red"
        data-bg-color="black"
        data-percentage="0"
        data-progress-color={started ? "var(--green)" : "var(--red)"}
      >
        <div className={styles.page}>
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
          <input
            title="Customize the pomodoro timer"
            className={styles.input}
            type="number"
            placeholder="Pomodoro timer"
            value={pomo}
            onChange={(e) => setPomo(Number(e.target.value))}
          />
        </div>
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
