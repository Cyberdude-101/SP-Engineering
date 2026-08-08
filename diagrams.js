/* ============================================================
   DIAGRAMS — the four animated drawings.

   Drop one into any page with:
       <div class="diagram" data-diagram="truss"></div>

   Options: truss | airfoil | printer | circuit
   Add data-size="hero" to make it the large version.
   ============================================================ */

const DIAGRAMS = {

  /* ---- Bridges: a Warren truss deflecting under load. The two
     members carrying the most stress are drawn in red. ---- */
  truss: `
    <svg viewBox="0 0 640 132" role="img"
         aria-label="A truss bridge flexing under a load, with the two most heavily stressed members highlighted in red">
      <g class="dg-flex">
        <line class="dg-chord" x1="24"  y1="100" x2="616" y2="100" />
        <line class="dg-chord" x1="124" y1="44"  x2="516" y2="44" />
        <line class="dg-web"   x1="24"  y1="100" x2="124" y2="44" />
        <line class="dg-web"   x1="124" y1="44"  x2="222" y2="100" />
        <line class="dg-web dg-hot" x1="222" y1="100" x2="320" y2="44" />
        <line class="dg-web dg-hot" x1="320" y1="44"  x2="418" y2="100" />
        <line class="dg-web"   x1="418" y1="100" x2="516" y2="44" />
        <line class="dg-web"   x1="516" y1="44"  x2="616" y2="100" />
        <line class="dg-web"   x1="222" y1="100" x2="222" y2="44" />
        <line class="dg-web"   x1="418" y1="100" x2="418" y2="44" />
        <circle class="dg-node" cx="124" cy="44"  r="3.6" />
        <circle class="dg-node" cx="320" cy="44"  r="3.6" />
        <circle class="dg-node" cx="516" cy="44"  r="3.6" />
        <circle class="dg-node" cx="222" cy="100" r="3.6" />
        <circle class="dg-node" cx="418" cy="100" r="3.6" />
      </g>
      <g class="dg-load">
        <line x1="320" y1="8" x2="320" y2="30" />
        <polyline points="313,22 320,32 327,22" />
      </g>
      <g class="dg-ground">
        <line x1="8"   y1="112" x2="72"  y2="112" />
        <line x1="568" y1="112" x2="632" y2="112" />
      </g>
    </svg>`,

  /* ---- Planes: air flowing over an airfoil. The streamlines
     bunch up over the top, which is where the lift comes from. ---- */
  airfoil: `
    <svg viewBox="0 0 640 132" role="img"
         aria-label="Air flowing over a wing cross-section, with faster flow across the curved upper surface producing lift">
      <g class="dg-flow">
        <path d="M10,34 C170,34 250,22 330,26 C420,30 500,36 630,36" />
        <path d="M10,50 C170,50 250,34 330,40 C420,46 500,52 630,52" />
        <path d="M10,96 C170,96 250,104 330,102 C420,100 500,96 630,94" />
        <path d="M10,112 C170,112 250,118 330,116 C420,114 500,112 630,110" />
      </g>
      <path class="dg-wing"
            d="M150,78 C230,52 360,50 470,62 C500,65 505,72 480,76 C400,88 250,92 150,78 Z" />
      <g class="dg-lift">
        <line x1="318" y1="60" x2="318" y2="18" />
        <polyline points="311,26 318,15 325,26" />
      </g>
      <text class="dg-label" x="332" y="22">LIFT</text>
    </svg>`,

  /* ---- 3D printing: the nozzle tracks back and forth while the
     part builds up underneath it, one layer at a time. ---- */
  printer: `
    <svg viewBox="0 0 640 132" role="img"
         aria-label="A 3D printer nozzle moving back and forth above a part being built up layer by layer">
      <line class="dg-rail" x1="70" y1="26" x2="570" y2="26" />
      <line class="dg-post" x1="70"  y1="18" x2="70"  y2="34" />
      <line class="dg-post" x1="570" y1="18" x2="570" y2="34" />
      <g class="dg-head">
        <rect class="dg-carriage" x="-19" y="18" width="38" height="17" rx="2" />
        <polygon class="dg-nozzle" points="-7,35 7,35 3,48 -3,48" />
        <line class="dg-filament" x1="0" y1="48" x2="0" y2="72" />
      </g>
      <g class="dg-part">
        <rect class="dg-layer" x="248" y="72"  width="144" height="7" />
        <rect class="dg-layer" x="240" y="79"  width="160" height="7" />
        <rect class="dg-layer" x="234" y="86"  width="172" height="7" />
        <rect class="dg-layer" x="230" y="93"  width="180" height="7" />
      </g>
      <line class="dg-bed" x1="180" y1="101" x2="460" y2="101" />
      <g class="dg-ground">
        <line x1="180" y1="112" x2="460" y2="112" />
      </g>
    </svg>`,

  /* ---- Circuits: current running from the battery, through the
     resistor, to the LED — which lights when it arrives. ---- */
  circuit: `
    <svg viewBox="0 0 640 132" role="img"
         aria-label="A simple circuit with a battery, a resistor and an LED, showing current flowing around the loop and lighting the LED">
      <path class="dg-trace"
            d="M96,96 L96,44 L232,44 L252,44 M340,44 L470,44 L470,68 M470,96 L470,100 L96,100 L96,96 Z" />
      <path class="dg-current"
            d="M96,96 L96,44 L232,44 L252,44 M340,44 L470,44 L470,68 M470,96 L470,100 L96,100 L96,96" />

      <g class="dg-battery">
        <line x1="80"  y1="86" x2="112" y2="86" />
        <line class="dg-short" x1="88" y1="96" x2="104" y2="96" />
        <line x1="80"  y1="106" x2="112" y2="106" />
        <line class="dg-short" x1="88" y1="116" x2="104" y2="116" />
      </g>

      <polyline class="dg-resistor"
                points="252,44 262,32 282,56 302,32 322,56 332,44 340,44" />

      <g class="dg-led">
        <polygon class="dg-led-body" points="456,68 484,68 470,90" />
        <line class="dg-led-bar" x1="454" y1="90" x2="486" y2="90" />
        <circle class="dg-glow" cx="470" cy="79" r="26" />
      </g>

      <text class="dg-label" x="128" y="112">9V</text>
      <text class="dg-label" x="288" y="24">220&#8486;</text>
    </svg>`
};
