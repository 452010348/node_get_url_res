<?php
    header("Content-type: text/html; charset=utf-8");

    //  // 从文件中读取数据到PHP变量
    //  $json_string = file_get_contents('./webp_default.res.json');
    //  // 用参数true把JSON字符串强制转成PHP数组
    //  $data = json_decode($json_string, true);
    //  // 显示出来看看
    //  // var_dump($json_string);
    //  // var_dump ($data);
    //  // print_r($data);

    // $arr = [];
    // foreach ($data["resources"] as $key => $value) {
    //     $str = $value['url'];
    //     $arr_str=explode("?",$str);//以空格为拆分条件
    //     if(!empty($arr_str))
    //     {
    //         array_push($arr,"https://gdocker.ky013.com/resource/".$arr_str[0]);
    //     }
    // }
    // var_dump( sizeof($arr));
    // exit();


    // -----手动数组批量单个文件下载
    $arr = [
        "http://www.chijingwang.com/revampprod/resource/assets/sound/sound/kr/0/bet/BettingExceedTheMaximumLimit.mp3",
        "http://www.chijingwang.com/revampprod/resource/assets/sound/sound/kr/0/bet/BettingLessThanMinimumLimit.mp3",
        "http://www.chijingwang.com/revampprod/resource/assets/sound/sound/kr/0/bet/BettingSuccess.mp3",
        "http://www.chijingwang.com/revampprod/resource/assets/sound/sound/kr/0/bet/NoBettingInThisGame.mp3",
        "http://www.chijingwang.com/revampprod/resource/assets/sound/sound/kr/0/bet/NotEnoughCredit.mp3",
        "http://www.chijingwang.com/revampprod/resource/assets/sound/sound/kr/0/bet/StartBetting.mp3",
        "http://www.chijingwang.com/revampprod/resource/assets/sound/sound/kr/0/bet/StopBetting.mp3",
        "http://www.chijingwang.com/revampprod/resource/assets/sound/sound/kr/0/bet/TieGame.mp3",
        "http://www.chijingwang.com/revampprod/resource/assets/sound/sound/kr/0/bet/WelcomeToBaccarat.mp3",
        "http://www.chijingwang.com/revampprod/resource/assets/sound/sound/kr/0/bet/WelcomeToDragonAndTiger.mp3",
        "http://www.chijingwang.com/revampprod/resource/assets/sound/sound/kr/0/bet/WelcomeToFantan.mp3",
        "http://www.chijingwang.com/revampprod/resource/assets/sound/sound/kr/0/bet/WelcomeToRoulette.mp3",
        "http://www.chijingwang.com/revampprod/resource/assets/sound/sound/kr/0/bet/WelcomeToSic-Bo.mp3",
    ];

    $ii = 0;
    $len = sizeof($arr);
    foreach ($arr as $key => $value) {
        grabImage( $value );

        $per = (++$ii)/$len *100;
        $num =  number_format($per, 2, '.', '');
        echo $num."%     ";

    }

    /**
     * [数组方式批量下载图片 自创在域名`下创建目录 自动导图文件名]
     * @param  [type] $url [description]
     * @return [type]      [description]
     */
    function grabImage($url) {
        $if = preg_match('/htt(p|ps):/', $url, $result);
        if( !$if ){exit( '请带上http:// ：'.$url);}
        $url = str_replace('https://','http://',$url);
        preg_match_all (
            "/htt(p|ps):\\/\\/.+.[\w]+\\//U" ,
            // "/htt(p|ps):\\/\\/.+\\//U" ,
            $url,
            $yum,//获取当前域名如 http://www.xxx.com/
            PREG_SET_ORDER
        );
        $www = $yum[0][0];//当前域名如 http://www.xxx.com/

        if($url=='' || empty($url) ){print_r('域名不存在,');return;}//检测域名为空的不执行

        $dir_file = str_replace( $www, '', $url );  //把域名替换掉
        $x_jpg = substr(strrchr($url, "/"), 1);//得到文件名 如 abc.jpg

        if( file_exists($dir_file) ){print_r(   "无需下载   ".$dir_file.'/'.$x_jpg."\n");return;}//检测文件存在则跳过

        ob_start();             //开始捕获
        readfile($url);   //读入一个文件并写入到输出缓冲。
        $file = ob_get_contents();//返回输出缓冲区的内容
        ob_end_clean();        //缓冲区并关闭输出缓冲

        $dir = dirname( $dir_file ); //返回上一级目录 如 a/b/
        $dir = iconv("UTF-8", "GBK", $dir);//目录编码 注意这里保留对$dir字符串的引用
        mkdir($dir,0777,true);//创建文件夹 0777 是全权限设置

        $fopen = fopen($x_jpg, 'a');// a写入方式打开，将文件指针指向文件末尾。如果文件不存在则尝试创建之。
        fwrite($fopen, $file);          //写入文件
        fclose($fopen);              //关闭一个已打开的文件指针

        rename( $x_jpg, $dir.'/'.$x_jpg );//移动文件到当前目录
        print_r("下载完毕   ".$dir_file.'/'.$x_jpg."\n");

        return [ $x_jpg, $_jpg, $dir, $www];
    }
?>
