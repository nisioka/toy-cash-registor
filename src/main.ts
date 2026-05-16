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

function showScreen(target: HTMLElement) {
  for (const s of [startScreen, playScreen, thanksScreen]) {
    s.classList.toggle('hidden', s !== target);
  }
}

function renderTotals() {
  countEl.textContent = String(cart.count());
  totalEl.textContent = `${cart.total()}えん`;
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
  try {
    showScreen(playScreen);
    renderTotals();
    await scanner.start('reader', handleDetected);
  } catch (err) {
    console.error(err);
    alert('カメラをひらけませんでした。せっていでカメラをゆるしてください。');
    showScreen(startScreen);
    startButton.disabled = false;
  }
}

async function handlePay() {
  if (cart.count() === 0) return;
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
      alert('カメラのさいきどうにしっぱいしました。');
      showScreen(startScreen);
      startButton.disabled = false;
    }
  }, 2500);
}

startButton.addEventListener('click', handleStart);
payButton.addEventListener('click', handlePay);
