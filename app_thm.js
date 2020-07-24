// 所有的文件操作全部基于FS模块
const fs = require('fs');
// 无论是同步操作还是异步操作都“必须使用”绝对路径的形式操作
const path = require('path');
// const cheerio = require('cheerio');

// 递归创建目录 同步方法
//mkdirsSync('D:/DownloadCache/a')
function mkdirsSync(dirname) {
	if (fs.existsSync(dirname)) {
		return true;
	} else {
		if (mkdirsSync(path.dirname(dirname))) {
			fs.mkdirSync(dirname);
			return true;
		}
	}
}
console.log('开始....')

// var list = require('./default.thm.json').exmls;
// var cmd_path = path.join(__dirname,a[0].path)
// var file_path = path.parse(cmd_path);
// var file_path = new URL(cmd_path);
// mkdirsSync(a[0].path)
var list = [
  ...require('./default.thm.json').exmls,
  ...require('./GameComp.thm.json').exmls,
  ...require('./GameLive.thm.json').exmls,
  ...require('./Plaza.thm.json').exmls,
];



list.forEach((el)=>{
  // const dataGBK = buffer.toString('utf8');
  // const $ = cheerio.load(el.content);
      
  var regex = / class=\"(.*)\" /;
  var parts = regex.exec(el.content);
  var name = parts[1].split(" ")[0];
  console.log(`"${name}:"${el.path}",`)
})


// xuanran(list);
function xuanran(list){
  list.forEach(el => {
    // var el = {
    //   path:"",
    //   content:"".
    // }
    var cmd_path = path.join(__dirname, el.path);
    var obj = path.parse(cmd_path);
    // obj = {
    //   base:"ChatPanelItemRenderSkin.exml",
    //   dir:"c:\Users\Luck\Desktop\thm\resource\Chat\skins",
    //   ext:".exml",
    //   name:"ChatPanelItemRenderSkin",
    //   root:"c:\",
    // }
    mkdirsSync(obj.dir);
    fs.writeFile(el.path, el.content, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
    });
  });
}