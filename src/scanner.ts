import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const COOLDOWN_MS = 2000;

const SUPPORTED_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.ITF,
];

export class Scanner {
  private html5Qrcode: Html5Qrcode | null = null;
  private lastCode: string | null = null;
  private lastTime = 0;

  async start(
    elementId: string,
    onDetected: (code: string) => void,
  ): Promise<void> {
    if (this.html5Qrcode) {
      await this.stop();
    }
    this.html5Qrcode = new Html5Qrcode(elementId, {
      formatsToSupport: SUPPORTED_FORMATS,
      verbose: false,
    });

    await this.html5Qrcode.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: (vw, vh) => {
          const min = Math.min(vw, vh);
          const size = Math.floor(min * 0.8);
          return { width: size, height: size };
        },
        aspectRatio: 1.0,
      },
      (decodedText) => {
        const now = Date.now();
        if (
          decodedText === this.lastCode &&
          now - this.lastTime < COOLDOWN_MS
        ) {
          return;
        }
        this.lastCode = decodedText;
        this.lastTime = now;
        onDetected(decodedText);
      },
      () => {
        // ignore per-frame decode failures
      },
    );
  }

  async stop(): Promise<void> {
    if (!this.html5Qrcode) return;
    try {
      await this.html5Qrcode.stop();
      this.html5Qrcode.clear();
    } catch (err) {
      console.warn('Scanner stop/clear failed (may already be stopped)', err);
    }
    this.html5Qrcode = null;
    this.lastCode = null;
    this.lastTime = 0;
  }
}
