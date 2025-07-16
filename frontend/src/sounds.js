import { useRef, useEffect } from "react";

const sounds = {
  bgm: "/assets/bgm.mp3",
  click: "/assets/click.mp3",
  credit: "/assets/credit.mp3",
  debit: "/assets/debit.mp3",
  win: "/assets/win.mp3",
  gameover: "/assets/gameover.mp3",
};

export function useBackgroundMusic(url) {
  const musicRef = useRef();
  useEffect(() => {
    function startMusic() {
      if (!musicRef.current) {
        musicRef.current = new window.Audio(url);
        musicRef.current.loop = true;
        musicRef.current.volume = 0.15;
        musicRef.current.play().catch(() => {});
      }
    }
    window.addEventListener("click", startMusic, { once: true });
    return () => {
      window.removeEventListener("click", startMusic);
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    };
  }, [url]);
}
