const ACCESS_TOKEN = "アクセストークン";

async function doPost(e) {
  for (let i = 0; i < JSON.parse(e.postData.contents).events.length; i++) {
    const event = JSON.parse(e.postData.contents).events[i];
    const message = await eventHandle(event);
    //応答するメッセージがあった場合
    if (message !== undefined) {
      const replyToken = event.replyToken;
      const replyUrl = "https://api.line.me/v2/bot/message/reply";
      UrlFetchApp.fetch(replyUrl, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + ACCESS_TOKEN,
        },
        method: "post",
        payload: JSON.stringify({
          replyToken: replyToken,
          messages: [message],
        }),
      });
    }
  }
  return ContentService.createTextOutput(
    JSON.stringify({ content: "post ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}

async function eventHandle(event) {
  let message;
  switch (event.type) {
    case "message":
      message = await messagefunc(event);
      break;
    case "postback":
      message = await postbackFunc(event);
      break;
    case "follow":
      message = await followFunc(event);
      break;
    case "unfollow":
      message = unfolowFunc(event);
      break;
  }
  return message;
}

//メッセージイベントの処理
async function messagefunc(event) {
  let message;
  if(event.message.type === 'image'){
      //送られてきた画像をダウンロードする
      const img = await getImageFunc(event.message.id);
      //送信された画像をDriveにアップロードする
      const imageId = await saveImageFunc(img);
      message = { type: "text", text: "写真を送信しました" };
  }else {
    message =  { type: "text", text: event.message.text };
  }
  message.quickReply= {
        "items": [
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "Bot説明",
              "text": "Bot説明"
            }
          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "利用規約",
              "text": "利用規約"
            }
          }
        ]
      };
  return message;
}
//ポストバックイベントの処理
async function postbackFunc(event) {
  return { type: "text", text: event.postback.data };
}
//友達登録時の処理
async function followFunc(event) {
  return { type: "text", text: "友達登録ありがとうございます.利用規約等に同意してください."+
  "https://docs.google.com/forms/d/e/1FAIpQLScAluHJtBQq-oXIAlrjDwcp2_0MuffJzLodoiSWiIneKiLzIA/viewform?usp=pp_url&entry.780400687="
  + event.source.userId };
}
//友達解除後の処理
async function unfollowFunc() {
  return undefined;
}
