class button {

    lightMode = false;
    moveMode = false;
    posX = null;
    posY = null;
    catchPointX = null;
    catchPointY = null;
    circlesPos = [];
    circlesSizes = [];
    dists = [];

    static HOWMANYCIRCLES = 13;

    constructor () {
        this.target = document.getElementById('wrap-button');
        this.initTargetPos();
        this.light = document.querySelector('#lighted-zone');
        this.message = document.getElementById('message-1');
        this.message2 = document.getElementById('message-2');
        this.events();
        this.circles();
        window.onresize = this.resize.bind(this);
    }

    initTargetPos() {
        this.targetPos = this.target.getBoundingClientRect();
    }

    resize() {
        if (!this.target.style.top) {
            this.initTargetPos();
        }
        this.moveLight();
    }

    events() {
        this.target.addEventListener('mouseover', (e)=>{
            this.over(e);
        });
        this.target.addEventListener('mouseout', (e)=>{
            this.out(e);
        });
        this.target.addEventListener('mousedown', (e)=>{
            this.clic(e);
        });
        this.target.addEventListener('mouseup', (e)=>{
            this.endclic(e);
        });
        document.addEventListener('mousemove', (e)=>{
            this.mousemove(e);
        });
        document.addEventListener('mouseout', (e)=>{
            this.mouseOutWindow(e);
        });
    }

    create(className) {
        let element = document.createElement('div');
        element.classList.add(className);
        return element;
    }

    circles() {
        let nb = button.HOWMANYCIRCLES;

        for(let i=0;i<nb;i++) {
            let circle = this.createCircle(i);
            this.placeCircle(circle);
            let size = this.resizeCircle(circle);
            this.circlesSizes[i] = size;
            this.resizeShadow(circle, size);
        }

        this.updateShadows();
    }

    createCircle(i) {
        // Wrap
        let element = this.create('circle');
        element.classList.add('c-' + i);

        // Body
        let circleBody = this.create('circle-body');

        // Shadow
        let shadow = this.create('shadow');

        // Blured shadow
        let shadowBlur = this.create('shadow-blur');

        // Insertion
        let wrapShadow = document.createElement('div');
        wrapShadow.classList.add('wrap-shadow');
        wrapShadow.appendChild(shadow);
        wrapShadow.appendChild(shadowBlur);

        element.appendChild(circleBody);
        element.appendChild(wrapShadow);
        document.body.appendChild(element);

        return document.querySelector('.c-'+i);
    }

    placeCircle(circle) {
        let topValue = this.giveRandomPoxY();
        let top =  topValue + 'px';

        let leftValue = this.giveRandomPoxX();
        let left =  leftValue + 'px';

        circle.style.top = top;
        circle.style.left = left;
        this.circlesPos.push({top : topValue, left : leftValue});
    }

    resizeCircle(circle) {
        let size = Math.floor( Math.random() * 30 ) + 20;
        let before = circle.querySelector(".circle-body");
        before.style.height = size+'px';
        before.style.width = size+'px';
        before.style.borderRadius = (size/2)+'px';
        return size;
    }

    resizeShadow(circle, size) {
        let wrapShadow = circle.querySelector('.wrap-shadow');
        wrapShadow.style.width = size+'px';
        wrapShadow.style.top = (size/2)+'px';
    }

    giveRandomPoxY() {
        let buttonHeight = 50;
        let output = Math.floor( Math.random() * window.innerHeight );
        if ( output <= (window.innerHeight/2 + buttonHeight) && output >= (window.innerHeight/2 - buttonHeight) ) {
            return this.giveRandomPoxY();
        }
        else {
            return output;
        }
    }

    giveRandomPoxX() {
        let buttonWidth = 167;
        let output = Math.floor( Math.random() * window.innerWidth );
        if ( output <= (window.innerWidth/2 + buttonWidth) && output >= (window.innerWidth/2 - buttonWidth) ) {
            return this.giveRandomPoxX();
        }
        else {
            return output;
        }
    }

