/**
 构造函数
 Touchscroll

 封装的作用
 触摸滑动

 调用实例
 <div id="container">
 <div class="wrapper"></div>
 </div>

 new Touchscroll('#container', '.wrapper');
 new Touchscroll('容器', '内容', {
            bg: 'rgb(100,200,230)',
            width: 4
        });
 */

function Touchscroll(container, content, options) {
    var bg = options && options.bg ? options.bg : 'rgba(0,0,0,0.8)';
    var scrollBarWidth = options && options.width ? options.width : 6;

    //获取外层的容器元素
    var app = document.querySelector(container);
    var content = app.querySelector(content);
    var scrollBar = null;

    //绑定触摸开始事件
    app.addEventListener('touchstart', function (e) {
        this.y = e.touches[0].clientY;
        this.t = transformCSS(content, 'translateY');
        this.startTime = Date.now();
        //即点即停
        if (content.timer && content.timer['translateY']) {
            clearInterval(content.timer['translateY']);
        }

        if (scrollBar.timer && scrollBar.timer['translateY']) {
            clearInterval(scrollBar.timer['translateY']);
        }
    });

    //触摸滑动事件
    app.addEventListener('touchmove', function (e) {
        this._y = e.touches[0].clientY;
        this.translateY = this._y - this.y + this.t;
        //设置
        transformCSS(content, 'translateY', this.translateY);
        //不断的修改 滚动条的位置
        var appHeight = app.offsetHeight;
        var contentHeight = content.offsetHeight;
        var y = -this.translateY / contentHeight * appHeight;

        transformCSS(scrollBar, 'translateY', y);
    });

    //触摸结束事件
    app.addEventListener('touchend', function (e) {
        //获取当前的translateY
        var currentTranslateY = transformCSS(content, 'translateY');
        //计算路程
        this._y = e.changedTouches[0].clientY;
        var disY = this._y - this.y;
        this.endTime = Date.now();
        var disTime = this.endTime - this.startTime;
        //计算速度
        var v = disY / disTime;
        var s = v * 120;

        //计算最终的元素位置
        var translateY = currentTranslateY + s;

        //声明一个变量
        var type = 'easeOut';

        if (translateY >= 0) {
            translateY = 0;
            type = 'backEaseOut';
        }

        var minTranslateY = app.offsetHeight - content.offsetHeight;
        if (translateY <= minTranslateY) {
            translateY = minTranslateY;
            type = 'backEaseOut';
        }

        //计算滚动条的 translateY
        var y = -translateY / content.offsetHeight * app.offsetHeight;
        // transformCSS(scrollBar, 'translateY', y);
        var currentScrollBarTranslateY = transformCSS(scrollBar, 'translateY');

        tweenAnimation(content, 'translateY', currentTranslateY, translateY, 500, 10, type);
        tweenAnimation(scrollBar, 'translateY', currentScrollBarTranslateY, y, 500, 10, type);

        // tweenAnimation(content, 'translateY', currentTranslateY, translateY, 500, 10, type, function(){
        //不断修改 滚动条的位置
        // });
    });

    //初始化
    app.init = function () {
        //父级元素设置 相对定位
        app.style.position = 'relative';

        //创建滚动条
        /**
         * position:absolute;
            right:0;
            top:0;
            width:6px;
            border-radius: 3px;
            height:100px;
            background: rgba(0,0,0,0.8);
         * @type {HTMLDivElement}
         */
        scrollBar = document.createElement('div');
        scrollBar.className = 'scroll-bar';
        scrollBar.style.position = 'absolute';
        scrollBar.style.right = 0;
        scrollBar.style.top = 0;
        scrollBar.style.width = scrollBarWidth+'px';
        scrollBar.style.borderRadius = scrollBarWidth / 2 + 'px';
        scrollBar.style.background = bg;

        //将滚动条插入到容器中
        app.appendChild(scrollBar);

        //计算滚动条的高度
        var h = app.offsetHeight * app.offsetHeight / content.offsetHeight;
        //设置高度
        scrollBar.style.height = h + 'px';
    }

    app.init();
}