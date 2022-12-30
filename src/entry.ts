import '@material/mwc-snackbar'
import '@material/mwc-button'
import '@material/mwc-slider'

import './audio.js'

import './main.js'
import './gaga.js'
import './keyboard-simon.js'



declare global {
  interface Window {
    toast: (labelText: string, timeoutMs?: number) => void;
  }
}