    updateShadows() {
        this.updateDistScores();
        let nb = button.HOWMANYCIRCLES;

        for(let i=0;i<nb;i++) {

            let circle = document.querySelector('.c-' + i);
            let shadow = circle.getElementsByClassName('wrap-shadow')[0];
            let blurShadow = circle.querySelector('.shadow-blur');

            let buttonX, buttonY;
            [buttonX, buttonY] = this.getButtonPos(true);
            let top = this.circlesPos[i]['top'];
            let left = this.circlesPos[i]['left'];

            this.rotatingShadow(left, top, buttonX, buttonY, shadow);
            this.flaredShadow(this.dists[i], shadow);
            this.lengthShadow(this.dists[i], shadow);
            this.bluredShadow(this.dists[i], blurShadow);
            this.brightnessCircle(this.dists[i], circle);
        }
    }

    rotatingShadow(left, top, buttonX, buttonY, shadow) {
        let tempX = top - buttonY;
        let tempY = buttonX - left;
        let angle = this.calcAngles(tempX, tempY);
        shadow.style.transform = 'rotate(' + angle + 'deg)';
    }

    flaredShadow(dist, shadow) {
        let deg = dist * 82 / 500;
        deg = deg>82 ? 82 : deg;
        shadow.style.transform += ' perspective(600px) rotateX(' + deg + 'deg)';
    }

    lengthShadow(dist, shadow) {
        shadow.style.height = dist + 'px';
    }

    bluredShadow(dist, blurShadow) {
        if ( dist<=200 ) {
            let temp = dist/200;
            let blur = temp*4;

            blurShadow.style.filter = "blur(" + blur + "px)";
            blurShadow.style.opacity = temp;
        }
    }

    brightnessCircle(dist, circle) {
        if (this.lightMode) {
            let brightness = 800-dist;
            if (brightness>0) {
                brightness = brightness/8;
                circle.style.filter = 'brightness(' + brightness + '%)';
            }
        }
    }

    calcAngles(x, y) {
        return Math.atan2(y, x) * 180 / Math.PI;
    }

    over (e) {
        this.lightMode = true;
        this.handleMessage(true);
        this.handleLightButton(true);
        this.handleBackLight(true);
        this.handleCircleBrightness(true);
        this.updateShadows();
    }

    out (e) {
        if (!this.moveMode) {
            this.lightMode = false;
            this.handleMessage(false);
            this.handleLightButton(false);
            this.handleBackLight(false);
            this.handleCircleBrightness(false);
            this.turnOffCirclesLights();
        }
    }

    handleCircleBrightness(action) {
        let method = action ? 'add' : 'remove';
        let circles = document.getElementsByClassName('circle');
        Array.from(circles).forEach(c=>c.classList[method]('circle-on'));
    }

    handleMessage (action) {
        let method = action ? 'add' : 'remove';
        this.message.classList[method]('up');
        this.message2.classList[method]('up');
    }

    handleLightButton (action) {
        let method = action ? 'add' : 'remove';
        this.target.classList[method]('button-on');
    }

    handleBackLight (action) {
        let method = action ? 'add' : 'remove';
        this.light.classList[method]('lighted-zone-on');
    }

    turnOffCirclesLights() {
        this.circlesPos.forEach((c, i)=>{
            let circle = document.querySelector('.c-'+i);
            circle.style.filter = "brightness(0%)";
        });
    }

    getButtonPos(centered) {
        let buttonX = this.target.style.left || this.targetPos.left;
        let buttonY = this.target.style.top || this.targetPos.top;
        if (typeof(buttonX)==='string') { buttonX = parseInt( buttonX.slice(0, buttonX.length-2) ); }
        if (typeof(buttonY)==='string') { buttonY = parseInt( buttonY.slice(0, buttonY.length-2) ); }
        return centered ? [buttonX + 83.5, buttonY] : [buttonX, buttonY];
    }

    clic (e) {
        this.moveMode = true;
        let buttonX, buttonY;
        [buttonX, buttonY] = this.getButtonPos(false);

        this.catchPointX = this.posX - buttonX;
        this.catchPointY = this.posY - buttonY;
    }

    endclic (e) {
        this.moveMode = false;
    }

    mouseOutWindow(e) {
        if(this.moveMode && e.toElement.nodeName == 'HTML') {
            this.moveMode = false;
            this.out();
        }
    }

