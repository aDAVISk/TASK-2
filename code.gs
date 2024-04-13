const ACCESS_TOKEN = "アクセストークン";
const FOLDER_ID = "1Hix8gvz0gEV9BS4lD6CRlOZxL1u0q6Cg";

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
  if(event.message.type === 'image'){
      //送られてきた画像をダウンロードする
      const img = await getImageFunc(event.message.id);
      //送信された画像をDriveにアップロードする
      const imageId = await saveImageFunc(img);
      return { type: "text", text: "写真を送信しました" };
  }else {
    return { type: "text", text: event.message.text };
  }
}
//ポストバックイベントの処理
async function postbackFunc(event) {
  return { type: "text", text: event.postback.data };
}
//友達登録時の処理
async function followFunc(event) {
  return { type: "text", text: "友達登録ありがとうございます!!" };
}
//友達解除後の処理
async function unfollowFunc() {
  return undefined;
}

//ユーザーから送られてきた画像をダウンロード
const getImageFunc = async(id) => {
  const url = 'https://api-data.line.me/v2/bot/message/' + id + '/content';
  const data = UrlFetchApp.fetch(url, {
    'headers': {
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'get'
  });
  const img = data.getBlob().getAs('image/png').setName(Number(new Date()) + '.png');
  return img;
}

//画像をDriveに保存する関数
const saveImageFunc = async (img) => {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const file = folder.createFile(img)
  return file.getId()
}

