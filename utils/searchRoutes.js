// utils/searchRoutes.js
// Mer realistisk generator: många rutter, olika priser, restider, byten, operatörer.

const OPERATORS = [
  "DB", "SJ", "DSB", "NS", "SNCF", "ÖBB", "SBB", "Trenitalia", "Renfe", "Eurostar",
];
const TRAIN_FAMILIES = ["ICE", "IC", "X2000", "Railjet", "TGV", "EC", "NightJet", "FlixTrain"];

// Tillåtna stationer (små bokstäver – du kan fylla på)
const STATIONS = [
  "stockholm","göteborg","malmö","uppsala","umeå","kiruna",
  "berlin","hamburg","köpenhamn","amsterdam","prag","münchen",
  "paris","london","oslo","helsinki","warszawa","zurich","wien","rom",
];

// --- Liten deterministisk RNG så samma sökning ger liknande resultat ---
function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function makeRng(seedStr) {
  let s = hashStr(seedStr) || 1;
  return () => {
    // LCG
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32; // [0,1)
  };
}

function pad(n) { return String(n).padStart(2, "0"); }
function fmtTime(h, m) { return `${pad(h)}:${pad(m)}`; }

function minutesBetween(depH, depM, hours, minutes) {
  const start = depH * 60 + depM;
  return hours * 60 + minutes;
}

export function searchRoutes(from, to, date) {
  const f = (from || "").trim();
  const t = (to || "").trim();
  const dateStr = (date || "").trim();

  if (!f || !t) return [];

  const fNorm = f.toLowerCase();
  const tNorm = t.toLowerCase();

  // Acceptera fritext, men “snap:a” om stationen finns i listan
  const normFrom = STATIONS.includes(fNorm) ? capitalize(fNorm) : f;
  const normTo   = STATIONS.includes(tNorm) ? capitalize(tNorm)   : t;

  const rng = makeRng(`${fNorm}|${tNorm}|${dateStr}`);

  // Antal förslag: 12–20
  const count = 12 + Math.floor(rng() * 9);

  const routes = [];
  for (let i = 0; i < count; i++) {
    // Starttider spridda över dagen, lite kluster på morgon/eftermiddag
    const morningBias = rng() < 0.5;
    const baseHour = morningBias
      ? 5 + Math.floor(rng() * 6)      // 05–10
      : 12 + Math.floor(rng() * 10);   // 12–21
    const baseMin = Math.floor(rng() * 60);

    // Restid 2–14 h (med sprinklad chans för nattågs-lik restid)
    let durH = 2 + Math.floor(rng() * 13); // 2..14 h
    if (rng() < 0.12) durH += 6;           // ibland långa rutter
    const durM = Math.floor(rng() * 60);

    // Pris 29–240 €, grovt korrelerad med restid + slump
    let price = 29 + Math.floor(rng() * 212); // 29..241
    price = Math.max(19, Math.min(260, Math.round(price * (1 + (durH - 6) * 0.05))));

    // Byten: 0–3 (flest 0–1)
    let changes = 0;
    const r = rng();
    if (r < 0.55) changes = 0;
    else if (r < 0.85) changes = 1;
    else changes = 2 + (rng() < 0.3 ? 1 : 0);

    // Operator & tågtyp
    const operator = OPERATORS[Math.floor(rng() * OPERATORS.length)];
    const family = TRAIN_FAMILIES[Math.floor(rng() * TRAIN_FAMILIES.length)];
    const trainNo = 50 + Math.floor(rng() * 950);

    const depH = baseHour;
    const depM = baseMin;
    const totalMin = minutesBetween(depH, depM, durH, durM);
    const arrTotal = (depH * 60 + depM + totalMin) % (24 * 60);
    const arrH = Math.floor(arrTotal / 60);
    const arrM = arrTotal % 60;

    routes.push({
      id: `${Date.now()}-${i}`,
      from: normFrom,
      to: normTo,
      departure: fmtTime(depH, depM),
      arrival: fmtTime(arrH, arrM),
      duration: `${durH}h ${pad(durM)}m`,
      price: `€${price}`,
      changes,
      operator,
      train: `${family} ${trainNo}`,
      // Råvärden (om du vill använda senare)
      _minutes: totalMin,
      _priceNum: price,
    });
  }

  // Sortera default på avgångstid
  routes.sort((a, b) => (a.departure > b.departure ? 1 : -1));
  return routes;
}

function capitalize(s) {
  if (!s) return s;
  // behåll t.ex. “München”
  return s.charAt(0).toUpperCase() + s.slice(1);
}