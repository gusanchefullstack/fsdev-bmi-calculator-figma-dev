// BMI Calculator — metric & imperial
const HEALTHY_MIN = 18.5;
const HEALTHY_MAX = 24.9;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const unitRadios = $$('input[name="unit"]');
const metricHeight = $('[data-group="metric-height"]');
const imperialHeight = $('[data-group="imperial-height"]');
const metricWeight = $('[data-group="metric-weight"]');
const imperialWeight = $('[data-group="imperial-weight"]');

const inputs = {
  cm: $('#height-cm'),
  kg: $('#weight-kg'),
  ft: $('#height-ft'),
  inch: $('#height-in'),
  st: $('#weight-st'),
  lbs: $('#weight-lbs'),
};

const resultEl = $('.result');
const bmiEl = $('[data-bmi]');
const clsEl = $('[data-classification]');
const rangeEl = $('[data-range]');

function classify(bmi) {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'a healthy weight';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

function toNum(el) {
  const v = parseFloat(el.value);
  return Number.isFinite(v) && v > 0 ? v : NaN;
}

function formatKg(kg) {
  return `${kg.toFixed(1)}kgs`;
}
function formatStLbs(kg) {
  const totalLbs = kg * 2.20462;
  const st = Math.floor(totalLbs / 14);
  const lbs = totalLbs - st * 14;
  return `${st}st ${lbs.toFixed(0)}lbs`;
}

function getUnit() {
  return document.querySelector('input[name="unit"]:checked').value;
}

function toggleUnits() {
  const unit = getUnit();
  const metric = unit === 'metric';
  metricHeight.hidden = !metric;
  metricWeight.hidden = !metric;
  imperialHeight.hidden = metric;
  imperialWeight.hidden = metric;
  compute();
}

function compute() {
  const unit = getUnit();
  let heightM, weightKg;

  if (unit === 'metric') {
    const cm = toNum(inputs.cm);
    const kg = toNum(inputs.kg);
    if (!cm || !kg) return setEmpty();
    heightM = cm / 100;
    weightKg = kg;
  } else {
    const ft = toNum(inputs.ft) || 0;
    const inch = toNum(inputs.inch) || 0;
    const st = toNum(inputs.st) || 0;
    const lbs = toNum(inputs.lbs) || 0;
    const totalInches = ft * 12 + inch;
    const totalLbs = st * 14 + lbs;
    if (!totalInches || !totalLbs) return setEmpty();
    heightM = totalInches * 0.0254;
    weightKg = totalLbs * 0.45359237;
  }

  const bmi = weightKg / (heightM * heightM);
  if (!Number.isFinite(bmi) || bmi <= 0) return setEmpty();

  const minKg = HEALTHY_MIN * heightM * heightM;
  const maxKg = HEALTHY_MAX * heightM * heightM;

  bmiEl.textContent = bmi.toFixed(1);
  clsEl.textContent = classify(bmi);
  rangeEl.textContent = unit === 'metric'
    ? `${formatKg(minKg)} - ${formatKg(maxKg)}`
    : `${formatStLbs(minKg)} - ${formatStLbs(maxKg)}`;
  resultEl.dataset.state = 'filled';
}

function setEmpty() {
  resultEl.dataset.state = 'empty';
}

unitRadios.forEach(r => r.addEventListener('change', toggleUnits));
Object.values(inputs).forEach(el => el && el.addEventListener('input', compute));

toggleUnits();
