# レジごっこ (toy-cash-registor)

スマホのカメラでバーコード/QRコードをスキャンすると「ピッ」と鳴って商品名と価格が出る、子供向けのレジ遊び Web アプリ。

家にある食品・本・おもちゃのバーコードを使って遊べます。

公開 URL: <https://nisioka.github.io/toy-cash-registor/>

## 特徴

- 同じバーコード → いつも同じ商品名・価格 (バーコード文字列をシードに決定論的生成)
- 完全クライアントサイド、サーバー不要
- PWA 対応 (ホーム画面に追加してスタンドアロン起動)
- iOS Safari / Android Chrome 対応

## 開発

```sh
npm install
npm run dev
```

ブラウザで `http://localhost:5173/toy-cash-registor/` を開く。

カメラを使うため、PC のウェブカメラがあればローカルでも動作確認できる。スマホ実機で試す場合は HTTPS が必須なので、デプロイ後の GitHub Pages URL でテストするのが確実。

## ビルド

```sh
npm run build       # dist/ に出力
npm run preview     # ビルド成果物をローカルで配信
```

## デプロイ

`master` / `main` ブランチに push すると GitHub Actions で自動デプロイされる。

初回セットアップ:

1. リポジトリの Settings → Pages → Source を **GitHub Actions** に設定
2. master に push

## 技術スタック

- Vite + TypeScript (Vanilla)
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) - バーコード/QR スキャン
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) - Service Worker / manifest

## ライセンス

MIT
