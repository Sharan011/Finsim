const sounds = {
  bgm: "/assets/bgm.mp3",
  click: "/assets/click.mp3",
  credit: "/assets/credit.mp3",
  debit: "/assets/debit.mp3",
  win: "/assets/win.mp3",
  gameover: "/assets/gameover.mp3",
};
export function playSound(name) {
  const audio = new Audio(sounds[name]);
  audio.volume = name === "bgm" ? 0.2 : 1.0;
  audio.play();
}
