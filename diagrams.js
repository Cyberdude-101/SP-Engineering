/* ============================================================
   DIAGRAMS — the four animated drawings.

   Drop one into any page with:
       <div class="diagram" data-diagram="truss"></div>

   Options: truss | airfoil | printer | circuit
   Add data-size="hero" to make it the large version.
   ============================================================ */

/* Builds the outline of a gear, teeth and all.

   Gears only mesh if the geometry is right, so this works the way real
   gears do: every wheel shares one "module" (tooth size), which makes
   the pitch radius simply module x teeth / 2. Two wheels mesh when the
   distance between their centres equals the sum of their pitch radii.

   The phase argument rotates the teeth so a tooth on one wheel lines up
   with a gap on its neighbour. Without it the teeth collide instead of
   interleaving, which is exactly what the first attempt did. */
function gearPath(cx, cy, teeth, module, phase) {
  var pitch = module * teeth / 2;
  var tip   = pitch + module * 0.9;
  var root  = pitch - module * 1.1;
  var step  = 360 / teeth;
  var tipHalf  = step * 0.18;
  var rootHalf = step * 0.32;
  var d = "";

  for (var i = 0; i < teeth; i++) {
    var c = phase + i * step;
    var corners = [
      [root, c - rootHalf],
      [tip,  c - tipHalf],
      [tip,  c + tipHalf],
      [root, c + rootHalf]
    ];
    for (var k = 0; k < corners.length; k++) {
      var a = corners[k][1] * Math.PI / 180;
      var x = cx + corners[k][0] * Math.cos(a);
      var y = cy + corners[k][0] * Math.sin(a);
      d += (d ? "L" : "M") + x.toFixed(2) + "," + y.toFixed(2);
    }
  }
  return d + "Z";
}

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

  /* ---- Code: lines of HTML typing themselves out. This one is plain
     HTML rather than SVG — text revealing character by character is far
     easier with a width animation than it is inside an SVG. ---- */
  code: `
    <div class="dg-code" role="img" aria-label="Lines of HTML being typed out one after another in an editor">
      <div class="dg-code-head">
        <span></span><span></span><span></span>
        <em>index.html</em>
      </div>
      <div class="dg-code-body">
        <span class="dg-line" style="animation-delay:0s"><i class="dg-tag">&lt;section</i> <i class="dg-attr">class</i>=<i class="dg-val">"club"</i><i class="dg-tag">&gt;</i></span>
        <span class="dg-line" style="animation-delay:.7s">  <i class="dg-tag">&lt;h1&gt;</i>Engineering Club<i class="dg-tag">&lt;/h1&gt;</i></span>
        <span class="dg-line" style="animation-delay:1.4s"><i class="dg-tag">&lt;/section&gt;</i></span>
      </div>
    </div>`,

  /* ---- Join: two bar magnets. North faces south, so they pull
     together and snap. The field lines fade once contact is made. ---- */
  magnets: `
    <svg viewBox="0 0 640 132" role="img"
         aria-label="Two bar magnets pulling together until they snap into contact, then drawing apart again">
      <g class="dg-field">
        <path d="M290,50 C316,26 356,26 382,50" />
        <path d="M290,66 C316,58 356,58 382,66" />
        <path d="M290,82 C316,106 356,106 382,82" />
      </g>
      <g class="dg-mag-l">
        <rect class="dg-pole-s" x="146" y="42" width="70" height="48" />
        <rect class="dg-pole-n" x="216" y="42" width="70" height="48" />
        <text class="dg-pole-label dg-label-s" x="181" y="67">S</text>
        <text class="dg-pole-label dg-label-n" x="251" y="67">N</text>
      </g>
      <g class="dg-mag-r">
        <rect class="dg-pole-s" x="386" y="42" width="70" height="48" />
        <rect class="dg-pole-n" x="456" y="42" width="70" height="48" />
        <text class="dg-pole-label dg-label-s" x="421" y="67">S</text>
        <text class="dg-pole-label dg-label-n" x="491" y="67">N</text>
      </g>
    </svg>`,

  /* ---- 3D printing: kept for when the club gets a printer, but not
     currently placed on any page. ---- */
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

  /* ---- Meetings: a gear train. The teeth are a thick dashed stroke
     rather than drawn tooth by tooth. Ratios are real — the small gear
     turns as many times faster as it is smaller. ---- */
  gears: `
    <svg viewBox="0 0 640 132" role="img"
         aria-label="Three meshing gears turning, the smaller ones faster than the large one">
      <g class="dg-gear dg-gear-a">
        <path   class="dg-cog"   d="${gearPath(257, 66, 14, 7, 0)}" />
        <circle class="dg-rim"   cx="257" cy="66" r="36" />
        <line   class="dg-spoke" x1="257" y1="32" x2="257" y2="100" />
        <line   class="dg-spoke" x1="228" y1="49" x2="286" y2="83" />
        <line   class="dg-spoke" x1="228" y1="83" x2="286" y2="49" />
        <circle class="dg-hub"   cx="257" cy="66" r="9" />
      </g>
      <g class="dg-gear dg-gear-b">
        <path   class="dg-cog"   d="${gearPath(341, 66, 10, 7, 18)}" />
        <circle class="dg-rim"   cx="341" cy="66" r="22" />
        <line   class="dg-spoke" x1="341" y1="45" x2="341" y2="87" />
        <line   class="dg-spoke" x1="323" y1="56" x2="359" y2="76" />
        <circle class="dg-hub"   cx="341" cy="66" r="7" />
      </g>
      <g class="dg-gear dg-gear-c">
        <path   class="dg-cog"   d="${gearPath(404, 66, 8, 7, 0)}" />
        <circle class="dg-rim"   cx="404" cy="66" r="15" />
        <line   class="dg-spoke" x1="404" y1="52" x2="404" y2="80" />
        <circle class="dg-hub"   cx="404" cy="66" r="5" />
      </g>
    </svg>`,

  /* ---- Join: a bolt turning its way through two plates. The thread is
     a thick, heavily dashed stroke; marching the dashes along the shank
     reads as the bolt turning while it advances. ---- */
  bolt: `
    <svg viewBox="0 0 640 132" role="img"
         aria-label="A bolt turning as it advances through two plates and draws them together">
      <line class="dg-axis" x1="120" y1="66" x2="520" y2="66" />
      <g class="dg-plates">
        <rect class="dg-plate" x="368" y="26" width="32" height="80" rx="2" />
        <rect class="dg-plate" x="400" y="26" width="32" height="80" rx="2" />
      </g>
      <g class="dg-driver">
        <polygon class="dg-bolt-head" points="150,36 174,24 198,36 198,96 174,108 150,96" />
        <line class="dg-facet" x1="174" y1="24" x2="174" y2="108" />
        <line class="dg-thread" x1="198" y1="66" x2="344" y2="66" />
      </g>
    </svg>`,

  /* ---- Circuits: current running from the battery, through the
     resistor, to the LED — which lights when it arrives. ---- */
  circuit: `
    <svg viewBox="0 0 640 132" role="img"
         aria-label="A simple circuit with a battery, a resistor and an LED, showing current flowing around the loop and lighting the LED">
      <path class="dg-trace"
            d="M170,58 L170,34 L268,34 M332,34 L430,34 L430,52 M430,90 L430,108 L170,108 L170,86" />
      <path class="dg-current"
            d="M170,58 L170,34 L268,34 M332,34 L430,34 L430,52 M430,90 L430,108 L170,108 L170,86" />

      <g class="dg-battery">
        <line x1="152" y1="60" x2="188" y2="60" />
        <line class="dg-short" x1="160" y1="68" x2="180" y2="68" />
        <line x1="152" y1="76" x2="188" y2="76" />
        <line class="dg-short" x1="160" y1="84" x2="180" y2="84" />
      </g>

      <polyline class="dg-resistor"
                points="268,34 276,22 292,46 308,22 324,46 332,34" />

      <g class="dg-led">
        <polygon class="dg-led-body" points="416,54 444,54 430,76" />
        <line class="dg-led-bar" x1="414" y1="80" x2="446" y2="80" />
        <circle class="dg-glow" cx="430" cy="66" r="24" />
      </g>

      <text class="dg-label" x="198" y="76">9V</text>
      <text class="dg-label" x="282" y="60">220&#8486;</text>
    </svg>`
};
