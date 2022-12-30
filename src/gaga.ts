import { LitElement, html, css, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { speakEnglish, speakJapanese } from './speech.js';
// import '@material/mwc-icon-button'
// import '@material/mwc-dialog'
// import '@material/mwc-textfield'
// import '@material/mwc-checkbox'

const letters = ['か', 'ば', 'さ', 'ら', 'な']


@customElement('gaga-element')
export class GagaElement extends LitElement {
  @state() revealed = false
  @state() repetition!: number;

  static styles = css`
  :host {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #repetition {
    font-size: 5em;
    margin-bottom: 24px;
    cursor: pointer;
  }
  `

  constructor () {
    super()
    window.addEventListener('keydown', (e) => {
      if (e.code == 'Space') {
        if (this.repetition == undefined || this.revealed == true) {
          this.giveANewOne()
        }
        else {
          this.reveals()
        }
      }
    })
  }

  render () {
    return html`

    ${this.repetition ? html`
    <div id=repetition @click=${()=>{this.reveals()}}>${this.revealed ? this.repetition : '?'}</div>
    ` : nothing}
    <mwc-button raised @click=${()=>{this.giveANewOne()}}>new one</mwc-button>
    `
  }

  reveals () {
    this.revealed = true
    speakEnglish(''+this.repetition)
  }

  giveANewOne () {
    const min = 4
    const max = 10
    this.repetition = Math.floor(Math.random() * (max - min)) + min;
    this.revealed = false
    speakJapanese(this.giveRandomString(this.repetition))
  }

  giveRandomString (length: number) {
    const arr: string[] = []
    for (let i = 0; i < length; ++i) {
      arr.push(letters[Math.floor(Math.random() * letters.length)])
    }
    return arr.join('')
  }
}
