# ✈️ A400M Flight Lab Online v0.4

A400M のリアルな3D飛行シミュレーターを、Renderで2人同時に遊べるWebサイトとして公開するためのプロジェクトです。

## 現在の状態

**デプロイ設定の準備段階です。まだゲーム本体のZIPはリポジトリにありません。**
このREADMEだけではゲームは起動しません。素材（機体モデル・BGM）の公開権限を確認してから、制作済みの `A400M_Flight_Lab_Online_v0.4_Render.zip` をこのリポジトリのトップ階層にアップロードしてください（ZIPを解凍せず、そのまま）。ZIPは元のChatGPT会話からダウンロードできます。

## 公開手順

1. 元の会話で `A400M_Flight_Lab_Online_v0.4_Render.zip` をダウンロードする。
2. このリポジトリの **Add file → Upload files** から ZIP をそのままアップロードし、コミットする。
3. [Render Dashboard](https://dashboard.render.com/blueprints) で **New → Blueprint** を選び、`chinoyuuki3-del/asd` と `render.yaml` を指定する。
4. **Apply** してデプロイ。起動後 `https://<発行されたホスト名>/health` が `{"ok":true,...}` と返すか確認する。
5. ブラウザーで公開URLを開いて「マルチプレイ」→フレンドコード→招待→承認→機体とコース選択→同時飛行。

## 収録予定の機能

- A400Mの3Dモデル・離陸アシスト・昼/夕/星空の夜
- 初回プレイヤー名の登録・サイバーパンク風ロード演出・MP3 BGM
- フレンド追加・招待の受信/承認・機体選択・コース選択
- 2秒間隔の姿勢/座標送信と補間表示・チャット・飛び合い/対戦モード

## 技術と注意

Render の **Node Web Service** で Node.js と `ws` を実行します。`render.yaml` はZIPから実行ファイルを展開してから依存パッケージをインストールします。

- 無料プランは一定時間アクセスがないと休止する可能性があります。
- 友達への通知はWebサイトを開いている間の通知が中心で、ページを閉じたときのプッシュ通知は未実装です。
- フレンド情報は試作版仕様で、再起動をまたぐ永続アカウントは未実装です。
- **第三者制作の3Dモデル・音源を公開する場合、再配布の許諾が必要です。**
- ZIPが未配置ならデプロイは失敗するため、先にZIPをコミットしてください。

## ファイル構成（ZIP内）

```
server.js
package.json
public/index.html
public/multiplayer.js
public/multiplayer.css
public/models/*.bin.gz
public/audio/suretigai.mp3
```
