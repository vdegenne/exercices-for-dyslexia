import { css, html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { playLetter } from './audio.js';
import { alphabet } from './constants.js';
import { cancelSpeech, speakEnglish } from './speech.js';
import { sleep } from './utils.js';

const STATES = {
  cpu: 'cpu',
  user: 'user',
  stopped: 'stopped'
} as const;
type State = typeof STATES[keyof typeof STATES];

@customElement('keyboard-simon')
export class KeyboardSimon extends LitElement {
  private defaultLevel = 2;
  @state() level!: number;
  private line!: string;

  private maxWait = 2;
  @state() speed = 1.5;

  @state() state: State = STATES.stopped;
  @state() private input = ''

  constructor () {
    super()
    this.reset()

    window.addEventListener('keydown', async (e) => {
      if (e.key == ' ') {
        try {
          this.shadowRoot!.querySelector('mwc-button')?.click()
        }
        catch (e) {}
        return
      }
      if (this.state !== STATES.user) { return }
      if (!alphabet.includes(e.key)) { return }
      this.input += e.key
      if (this.testInput()) {
        playLetter(e.key)
        // speakEnglish(e.key, 1, 1.3)
        if (this.input.length == this.line.length) {
          await sleep()
          await speakEnglish('nice!')
          this.input = ''
          this.nextLevel()
          return
        }
      }
      else {
        await sleep()
        this.announceGameOver()
      }
    })
  }

  static styles = css`
  :host {
    font-size: 2.5em;
  }
  `

  render() {
    return html`
    <div>speed</div>
    <mwc-slider label="speed"
      discrete
      withTickMarks
      min="0.25"
      max="${this.maxWait}"
      step="0.25"
      value="${this.speed}"
      @change=${(e) => { this.speed = e.detail.value }}
    >
    </mwc-slider>
    <div>level : ${this.level}</div>
    <div>input : ${this.input}</div>
    ${this.state == STATES.stopped && this.input ? html`<div @click=${()=>{this.readTheLine()}}>answer: ${this.line}</div>` : nothing}

    <div style="margin-bottom:24px"></div>
    ${this.state == STATES.stopped ? html`<mwc-button @click=${()=>{this.reset(); this.startCPUreading()}}>start</mwc-button>` : nothing}
    `
  }

  reset() {
    this.level = this.defaultLevel
    this.input = ''
    this.buildNewLine(this.level)
  }

  async nextLevel () {
    this.level++;
    await speakEnglish(`level ${this.level}`)
    this.buildNewLine(this.level)
    // this.pushOneLetter()
    await this.startCPUreading()
    this.startTesting()
  }

  pushOneLetter () {
    this.line += giveRandomLetter()
  }

  buildNewLine (length: number) {
    this.line = ''
    for (let i = 0; i < length; ++i) {
      this.pushOneLetter()
    }
  }

  async startCPUreading () {
    this.state = STATES.cpu
    await this.readTheLine()
    this.startTesting()
  }

  startTesting () {
    this.state = STATES.user
    this.input = ''
  }

  testInput () {
    return (new RegExp(`^${this.input}`)).test(this.line)
  }

  async announceGameOver () {
    this.state = STATES.stopped
    await speakEnglish('game over')
    cancelSpeech()
    window.toast('game over.')
  }

  async readTheLine () {
    for (const letter of this.line) {
      playLetter(letter)
      await sleep(500)
      await sleep((this.maxWait - this.speed) * 1000)
    }
  }
}


function giveRandomLetter () {
  return alphabet[Math.floor(Math.random() * alphabet.length)]
}