    mousemove (e) {
        if (!this.moveMode) {
            this.posX = e.clientX;
            this.posY = e.clientY;
        }
        else {
            if (!this.collisionTest(e)) {
                this.posX = e.clientX;
                this.posY = e.clientY;
                this.moveBox();
            }
            else {
                this.posX = e.clientX;
                this.posY = e.clientY;
            }
        }
    }

    collisionTest(e) {
        let left, top;
        [left, top] = this.getBoxPosFromMousePos(e.clientX, e.clientY);
        let bigObjectExtremities = this.getExtremities(top, left, 50, 167);

        let closeCircles = this.getCloseCircles();
        let results = closeCircles.map(i=>{
            let top, left;
            ({top, left} = this.circlesPos[i]);
            let size = this.circlesSizes[i];
            let smallObjectExtremities = this.getExtremities(top, left, size);
            return this.compareExtremities(smallObjectExtremities, bigObjectExtremities);
        });
        return results.some(Boolean);
    }

    compareExtremities(small, big) {
        let verticalSuperposition = (small, big) => {
            return ((big.maxTop <= small.maxTop) && (big.maxBottom >= small.maxTop)) || ((big.maxTop <= small.maxBottom) && (big.maxBottom >= small.maxBottom));
        };
        let horizontalSuperposition = (small, big) => {
            return (small.maxLeft <= big.maxRight) && (small.maxLeft >= big.maxLeft) || (small.maxRight >= big.maxLeft) && (small.maxRight <= big.maxRight);
        };

        if ( horizontalSuperposition(small, big) ) {
            if ( verticalSuperposition(small, big) ) {
                return true;
            }
        }
        return false;
    }

    getExtremities(top, left, sizeH, sizeW) {
        sizeW = sizeW || sizeH;
        return {
            maxTop : top,
            maxBottom : top+sizeH,
            maxLeft : left,
            maxRight : left+sizeW
        };
    }

    getCloseCircles() {
        let closeCircles = this.dists.map((d,i)=>{
            if (d<150) { return i; }
        });

        let result = closeCircles.filter(c=>{
            if (typeof(c)==='number') {
                return c.toString();
            }
        });
        return result;
    }

    getBoxPosFromMousePos(mouseX,mouseY) {
        let left = (mouseX-this.catchPointX);
        let top = (mouseY-this.catchPointY);
        return [left, top];
    }

    moveBox() {
        let x, y;
        [x, y] = this.getBoxPosFromMousePos(this.posX, this.posY);
        this.target.style.left = x+'px';
        this.target.style.top = y+'px';
        this.moveLight();
        this.updateShadows();
    }

    updateDistScores() {
        this.dists = this.circlesPos.map((c, i)=>this.calcDist(i));
    }

    calcDist(i) {
        let topC = this.circlesPos[i]['top'];
        let leftC = this.circlesPos[i]['left'];
        let topB, leftB;
        [leftB, topB] = this.getButtonPos(true);

        let tempTop = topB - topC;
        let tempLeft = leftB - leftC;
        let sqDist = tempTop**2 + tempLeft**2;
        return Math.sqrt(sqDist);
    }

    moveLight() {
        let buttonX, buttonY;
        [buttonX, buttonY] = this.getButtonPos(true);
        this.light.style.left = ( (buttonX+83.5) - window.innerWidth )+'px';
        this.light.style.top = ( (buttonY+25) - window.innerHeight )+'px';
    }

}


let pass = document.querySelector('#pass-intro');
let intro = document.querySelector('#intro');
pass.addEventListener('click', e=>{
    intro.classList.add('intro-leaves');
    new button();
});


// Future improvements

// class panel {
//
//     dots = [];
//
//     constructor() {
//         this.dots = Array.from(document.getElementsByClassName('colored-dot'));
//         this.events();
//     }
//
//     events() {
//         this.dots.forEach(d=>d.addEventListener('click', (e)=>{
//             this.clic(e.target);
//         }));
//     }
//
//     clic(d) {
//         let color = d.getAttribute('data-color');
//         test(color);
//     }
//
// }

// new panel();