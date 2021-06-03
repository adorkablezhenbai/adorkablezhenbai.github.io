function $(ontainer) {
    return document.querySelector(ontainer);
}

function createSlider(container, duration, callback) {
    let banner=$(container);
    let width = banner.clientWidth;
    let count = banner.children.length;
    var subindex=2;
    if(duration){
        banner.style.transition = ".7s"  ;  
    }
    function swichTo(subindex) {
        // if(subindex==count-1){
        //     console.log(subindex);
        //     subindex=0;
        //     banner.style.transition = "none"; 
           
        //     banner.style.marginLeft=-width*(index-1)+"px";
        //     banner.style.transition = duration/1000+"s" ; 
        //     subindex=1;
        // }
        // else if(subindex==0){
        //     banner.style.transition = "none"; 
           
        //     banner.style.marginLeft=-width*(index-1)+"px";
        //     banner.style.transition = duration/1000+"s" ;
        //     subindex=1;
        //     }
        // else{
        banner.style.marginLeft=-width*(subindex-1)+"px";
        callback && callback(subindex);
        // }
    }
    function startAuto() {
        // if(!duration){
        //     return;
        // }
        timer=setInterval(function () {
            subindex++;
            if(subindex>=(count-1)){
                subindex=(count-1);
                swichTo(subindex); 
                setTimeout(() => {
                    subindex=1;
                    banner.style.transition = "none";
                    banner.style.marginLeft=-width*(subindex-1)+"px";
            }, 701);}//这里的时间应该时大于动画时间 小于间隔时间
            else{
            banner.style.transition = "0.7s";
            swichTo(subindex); 
            }
        }, 3000);
    }
    startAuto();

    function stopAuto(){
        clearInterval(timer);
        banner.style.transition = "none"; 
    }
    banner.ontouchstart=function(e){
        stopAuto();
        var ml=parseFloat(banner.style.marginLeft) || 0;
        var x=e.touches[0].clientX;
        banner.ontouchmove=function(e){
            var disx = e.touches[0].clientX - x;
            let newml =  ml+disx;
            var minML = -(count - 1) * width;
            if (newml < minML) {
                newml = minML;
              }
            if(newml>-width)
            {
                newml=-width;
            }
            banner.style.marginLeft=newml+"px";
        };
        banner.ontouchend=function(e){
            banner.style.transition = "0.4s";
            var disx = e.changedTouches[0].clientX - x;
            if(disx>0 ){
                if (subindex == 2) {
                    subindex--;
                    banner.style.marginLeft=0+"px";
                    setTimeout(() => {
                        subindex=count-1;
                        callback && callback(subindex);
                        banner.style.transition = "none";
                        banner.style.marginLeft=-width*(subindex-1)+"px";
                        
                }, 401);//这里设置要大于上方设置的0.4s，可以使动画更平滑，它们的差值越小越好
            }else {
                subindex--;
                swichTo(subindex);
            }
            }
            else if(disx<0){
                
                if (subindex == 4) {
                    subindex++;
                    banner.style.marginLeft=-width*(subindex-1)+"px";
                    setTimeout(() => {
                        subindex=2;
                        callback && callback(subindex);
                        banner.style.transition = "none";
                        banner.style.marginLeft=-width*(subindex-1)+"px";
                        
                }, 401);
                }else {
                    subindex++;
                    swichTo(subindex);
                }
               
            }
        };
        startAuto();
    };
    return swichTo;
}
//无无限滑动版本轮播图（适用于从外部读取数据）
function createSliderm(container, duration, callback) {
    var firstItem = container.querySelector('.slider-item'); // 第一个子元素
    var cw = container.clientWidth; // 容器宽度
    var count = container.children.length; // 轮播项的数量
    var curIndex = 0; // 记录当前显示的是第几个
  
    /**
     * 设置容器高度为当前显示板块的高度
     */
    function setHeight() {
      container.style.height = container.children[curIndex].offsetHeight + 'px';
    }
  
    setHeight();
    /**
     * 切换到指定的子项
     * @param {Number} index 指定下标
     */
    function switchTo(index) {
      // 判断index的取值范围
      if (index < 0) {
        index = 0;
      }
      if (index > count - 1) {
        index = count - 1;
      }
      curIndex = index; // 改变当前显示的索引
      firstItem.style.transition = '.3s'; // css属性在0.3秒钟内完成变化
      // 设置它的 marginLeft 为-xx容器宽度
      firstItem.style.marginLeft = -index * cw + 'px';
      setHeight();
      // 切换后调用callback
      callback && callback(index);
    }
  
    // 实现自动切换
    var timer; // 自动切换的计时器
  
    // 开始自动切换
    function startAuto() {
      if (timer || duration === 0) {
        // 已经有计时器了，说明已经正在自动切换中
        // 或
        // 不能自动切换
        return;
      }
      timer = setInterval(function () {
        switchTo((curIndex + 1) % count);
      }, duration);
    }
  
    // 停止自动切换
    function stopAuto() {
      clearInterval(timer);
      timer = null;
    }
  
    startAuto(); // 开始自动切换
  
    // 手指滑动切换
    container.ontouchstart = function (e) {
      var x = e.touches[0].clientX; // 记录按下的横坐标
      var y = e.touches[0].clientY;
      var mL = parseFloat(firstItem.style.marginLeft) || 0; // 记录元素的当前marginLeft
      // 停止自动切换
      stopAuto();
      // 停止过渡效果
      firstItem.style.transition = 'none';
      // 手指移动
      container.ontouchmove = function (e) {
        var disX = e.touches[0].clientX - x; //手指在横轴上移动了多远
        var disY = e.touches[0].clientY - y;
        // 如果横向的移动距离小于了纵向的移动距离，啥也不做
        if (Math.abs(disX) < Math.abs(disY)) {
          return;
        }
  
        var newML = mL + disX; // 计算新的marginLeft
        var minML = -(count - 1) * cw; // 最小的marginLeft
        if (newML < minML) {
          newML = minML;
        }
        if (newML > 0) {
          newML = 0;
        }
  
        e.preventDefault();
        firstItem.style.marginLeft = newML + 'px';
      };
  
      // 手指放开
      container.ontouchend = function (e) {
        var disX = e.changedTouches[0].clientX - x; //手指在横轴上移动了多远
        if (disX < -30) {
          // 向左滑动
          switchTo(curIndex + 1);
        } else if (disX > 30) {
          // 向右滑动
          switchTo(curIndex - 1);
        }
        // 自动切换开始
        startAuto();
      };
    };
  
    return switchTo;
  }
