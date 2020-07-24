

// 所有的文件操作全部基于FS模块
const fs = require('fs');
// 无论是同步操作还是异步操作都“必须使用”绝对路径的形式操作
const path = require('path');

// const iconv = require('iconv-lite');
const cheerio = require('cheerio');
// const request = require('request');
const axios = require('axios');
// const { URL } = require('url');
const SaveName = [
	// "https://www.chijingwang.com",
	// "https://www.88kcd.com",//申博官网
	// "https://www.sina117.com/",//申博官网
	// "https://www.88kcd.com",
	// "https://qcdn.zhangzhongyun.com",
	// "http://146.196.77.36",
	// "http://119.23.234.24:1002",
	// "https://www.sa36.cc",
	// "https://www.salon36.com",
	// "https://www.chijingwang.com",
	// "https://www.xiyaomusic.com",
	// "https://gci.ag88world.com",
	// "https://gameh5-hw.hbzyccs.com",
	// "https://gc.vpcdn.com",
	// "http://3338068.com/",
	// "https://vip.jiankangzy.com:168",
	// "https://web.ariel-go.com",
	// "http://szhong.4399.com",
	"http://https://720yun.com",
	"https://ssl-player.720static.com",
	"https://ssl-panoimg102.720static.com",
	// "https://www.sagaming.com",
	// "http://www.33rfd.com",
	// "http://123kata.com",
	// "https://a1gamevip.com",
	// "https://m.trial.sa-gaming.com",
	// "http://nodejs.cn",
	// "https://gdocker.ky013.com",
	// "https://www.bilibili.com",
	// "https://docs.cocos.com",
	// "https://static-v3.swcqlz.com",
];
const driveder = "D:/DownloadCache/";
const fileName = "D:/桌面/谷歌缓存查看器/report.html";//需要打开工具保存 修改文件编码格式·为utf-8
console.log('开始....')
//检查某个目录是否存在
var stat = fs.statSync(path.join(driveder));
if(!stat.isDirectory()){
	//创建目录
	mkdirsSync(driveder);
}
if(!fs.existsSync(fileName)){
	console.log(`${fileName}   文件不存在！！`);
}else{
	// asyncFn1();
	DownloadCache().then((res)=>{
		console.log(res);
		//多线程下载
		res.forEach( (el,i) => {
			let { href, fileName, dirnameNameFils,dirPath} = el;
			//检查某个文件是否存在
			try {
				fs.statSync(path.join(fileName));
				//如果可以执行到这里那么就表示存在了
			} catch (e) {
				//创建目录
				mkdirsSync(dirPath);
			}
			// try {
				// 获取远程图片
				axios({
					method: 'get',
					url: href,
					responseType: 'stream'
				}).then((response)=>{
					// console.log(el)
					// console.log(href);
					// console.log(fileName);
					// console.log(response.data.headers)
					// console.log(dirnameNameFils);
					//文件名为空
					if(dirnameNameFils.indexOf('.')==-1 || dirnameNameFils==""){
						var g = fileName[fileName.length-1];
						if(g=="/"||g=="\\"){
							fileName+="index.html";
						}else{
							fileName+="/index.html";
						}
					}
					response.data.pipe(fs.createWriteStream(fileName));
					console.log(`下载：[${res.length}/${i<10?'0'+i:i}]  ${fileName}`);
				}).catch((e)=>{
					console.log(e);
				});
			// } catch (error) {
				
			// }
		}, this);
	});
}
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

function DownloadCache() {
	return new Promise((ok,err)=>{
		// 将文本读取到一个buffer中
		const buffer = fs.readFileSync(fileName);
		
		// 由于Windows下文件默认编码为GBK所以需要通过
		const dataGBK = buffer.toString('utf8');
		// const dataGBK = iconv.decode(buffer, 'gbk');
		
		if (dataGBK.indexOf('<!DOCTYPE HTML') == -1) {
			console.log('文件默认编码-utf-8 !!!!!')
		} else {
			const $ = cheerio.load(dataGBK);
			var files = [];
			$('td').each(function () {
				let html = $(this).html();
				for (let i = 0; i < SaveName.length; i++) {
					if (html.indexOf(SaveName[i]) != -1) {
						try {
							const myURL = new URL(html);
							// var password = myURL.password;
							// var hostname = myURL.hostname;  //"static-v3.swcqlz.com"
							// var port = myURL.port;
							// var protocol = myURL.protocol;  //"https:" || http:
							// var hash = myURL.hash;
							// var search = myURL.search;      //"?v=cee8fb2ffdf2f183951f3d0ef4063118"
							// var origin = myURL.origin;      //"https://static-v3.swcqlz.com"
						
							//下载路径
							let href = myURL.href.indexOf('?')!=-1?myURL.href.split('?')[0]:myURL.href;          //"https://static-v3.swcqlz.com/static/js/wow.min.js?v=cee8fb2ffdf2f183951f3d0ef4063118"
							let host = myURL.host.replace(/:/,"_");          //"static-v3.swcqlz.com"
						
							let pathname = myURL.pathname;  //"/static/js/wow.min.js"
							let dirnameName = path.dirname(pathname); // /static/js   返回上一层目录 "/static/js/wow.min.js" -> /static/js
							//文件名  wow.min.js 
							let dirnameNameFils = pathname.split('/')[pathname.split('/').length - 1];
							//目录名
							let dirPath = `${driveder}${host}${dirnameName}`;
							//要保存的文件路径
							let fileName = `${dirPath}/${dirnameNameFils}`;
							files.push({
								href, host, dirnameName, dirnameNameFils, dirPath, fileName
							});
						} catch (error) {
							
						}
					}
				}
			});
			ok(files);
		}
	});
}	


//  当我们发生了一个未知的异常的时候，我们调用这个回掉函数;
// node 停止处理当前这个事件，继续等待下一个事件的处理，不会整个退出，
// 服务器就不会随意的奔溃
// 可以把这个错误，保存起来，方便我们去查找
process.on("uncaughtException", function(err) {
	console.log("uncaughtException called ", err);
});