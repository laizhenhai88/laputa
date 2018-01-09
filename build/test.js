const rp = require('request-promise');
const request = require('request');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const logger = require('../lib/logger')();
const Nightmare = require('nightmare');
const iconv = require('iconv-lite');

const nightmare = Nightmare({
  show: true,
  openDevTools: {
    mode: 'detach'
  },
  switches: {
    // 'proxy-server': '1.2.3.4:5678',
    'ignore-certificate-errors': true
  },
  // goto和load的超时已经设置的情况下， 按理说wait超时只能是页面不对
  waitTimeout: 2 * 10000,
  pollInterval: 250,
  gotoTimeout: 60 * 1000,
  loadTimeout: 60 * 1000,
  executionTimeout: 60 * 1000,
  // 1s输入5个
  typeInterval: 200,
  webPreferences: {
    images: true,
    webSecurity: false,
    allowRunningInsecureContent: true
  }
});

let f = async() => {

  let html = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>动漫男头_卡通动漫头像_我要个性网</title>
<link rel="stylesheet" type="text/css" href="/source/css/common.css?1514361454.css" />
<link rel="stylesheet" type="text/css" href="/source/css/swipebox.css" />
<script type="text/javascript" src="/source/js/jquery.1.9.js"></script>
<script type="text/javascript" src="/source/js/ZeroClipboard.js"></script>
<script type="text/javascript" src="/source/js/common.js"></script>
</head>

<body>
<div id="header">
    <div class="head wp">
        <div class="logo z"><a href="http://www.woyaogexing.com">我要个性网</a></div>
        <div class="app_gz z">
            <a href="/about/about.html" target="_blank">手机 APP</a>
            <div class="weixin_gz">
                <a href="/about/about.html" target="_blank">官方微信</a>
            </div>
        </div>
        <div class="search z">
           <form action="/e/search/index.php" method="post">
                <div class="sele-cur z">
                <div class="deft"><span>头像</span><i></i></div>
                <ul>
                    <li data-ns="24">头像</li>
                    <li data-ns="2">网名</li>
                    <li data-ns="1">签名</li>
                    <li data-ns="69">皮肤</li>
                    <li data-ns="63">分组</li>
                    <li data-ns="78">日志</li>
                    <li data-ns="75">说说</li>
                    <li data-ns="85">图片</li>
                </ul>
                </div>
                <input type="text" class="in-key key-focus" name="keyboard" value="输入关键词，比如：毕业、爱、EXO">
                <input type="hidden" name="classid" class="nsid" value="24" />
                <input type="hidden" name="show" value="title" />
                <input type="submit" class="srch-btn" value="搜索">
            </form>
        </div>
        <div class="login-i y"></div>
<script type="text/javascript" src="/source/js/login.js"></script>
    </div>
</div>
<div id="menu">
    <ul class="wp">
        <li><a href="/">首页</a></li>
        <li ><a href="/gexing/">QQ个性签名</a></li>
        <li ><a href="/name/">QQ网名</a></li>
        <li class="on"><a href="/touxiang/">QQ头像</a></li>
        <li ><a href="/fenzu/">QQ分组</a></li>
        <li ><a href="/qqpifu/">QQ皮肤</a></li>
        <li ><a href="/tupian/">图片</a></li>
        <li ><a href="/shuoshuo/">说说</a></li>
        <li ><a href="/rizhi/">日志</a></li>
        <li ><a href="/shouji/">手机壁纸</a></li>
        <li class="llast"><a href="javascript:;"><span>更多</span><i></i></a>
            <div class="sele-gj">
                <div class="a-ti"><div><em></em></div></div>
                <div class="a-list">
                <a href="/gongju/zhuanhuanqi.html" target="_blank">繁体字转换器</a>
                <a href="/gongju/fuhaodaquan.html" target="_blank">符号大全</a>
                <a href="/gongju/wangmingsheji.html" target="_blank">网名设计</a>
                <a href="/top/zhtop/">排行榜</a>
                </div>
            </div>
        </li>
<li class="feeback"><a href="/e/tool/feedback/?bid=1" target="_blank">意见反馈</a></li>
    </ul>
</div>
<div id="main" class="txMain wp mt10">
    <div class="main-ad"><script type="text/javascript" src="https://bad1.51gxqm.com/fi3a1dc491f3c9ff3bdb1c718ff3b062be52facc0975e13eef.js"></script></div>
    <div class="main-nav mt10">
        <div class="sub-nav cl">
            <h2><a href="/touxiang/">QQ头像</a></h2><div class="triangle z"><i></i></div>
            <div class="subnav-l z">
                            <a href="/touxiang/qinglv/" >QQ情侣头像</a>
                            <a href="/touxiang/nan/" >QQ男生头像</a>
                            <a href="/touxiang/nv/" >QQ女生头像</a>
                            <a href="/touxiang/katong/" class='on'>卡通动漫头像</a>
                            <a href="/touxiang/fengjing/" >风景静物头像</a>
                            <a href="/touxiang/weixin/" >微信头像</a>
                        </div>
            <a href="/e/DoInfo/AddInfo.php?mid=7&bclassid=24" class="f-push y">发布头像</a>
        </div>
        <div class="hot-tags">热门标签：<a href="/touxiang/z/egao/">恶搞</a><a href="/touxiang/z/ktecy/">二次元</a><a href="/touxiang/z/ktqpz/">强迫症</a><a href="/touxiang/z/ktkwy/">卡哇伊</a><a href="/touxiang/z/ktgaoxiao/">搞笑</a><a href="/touxiang/z/ktkeai/">可爱</a><a href="/touxiang/z/ktnv/">女生</a><a href="/touxiang/z/ktnan/">男生</a><a href="/touxiang/z/ktql/">情侣</a><a href="/touxiang/z/kthyrz/">火影忍者</a><a href="/touxiang/z/kthzw/">海贼王</a><a href="/touxiang/z/ktali/">阿狸</a><a href="/touxiang/z/ktmao/">猫咪</a></div>
    </div>
        <div class="contMain mt10">
        <div class="contLeft z">
            <div class="contLeftA">
                <div class="artInfo">
                    <div class="artUser z">
                        <a href="/user/571868" class="user z" target="_blank"><img src="http://img2.woyaogexing.com/2018/01/08/b91fe9040278f230!60X60.png" width="50" height="50" /></a>
                        <div class="homeName z"><a href="/user/571868" target="_blank">⁡七猫<img src="/images/level/level_02.gif"></a><p><i class='girl'></i>女　中国</p></div>
                    </div>
                    <div class="artOS y">

                            <div class="size y">
                            <a href="javascript:;" class="on but_lf" size="200" id="b_pic">大图</a>
                            <a href="javascript:;" class="but_lf" size="100" id="s_pic">小图</a>
                            <a href="javascript:;" class="on but_lr" size="50" id="square_pic">方图</a>
                            <a href="javascript:;" class="but_lr" size="50" id="rod_pic">圆图</a>
                        </div>

                        <div class="artTime y">2018-01-08 11:12:47</div>
                    </div>
                </div>
                <h1>动漫男头</h1>
                <ul class="artCont cl">
<li class="tx-img"><a href="http://img2.woyaogexing.com/2018/01/08/3b43f4a4e75d5eb1!400x400_big.jpg" class="swipebox"><img class="lazy" src="http://img2.woyaogexing.com/2018/01/08/3b43f4a4e75d5eb1!400x400_big.jpg" width="200" height="200" /></a></li><li class="tx-img"><a href="http://img2.woyaogexing.com/2018/01/08/10948bbdc0599d38!400x400_big.jpg" class="swipebox"><img class="lazy" src="http://img2.woyaogexing.com/2018/01/08/10948bbdc0599d38!400x400_big.jpg" width="200" height="200" /></a></li><li class="tx-img"><a href="http://img2.woyaogexing.com/2018/01/08/9f0392db998fe92e!400x400_big.jpg" class="swipebox"><img class="lazy" src="http://img2.woyaogexing.com/2018/01/08/9f0392db998fe92e!400x400_big.jpg" width="200" height="200" /></a></li><li class="tx-img"><a href="http://img2.woyaogexing.com/2018/01/08/52cc224bab7515cd!400x400_big.jpg" class="swipebox"><img class="lazy" src="http://img2.woyaogexing.com/2018/01/08/52cc224bab7515cd!400x400_big.jpg" width="200" height="200" /></a></li><li class="tx-img"><a href="http://img2.woyaogexing.com/2018/01/08/babab939acc6b002!400x400_big.jpg" class="swipebox"><img class="lazy" src="http://img2.woyaogexing.com/2018/01/08/babab939acc6b002!400x400_big.jpg" width="200" height="200" /></a></li><li class="tx-img"><a href="http://img2.woyaogexing.com/2018/01/08/5d049ab5b19b817b!400x400_big.jpg" class="swipebox"><img class="lazy" src="http://img2.woyaogexing.com/2018/01/08/5d049ab5b19b817b!400x400_big.jpg" width="200" height="200" /></a></li><li class="tx-img"><a href="http://img2.woyaogexing.com/2018/01/08/52b52a5588aa5b19!400x400_big.jpg" class="swipebox"><img class="lazy" src="http://img2.woyaogexing.com/2018/01/08/52b52a5588aa5b19!400x400_big.jpg" width="200" height="200" /></a></li><li class="tx-img"><a href="http://img2.woyaogexing.com/2018/01/08/78b4b7a44af80896!400x400_big.jpg" class="swipebox"><img class="lazy" src="http://img2.woyaogexing.com/2018/01/08/78b4b7a44af80896!400x400_big.jpg" width="200" height="200" /></a></li><li class="tx-img"><a href="http://img2.woyaogexing.com/2018/01/08/486026e4039d2d70!400x400_big.jpg" class="swipebox"><img class="lazy" src="http://img2.woyaogexing.com/2018/01/08/486026e4039d2d70!400x400_big.jpg" width="200" height="200" /></a></li><li class="tx-img"><a href="http://img2.woyaogexing.com/2018/01/08/f52a6364da373043!400x400_big.jpg" class="swipebox"><img class="lazy" src="http://img2.woyaogexing.com/2018/01/08/f52a6364da373043!400x400_big.jpg" width="200" height="200" /></a></li><li class="tx-img"><a href="http://img2.woyaogexing.com/2018/01/08/1cf4f24e663892c7!400x400_big.jpg" class="swipebox"><img class="lazy" src="http://img2.woyaogexing.com/2018/01/08/1cf4f24e663892c7!400x400_big.jpg" width="200" height="200" /></a></li><li class="tx-img"><a href="http://img2.woyaogexing.com/2018/01/08/92074a071ec106f0!280x280_big.jpg" class="swipebox"><img class="lazy" src="http://img2.woyaogexing.com/2018/01/08/92074a071ec106f0!280x280_big.jpg" width="200" height="200" /></a></li>                </ul>
<script  type="text/javascript" src="/source/js/swipebox.js"></script>
<script>
$('.artCont li').swipebox();
</script>
                <div class="tagsPl">
                    <div class="tagsL z">标签：<a href='/touxiang/z/ktnan/'>男生</a></div>
                    <div class="plShare y">
                        <div class="pMain plIco z" data-id="567454" data-classid="24">
                            <a href="###" class="t" onclick="javascript:bAction.Digg(this,'good',567454,58);return false;" title="喜欢"></a>
                            <a href="###" class="d" onclick="javascript:bAction.Digg(this,'not',567454,58);return false;" title="心碎"></a>
                            <a href="###" class="f" onclick="javascript:bAction.addFava(this,'fava',567454,58);return false;" title="收藏"></a>
                        </div>
                        <div class="bdcontShare z"><a href="javascript:;" class="s">分享</a>
                            <div class="contShare">
                                <div class="contTran"><div><i></i></div></div>
                                <div class="shareLink">
                                    <!-- Baidu Button BEGIN -->
<div id="bdshare" class="bdshare_t bds_tools get-codes-bdshare">
<a class="bds_qzone">QQ空间</a>
<a class="bds_tqq">腾讯微博</a>
<a class="bds_tsina">新浪微博</a>
<a class="bds_renren">人人网</a>
<a class="bds_tqf">腾讯朋友</a>
<a class="bds_hi">百度空间</a>
</div>

<script type="text/javascript" id="bdshare_js" data="type=tools&amp;uid=13500" ></script>
<script type="text/javascript" id="bdshell_js"></script>
<script type="text/javascript">
document.getElementById("bdshell_js").src = "http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + Math.ceil(new Date()/3600000);
</script>
<!-- Baidu Button END -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div  class="listPage">

<span>上一组</span>

<a href="/touxiang/katong/2018/566979.html">下一组</a>

</div>

                <div class="double_11" style="padding:0 25px;margin:15px 0;">
                <script type="text/javascript" src="https://bad1.51gxqm.com/bv3a1dc792f1c2f039db1c718ff3b062be52facc0975e13eef.js"></script>
                </div>
            </div>
            <script src="/d/js/js/1494574780.js" ></script>
            <div class="contLeftB mt10">
                <h3>推荐头像</h3>
                <ul>
                     <li><a href="/touxiang/katong/2018/567454.html"><img src="http://img2.woyaogexing.com/2018/01/08/3b43f4a4e75d5eb1!400x400_big.jpg" width="120" height="120" />动漫男头</a></li><li><a href="/touxiang/katong/2018/566937.html"><img src="http://img2.woyaogexing.com/2018/01/07/ac51dd54f678e9b4!358x358_big.jpg" width="120" height="120" />“走了的是你，渡不</a></li><li><a href="/touxiang/katong/2018/566686.html"><img src="http://img2.woyaogexing.com/2018/01/06/d18babafb523cf3c!400x400_big.jpg" width="120" height="120" />动漫男头 愿喜</a></li><li><a href="/touxiang/katong/2018/566007.html"><img src="http://img2.woyaogexing.com/2018/01/05/95ebf7a523b170cc!400x400_big.jpg" width="120" height="120" />[cp]动漫

日常很</a></li><li><a href="/touxiang/katong/2018/565893.html"><img src="http://img2.woyaogexing.com/2018/01/05/fec6237ca73e5bcc!400x400_big.jpg" width="120" height="120" />鹿姬:软糖</a></li>                </ul>
            </div>
        </div>
        <div class="contRight y">
            <div class="rollBD">
                <div class="div250"><script type="text/javascript">
     document.write('<a style="display:none!important" id="tanx-a-mm_27818366_4246688_14412863"></a>');
     tanx_s = document.createElement("script");
     tanx_s.type = "text/javascript";
     tanx_s.charset = "gbk";
     tanx_s.id = "tanx-s-mm_27818366_4246688_14412863";
     tanx_s.async = true;
     tanx_s.src = "http://p.tanx.com/ex?i=mm_27818366_4246688_14412863";
     tanx_h = document.getElementsByTagName("head")[0];
     if(tanx_h)tanx_h.insertBefore(tanx_s,tanx_h.firstChild);
</script></div>
                <div class="div250 mt10"><script type="text/javascript" src="https://bad1.51gxqm.com/ei3a1fc294f4cfff74c51f74d9efab66e84df3d04a38ed3c.js"></script></div>
            </div>
        </div>
    </div
</div>
<div class="footAD wp mt10"><script type="text/javascript">
        document.write('<a style="display:none!important" id="tanx-a-mm_27818366_4246688_14418572"></a>');
        tanx_s = document.createElement("script");
        tanx_s.type = "text/javascript";
        tanx_s.charset = "gbk";
        tanx_s.id = "tanx-s-mm_27818366_4246688_14418572";
        tanx_s.async = true;
        tanx_s.src = "http://p.tanx.com/ex?i=mm_27818366_4246688_14418572";
        tanx_h = document.getElementsByTagName("head")[0];
        if(tanx_h)tanx_h.insertBefore(tanx_s,tanx_h.firstChild);
</script>

</div>
<div class="siteLink fff mt10 cl">
    <dl>
        <dd><a href="/touxiang/">QQ头像</a></dd>
        <dt><a href="/touxiang/qinglv/">QQ情侣头像</a></dt>
        <dt><a href="/touxiang/nan/">QQ男生头像</a></dt>
        <dt><a href="/touxiang/nv/">QQ女生头像</a></dt>
                  <dt><a href="/touxiang/weixin/">微信头像</a></dt>
    </dl>
    <dl class="wmDL">
        <dd><a href="/name/">QQ网名</a></dd>
        <dt><a href="/name/ql/">情侣网名</a> </dt>
        <dt><a href="/name/nvsheng/">女生网名</a> </dt>
        <dt><a href="/name/nansheng/">男生网名</a></dt>
        <dt><a href="/name/yingwen/">英文网名</a> </dt>
    </dl>
    <dl class="gxDL">
        <dd><a href="/gexing/">QQ个性签名</a></dd>
        <dt><a href="/gexing/chaozhuai/">超拽个性签名</a></dt>
        <dt><a href="/gexing/shanggan/">伤感个性签名</a></dt>
        <dt><a href="/gexing/qm/">经典个性签名</a></dt>
        <dt><a href="/gexing/zt/">个性签名精选</a></dt>
    </dl>
    <dl class="rzDL last">
        <dd><a href="/rizhi/">日志</a></dd>
        <dt><a href="/rizhi/shanggan/">伤感日志</a></dt>
        <dt><a href="/rizhi/gaoxiao/">搞笑日志</a></dt>
        <dt><a href="/rizhi/aiqing/">爱情日志</a></dt>
        <dt><a href="/rizhi/weixiaoshuo/">微小说</a></dt>
    </dl>
    <dl class="pfDL">
        <dd><a href="/qqpifu/">QQ皮肤</a></dd>
        <dt><a href="/qqpifu/nvsheng/">女生皮肤</a></dt>
        <dt><a href="/qqpifu/nansheng/">男生皮肤</a></dt>
        <dt><a href="/qqpifu/ql/">情侣皮肤</a></dt>
        <dt><a href="/qqpifu/kt/">卡通动漫皮肤</a></dt>
    </dl>
    <dl class="ssDL">
        <dd><a href="/shuoshuo/">说说</a></dd>
        <dt><a href="/shuoshuo/shanggan/">伤感说说</a></dt>
        <dt><a href="/shuoshuo/jingdian/">经典说说</a></dt>
        <dt><a href="/shuoshuo/hot/">说说排行</a></dt>

    </dl>
    <dl class="fzDL">
        <dd><a href="/fenzu/">QQ分组</a></dd>
        <dt><a href="/fenzu/gexing/">QQ个性分组</a></dt>
        <dt><a href="/fenzu/qinglv/">QQ情侣分组</a></dt>
        <dt><a href="/fenzu/yingwen/">QQ英文分组</a></dt>
        <dt><a href="/fenzu/z/aiqing/">QQ爱情分组</a></dt>
    </dl>
    <dl class="tpDL last">
        <dd><a href="/tupian/">图片</a></dd>
        <dt><a href="/tupian/weimei/">唯美图片</a></dt>
        <dt><a href="/tupian/oumei/">欧美图片</a></dt>
        <dt><a href="/tupian/dongman/">动漫图片</a></dt>
        <dt><a href="/tupian/wenzi/">文字图片</a></dt>
    </dl>
</div>
<div id="footer">
    <div class="foot wp">
        <p>Copyright &copy; 2007-2017 <a href="http://www.woyaogexing.com">我要个性网</a> <a href="/touxiang/">QQ头像</a> - <a href="/touxiang/katong/">卡通动漫头像</a>频道 woyaogexing.com      |   <a href="/about/declare.html" target="_blank">免责声明</a> </p>
  <p>我要个性所有内容均为用户上传分享，如有侵权请联系我们及时删除</p>
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?a077b6b44aeefe3829d03416d9cb4ec3";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>
    </div>
</div>
<script>
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();
</script>
</body>
</html>
  `

  let $ = cheerio.load(html);
  $('img.lazy').each((i, ele)=>{
    console.log($(ele).prop('src'))
  })
  console.log($('div.listPage').children()[1].attribs.href)

}

f();