var dots=$('.dots');
banner1=createSlider(".slider-container1",1000,function(subindex){//切换轮播图后执行的函数
        var ac = dots.querySelector('.active'); 
        ac && ac.classList.remove('active');
        dots.children[subindex-2].classList.add('active');
});
//通过白点控制轮播图位置
selectdots=dots.querySelectorAll('span');
for(let i=0,length=selectdots.length;i<length;i++){
    var selectdot=selectdots[i];
    selectdot.onclick= function(e){
        banner1(i+2);
    }
}
(function () {
    var isExpand = false; // 当前是否是展开状态
    $('.menu .expand').onclick = function () {
      var txt = this.querySelector('.txt');
      var spr = this.querySelector('.spr');
      var menuList = $('.menu .menu-list');
      if (isExpand) {
        // 当前是展开的
        txt.innerText = '展开';
        spr.classList.add('spr_expand');
        spr.classList.remove('spr_collapse');
        menuList.style.flexWrap = 'nowrap'; // 弹性盒不换行
      } else {
        // 当前是折叠
        txt.innerText = '折叠';
        spr.classList.add('spr_collapse');
        spr.classList.remove('spr_expand');
        menuList.style.flexWrap = 'wrap'; // 弹性盒换行
      }
      isExpand = !isExpand;
    };
  })();
  //从json中读取数据
