import { alphabet } from './constants.js'
import { sleep } from './utils.js'

const audios: {[name: string]: HTMLAudioElement} = {

}

export function preLoadAlphabet () {
  for (const letter of alphabet) {
    audios[letter] = new Audio(`./audio/alphabet/${letter}.mp3`)
    audios[letter].volume = 0.4
  }
}

export async function playLetter (letter: string) {
  const audio = audios[letter]
  if (audio.paused == false) { audio.pause(); audio.currentTime = 0 }
  audio.play()
  // return new Promise(r => {
  //   audios[letter].onended = r
  // })
}



preLoadAlphabet()