(function(){
    window.initAlbum = function() {
        var ls = document.querySelectorAll('.album_wrapper[initiated="false"]')
        for(var i of ls){
            _initAlbum(i);
        }
    }

    var UpdateTimer = null;

    window.requestUpdateAlbums = function () {
        clearTimeout(UpdateTimer);
        UpdateTimer = setTimeout(function() {
            initAlbum();
        },100);
    }

    var _initAlbum = function (album){
        var layer = album.querySelector(".album_layer");
        filterAlbum(layer);
        var items = layer.querySelectorAll(".album_item");
        if(items.length === 1){
            album.classList.add("signle_image");
            album.setAttribute("initiated","true");
            return;
        }
        var iC = items.length;
        var aI = [items[0].cloneNode(true),items[1].cloneNode(true)];
        var pI = [items[iC-2].cloneNode(true),items[iC-1].cloneNode(true)];
        layer.firstElementChild.before(pI[0],pI[1]);
        layer.lastElementChild.after(aI[0],aI[1]);
        for(var it of (aI.concat(pI))){
            it.classList.add("album_item_placeholder");
        }
        items = layer.querySelectorAll(".album_item");
        var alignTimer = -1;
        layer.addEventListener("scroll",function(e){
            checkOverflow(layer,items);
            calcItems(layer,items);
            clearTimeout(alignTimer);
            alignTimer = setTimeout(function(){
                alignItem(layer,items);
            },250);
        });
        checkOverflow(layer,items);
        alignItem(layer,items);
        initButtons(album,layer,items);
        
        album.setAttribute("initiated","true");
        
    }

    var initButtons = function(album,layer,items){
        var lBtn = album.querySelector(".album_ctrl.left");
        var rBtn = album.querySelector(".album_ctrl.right");
        lBtn.addEventListener("click",function(){switchPic(layer,items,false)});
        rBtn.addEventListener("click",function(){switchPic(layer,items,true)});
    }

    var switchPic = function(layer,items,backward) {
        var sW = layer.offsetWidth;
        var current = findBaseNearItem(layer,items);
        var next = backward ? current.nextElementSibling : current.previousElementSibling;
        animateProp(layer,{
            propName: "scrollLeft",
            duration: "250",
            value: next.offsetLeft + (next.offsetWidth / 2) - (sW / 2)
        });

    }

    var findBaseNearItem = function(layer,items){
        var sL = layer.scrollLeft;
        var sW = layer.offsetWidth;
        var sR = sL + sW;
        var base = sL + sW/2;
        var offsets = [];
        for(var item of items){
            if(item.offsetLeft + item.offsetWidth > sL && item.offsetLeft < sR){
                offsets.push({
                    obj: item,
                    offset: Math.abs(base-(item.offsetLeft + item.offsetWidth/2))
                });
            } else if (item.offsetLeft > sR) {
                break;
            }
        }
        var min = offsets[0];
        for(var item of offsets){
            min = min.offset > item.offset ? item : min;
        }
        return min.obj;
    }
    var calcItems = function(layer,items){
        var sL = layer.scrollLeft;
        var sW = layer.offsetWidth;
        var sR = sL + sW;
        var base = sL + sW/2;
        for(var item of items){
            if(item.offsetLeft + item.offsetWidth > sL && item.offsetLeft <= sR){
                calcItem(base,sW,item);
            } else if (item.offsetLeft > sR) {
                break;
            }
        }
    }

    var alignItem = function (layer,items) {
        var sW = layer.offsetWidth;
        min = findBaseNearItem(layer,items);
        animateProp(layer,{
            propName: "scrollLeft",
            duration: "250",
            value: min.offsetLeft + (min.offsetWidth / 2) - (sW / 2)
        });
    }

    var animateProp = function(target,opt){
        var aObj = document.createElement("a");
        aObj.setAttribute("style","position: fixed; visibility: hidden; opactiy: 0;left: 0px;");
        aObj.style.transitionDuration = opt.duration.toString() + "ms";
        document.body.append(aObj);
        void aObj.offsetLeft;
        var targetVal = parseInt(opt.value - target[opt.propName]);
        aObj.style.left = targetVal.toString() + "px";
        var run = 0;
        aObj.runner = setInterval(function(){
            target[opt.propName] += aObj.offsetLeft - run;
            run = aObj.offsetLeft;
            if(aObj.offsetLeft == targetVal){
                clearInterval(aObj.runner);
                if(typeof opt.callback == "function"){
                    opt.callback();
                }
                aObj.remove();
            }
        },10);
    }

    var calcItem = function(base,baseW,item) {
        var ibase = item.offsetLeft + item.offsetWidth/2;
        var scale = (ibase - base) / baseW * 2;
        var ascale = Math.abs(scale);
        item.style.opacity = (1 - 0.5*ascale).toString();
        item.style.transform = "scale(" + (1 - 0.3 * ascale) + ") translateX(" + (-0.2 * scale)*100 + "%)";
    }

    var checkOverflow = function (layer,items) {
        if(layer.mod){return;}
        layer.mod = true;
        var sL = layer.scrollLeft;
        var iC = items.length;
        var fI = items[1].offsetLeft;
        var lI = items[iC - 3].offsetLeft;
        if(sL < fI){
            layer.scrollLeft = lI - 5;
        } else if (sL > lI) {
            layer.scrollLeft = fI + 5;
        }
        layer.mod = false;
    }

    var filterAlbum = function (layer) {
        var it_ls = layer.querySelectorAll(".album_item");
        var tx_ls = layer.querySelectorAll(".album_item .album_text");
        layer.innerHTML = "";
        for(var it of it_ls){
            layer.appendChild(it);
        }
        for(var tx of tx_ls){
            tx.innerHTML = tx.innerText;
        }
    }
})();