(async function () {
var resp = await fetch('./data/news.json').then(function (resp) {
    return resp.json();
});
var sliderContainer = $('.news-list .slider-container');
// 生成新闻的元素
sliderContainer.innerHTML = Object.values(resp)
    .map(function (item) {
    return `<div class="slider-item">${item
        .map(function (item) {
        // item: 每一个新闻对象
        return `<div class="news-item ${item.type}">
    <a href="${item.link}">${item.title}</a>
    <span>${item.pubDate}</span>
    </div>`;
        })
        .join('')}</div>`;
    })
    .join('');
    // createBlock($('.news-list')); // 这个时候还没有元素
    var newsdots=$('.news-list .block-menu');
    banner2=createSliderm($('.news-list .slider-container'),0,function(index){
        var ac = newsdots.querySelector('.active'); 
        ac && ac.classList.remove('active');
        newsdots.children[index].classList.add('active');
    })
    selectnewsdots=newsdots.querySelectorAll('span');
    for(let i=0,length=selectnewsdots.length;i<length;i++){
    let selectdot=selectnewsdots[i];
    selectdot.onclick= function(e){
        banner2(i+2);
    }
}
})();
(async function () {
  var resp = await fetch('./data/hero.json').then(function (resp) {
    return resp.json();
  });
  var sliderContainer = $('.hero-list .slider-container');

  // 创建热门英雄
  createSliderItem(
    resp.filter(function (item) {
      return item.hot === 1;
    })
  );
  for (var i = 1; i <= 6; i++) {
    createSliderItem(
      resp.filter(function (item) {
        return item.hero_type === i || item.hero_type2 === i;
        // return [item.hero_type, item.hero_type2].includes(1)
      })
    );
  }

  function createSliderItem(heros) {
    var div = document.createElement('div');
    div.className = 'slider-item';
    div.innerHTML = heros
      .map(function (item) {
        return `<a>
        <img
          src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${item.ename}/${item.ename}.jpg"
        />
        <span>${item.cname}</span>
      </a>`;
      })
      .join('');
    sliderContainer.appendChild(div);
  }
  let newsdots=$('.hero-list .block-menu');
  banner3=createSliderm($('.hero-list .slider-container'),0,function(index){
      var ac = newsdots.querySelector('.active'); 
      ac && ac.classList.remove('active');
      newsdots.children[index].classList.add('active');
  })
  selectnewsdots=newsdots.querySelectorAll('span');
  for(let i=0,length=selectnewsdots.length;i<length;i++){
  let selectdot=selectnewsdots[i];
  selectdot.onclick= function(e){
      banner2(i+2);
  }
  }
})();

(async function () {
  var resp = await fetch('./data/video.json').then(function (resp) {
    return resp.json();
  });
  var sliderContainer = $('.video-list .slider-container');
  // 生成视频的元素
  for (var key in resp) {
    var videos = resp[key];
    // 生成一个slider-item
    var div = document.createElement('div');
    div.classList.add('slider-item');
    var html = videos
      .map(function (item) {
        // item: 每一个视频对象
        return `<a
        href="${item.link}"
      >
        <img src="${item.cover}" />
        <div class="title">
          ${item.title}
        </div>
        <div class="aside">
          <div class="play">
            <span class="spr spr_videonum"></span>
            <span>${item.playNumber}</span>
          </div>
          <div class="time">${item.pubDate}</div>
        </div>
      </a>`;
      })
      .join('');
    div.innerHTML = html;
    sliderContainer.appendChild(div);

  }
  let newsdots=$('.video-list .block-menu');
  banner4=createSliderm($('.video-list .slider-container'),0,function(index){
      var ac = newsdots.querySelector('.active'); 
      ac && ac.classList.remove('active');
      newsdots.children[index].classList.add('active');
  })
  selectnewsdots=newsdots.querySelectorAll('span');
  for(let i=0,length=selectnewsdots.length;i<length;i++){
  let selectdot=selectnewsdots[i];
  selectdot.onclick= function(e){
      banner4(i);
  }
  }
})();
 