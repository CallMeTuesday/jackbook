// Deterministic gradient palette — each move always gets the same colors
const GRADIENTS: [string, string][] = [
  ['#4c1d95', '#1e1b4b'], // violet → indigo
  ['#831843', '#4a044e'], // rose → fuchsia
  ['#064e3b', '#134e4a'], // emerald → teal
  ['#1e3a5f', '#0c4a6e'], // blue → sky
  ['#78350f', '#451a03'], // amber → brown
  ['#3b0764', '#1e1b4b'], // purple → indigo
  ['#881337', '#450a0a'], // red → dark red
  ['#134e4a', '#0c4a6e'], // teal → sky
  ['#1a2e05', '#14532d'], // lime → green
  ['#172554', '#312e81'], // navy → indigo
  ['#1c1917', '#44403c'], // stone dark
  ['#0f172a', '#1e3a5f'], // slate → blue
  ['#2d1b69', '#11998e'], // deep purple → teal
  ['#373b44', '#4286f4'], // charcoal → bright blue
  ['#200122', '#6f0000'], // dark purple → dark red
  ['#0d0d0d', '#434343'], // near black → dark grey
  ['#1a1a2e', '#16213e'], // midnight blue variants
  ['#0f2027', '#2c5364'], // dark cyan
  ['#4b6cb7', '#182848'], // periwinkle → navy
  ['#360033', '#0b8793'], // magenta → teal
  ['#1d4350', '#a43931'], // dark teal → brick red
  ['#283048', '#859398'], // steel blue → grey
  ['#3a1c71', '#d76d77'], // deep purple → dusty rose
  ['#16222a', '#3a6073'], // dark slate → muted blue
  ['#0a3d62', '#1e5799'], // deep ocean blue
  ['#2c3e50', '#4ca1af'], // charcoal → cyan
  ['#373737', '#dd1818'], // dark → deep red
  ['#1a472a', '#2d6a4f'], // forest greens
  ['#2b5876', '#4e4376'], // steel blue → purple
  ['#093028', '#237a57'], // dark green variants
  ['#2d3561', '#c05c7e'], // dark blue → raspberry
  ['#1f1c18', '#635547'], // near black → warm brown
  ['#0c0c0c', '#3d5a80'], // black → muted blue
  ['#4a0072', '#8b0000'], // deep violet → dark red
  ['#003973', '#e5e5be'], // deep blue → warm cream (muted)
  ['#1b1b2f', '#e94560'], // dark navy → vivid pink
  ['#0d324d', '#7f5a83'], // deep teal → muted purple
  ['#141e30', '#243b55'], // dark navy variants
  ['#2b1055', '#7597de'], // deep purple → light blue
  ['#42275a', '#734b6d'], // plum → mauve
  ['#536976', '#292e49'], // grey-blue → deep navy
  ['#1c3c4a', '#4a7c59'], // dark teal → sage
  ['#3d0c02', '#b52b27'], // charred → vivid red
  ['#0b486b', '#f56217'], // deep blue → burnt orange
  ['#5c258d', '#4389a2'], // purple → steel blue
  ['#2c1654', '#c94b4b'], // dark purple → warm red
  ['#0b3d0b', '#5a7a5a'], // dark forest variants
  ['#2f0743', '#b24592'], // deep violet → magenta
  ['#1a0533', '#4a1942'], // near black purple variants
  ['#614385', '#516395'], // medium purple → slate blue
]

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0
  }
  return Math.abs(h)
}

export function getMoveGradient(name: string): { from: string; to: string } {
  const [from, to] = GRADIENTS[hash(name) % GRADIENTS.length]
  return { from, to }
}
