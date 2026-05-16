import { Cart } from './cart';
import { generateProduct } from './product';
import { Scanner } from './scanner';
import { initAudio, playBeep, playChime } from './sound';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

const cart = new Cart();
const scanner = new Scanner();

function el<T extends HTMLElement = HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Element with id "${id}" not found`);
  return found as T;
}

function elQuery<T extends HTMLElement = HTMLElement>(
  parent: HTMLElement,
  selector: string,
): T {
  const found = parent.querySelector<T>(selector);
  if (!found) throw new Error(`Element matching "${selector}" not found`);
  return found;
}

const startScreen = el('start-screen');
const playScreen = el('play-screen');
const thanksScreen = el('thanks-screen');
const startButton = el<HTMLButtonElement>('start-button');
const payButton = el<HTMLButtonElement>('pay-button');
const lastItemEl = el('last-item');
const lastItemName = elQuery(lastItemEl, '.last-item-name');
const lastItemPrice = elQuery(lastItemEl, '.last-item-price');
const countEl = el('count');
const totalEl = el('total');
const thanksTotalEl = el('thanks-total');
const errorEl = el('error-message');

function showScreen(target: HTMLElement) {
  for (const s of [startScreen, playScreen, thanksScreen]) {
    s.classList.toggle('hidden', s !== target);
  }
}

function showError(message: string) {
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
}

function clearError() {
  errorEl.textContent = '';
  errorEl.classList.add('hidden');
}

function renderTotals() {
  countEl.textContent = String(cart.count());
  totalEl.textContent = `${cart.total()}えん`;
  payButton.disabled = cart.count() === 0;
}

let hideLastItemTimer: number | null = null;

function showLastItem(name: string, price: number) {
  lastItemName.textContent = name;
  lastItemPrice.textContent = `${price}えん`;
  lastItemEl.classList.remove('hidden');
  lastItemEl.style.animation = 'none';
  // restart animation
  void lastItemEl.offsetWidth;
  lastItemEl.style.animation = '';

  if (hideLastItemTimer !== null) {
    window.clearTimeout(hideLastItemTimer);
  }
  hideLastItemTimer = window.setTimeout(() => {
    lastItemEl.classList.add('hidden');
    hideLastItemTimer = null;
  }, 2500);
}

function handleDetected(code: string) {
  const product = generateProduct(code);
  cart.add(product);
  playBeep();
  showLastItem(product.name, product.price);
  renderTotals();
}

async function handleStart() {
  initAudio();
  startButton.disabled = true;
  clearError();
  try {
    showScreen(playScreen);
    renderTotals();
    await scanner.start('reader', handleDetected);
  } catch (err) {
    console.error(err);
    showScreen(startScreen);
    showError('カメラをひらけませんでした。せっていでカメラをゆるしてください。');
    startButton.disabled = false;
  }
}

async function handlePay() {
  if (cart.count() === 0 || payButton.disabled) return;
  payButton.disabled = true;
  const total = cart.total();
  playChime();
  thanksTotalEl.textContent = `ごうけい ${total}えん もらいました`;
  showScreen(thanksScreen);
  await scanner.stop();

  window.setTimeout(async () => {
    cart.reset();
    renderTotals();
    lastItemEl.classList.add('hidden');
    showScreen(playScreen);
    try {
      await scanner.start('reader', handleDetected);
    } catch (err) {
      console.error(err);
      showScreen(startScreen);
      showError('カメラのさいきどうにしっぱいしました。');
      startButton.disabled = false;
    }
  }, 2500);
}

startButton.addEventListener('click', handleStart);
payButton.addEventListener('click', handlePay);
