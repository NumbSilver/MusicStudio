// 全局代码
(function(){
    // 阻止默认行为
    app.addEventListener('touchstart',function (e){
        e.preventDefault();
    })

    // 移动端适配
    document.documentElement.style.fontSize = document.documentElement.clientWidth/10+'px';
    window.onresize = function (){
        document.documentElement.style.fontSize = document.documentElement.clientWidth/10+'px';
    }
}());
//最后这个小括号放里放外面都一样，但是包起来可以不会让后面的的代码对他产生影响

// 头部逻辑
(function(){
//    点击按钮 显示隐藏
    var app = document.querySelector('#app')
    var menuBtn = document.querySelector('#header .up .menu');
    var mask = document.querySelector('#header .mask');

//    绑定事件
    menuBtn.addEventListener('touchstart',function (){
        // e.stopPropagation();
    //    让按钮状态改变
        this.classList.toggle('open');
    //    使菜单的显示状态改名
        mask.classList.toggle('open');
    });

//    input获取焦点
    var input = document.querySelector('#search');
    input.addEventListener('touchstart',function (e){
        e.stopPropagation();
    })
//    丧失焦点
    app.addEventListener('touchstart',function (){
        input.blur();
    })
}());


// 导航区
(function (){
    var nav =document.querySelector('#main #nav');
    var wrap = nav.querySelector('.wrap');
    var isMoving = false;

    var minTranslateX = nav.offsetWidth -wrap.offsetWidth;

    nav.addEventListener('touchstart',function (e){
        //    获起始点的位置
        this.x = e.touches[0].clientX;
        //    获取当前包裹元素的偏移量
        this.left = transformCSS(wrap,'translateX');
        wrap.style.transition = 'none';
    //    获取触摸开始的时间
        this.startTime = Date.now();
    });

    nav.addEventListener('touchmove',function (e){
        this._x = e.touches[0].clientX;
        var newLeft = this._x-this.x+this.left;
        // 橡皮筋效果 如果越界 移动距离为触点得一半
        if(newLeft>0){
            newLeft = (this._x-this.x)/2;
        }
        if(newLeft<minTranslateX){
            newLeft = minTranslateX+(this._x-this.x)/2;
        }
    //    设置修改
        transformCSS(wrap,'translateX',newLeft);
        //表示导航是否在滑动
        isMoving =true;
        // 阻止冒泡 如果水平方向滑动上下就不能动了
        e.stopPropagation();
    });
    //  绑定触摸结束事件
    nav.addEventListener('touchend',function (e){
        var translateX = transformCSS(wrap,'translateX');
        // 触摸结束时的位置
        this._x = e.changedTouches[0].clientX;
        //计算位移
        var disX = this._x - this.x;
        this.endTime = Date.now();
        var disTime = this.endTime - this.startTime;
        // 惯性移动
        // 计算出的速度
        var v = disX/disTime;
        // 通过v来计算滑动距离
        var s = v*60;
        translateX += s;
        transformCSS(wrap,'translateX',translateX);

        //增加过度
        wrap.style.transition = ' 0.3s ease-out';
        //    判断是否越界
        if(translateX>0){
            transformCSS(wrap,'translateX',0);
            wrap.style.transition = ' 0.3s cubic-bezier(.21,.68,.39,1.71)';
        }
        // var minTranslateX = nav.offsetWidth -wrap.offsetWidth;
        if(translateX<minTranslateX){
            transformCSS(wrap,'translateX',minTranslateX);
            wrap.style.transition = ' 0.3s cubic-bezier(.21,.68,.39,1.71)';
        }
        isMoving = false;
    });

    var navItems = nav.querySelectorAll('li');

    // 绑定事件
    navItems
        .forEach(function (item){
        // 如果用touchstart会出现误触
        item.addEventListener('touchend',function (){
            if(isMoving) return;
            navItems.forEach(function (v){
                v.classList.remove('active');
            })
            this.classList.add('active');
        })
    })
}());

// 轮播图区
(function (){
    new Swiper('#swiper');
}());

// 楼层内容区
(function (){
    //获取楼层元素
    var floors = document.querySelectorAll('.floor');
    floors.forEach(function (floor){
        //点击导航 修改 底部边框元素的位置
        var movedBorder = floor.querySelector('.moved-border');
        //获取导航元素
        var navItems = floor.querySelectorAll('.nav-item');
        //获取幻灯片元素的wrapper
        var wrapper = floor.querySelector('.swiper-wrapper');
        var container = floor.querySelector('.container');
        var swiperSlides = floor.querySelectorAll('.swiper-slide');
        navItems.forEach(function (item,key){
            // 将下标存入元素当中
            item.key = key;
            item.addEventListener('touchstart',function (){
                // 滑动边框切换
                var translateX = this.key * movedBorder.offsetWidth;
                transformCSS(movedBorder,'translateX',translateX);
                // 幻灯片切换
                // swiper中暴露container方法，这样可以直接用switchSlide方法
                s.container.switchSlide(this.key);
            })
        })

        var s = new Swiper(container,{loop: false,
            auto: false,
            pagination: false,
            callback: {
                end:function(){
                    // 获取wrapper的translateX 倒推index值
                    // var translateX = transformCSS(wrapper,'translateX');
                    var index = s.getIndex();
                    transformCSS(movedBorder,"translateX",index*movedBorder.offsetWidth)

                    //    加载当前幻灯片的内容
                    setTimeout(function (){
                        //    获取第一张幻灯片的内容
                        var firstSwiperSlide = floor.querySelector('.swiper-slide');
                        //检测当前幻灯片是否加载
                        var hasLoaded = swiperSlides[index].getAttribute('hasLoaded');
                        if(hasLoaded=='0'){
                            swiperSlides[index].innerHTML = firstSwiperSlide.innerHTML;
                            swiperSlides[index].setAttribute('hasLoaded',1);
                        }

                        //    想要获取哪一张图片内容
                    },1000)
                }}
        });
    })


}());


// 页面滚动
(function (){
//    使内容滚动
    var touchscroll = new Touchscroll('#app', '#main',{
        width:4,
        bg:'rgb(52,69,78)'
    });
}());
