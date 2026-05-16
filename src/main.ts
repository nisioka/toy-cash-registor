import { Cart } from './cart';
import { generateProduct } from './product';
import { Scanner } from './scanner';
import { initAudio, playBeep, playChime } from './sound';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

const cart = new Cart();
const scanner = new Scanner();

const startScreen = document.getElementById('start-screen')!;
const playScreen = document.getElementById('play-screen')!;
const thanksScreen = document.getElementById('thanks-screen')!;
const startButton = document.getElementById('start-button') as HTMLButtonElement;
const payButton = document.getElementById('pay-button') as HTMLButtonElement;
const lastItemEl = document.getElementById('last-item')!;
const lastItemName = lastItemEl.querySelector('.last-item-name') as HTMLElement;
const lastItemPrice = lastItemEl.querySelector('.last-item-price') as HTMLElement;
const countEl = document.getElementById('count')!;
const totalEl = document.getElementById('total')!;
const thanksTotalEl = document.getElementById('thanks-total')!;
const errorEl = document.getElementById('error-message')!;

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
