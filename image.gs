const FOLDER_ID = "1Hix8gvz0gEV9BS4lD6CRlOZxL1u0q6Cg";

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
