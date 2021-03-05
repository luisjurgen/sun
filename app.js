//-------------------------globales------------------//
//DOM ELEMENTS
const SVG_CONTAINER_VALUES={
    width:3000,
    height:3000,
    sunYPos:600,
}
const $gameContainer = document.querySelector('#game');
const $shotContainer = document.querySelector('#shotsContainer');
const $flowersContainer = document.querySelector('#flowersContainer');
const $flowerShotContainer = document.querySelector('#flowerShotContainer');
const $cursorContainer= document.querySelector('#cursorContainer');
const $background = document.querySelector('#background');
let gameClientProperties; //the getBoundgVlientRectValues


//globalVariable&Constant
const FLOWERS_PER_ROW= 9;
const FLOWER_COOLDOWN=7;

//variableInteractiveElements 
const INTERACTIVE_ELEMENTS={
  numFrames:96,
  mouseX:0,
  mouseY:0,
  interactiveAngle:0,
}

const COLORS={
    sad: 'rgb(126,126,126)',
    sadPetal: 'rgb(48,48,48)',
    yellow: 'rgb(255,240,0)',
    pink: 'rgb(238,111,165)',
    red: 'rgb(246,89,66)',
    orange: 'rgb(246,143,66 )',
    green: 'rgb(73, 179,104)',
    black: 'rgb(52,52,52)',
    blue: 'rgb(0,141,203)',
    red:'rgb(232,79,67)',
    purple: 'rgb(132,99,165)',
    white:'rgb(239,239,239)',
    gray:'rgb(182,180,179)',

}
const GAME_STATE={
    lastTime: Date.now(), 
    isPressed:false, 
    currentColor:COLORS.yellow, 
    flowers:[],
    shots:[],
    flowerShots:[],

}


//-------------------------class-------------------//
class Sun{
    constructor(x,y){
        this.xInit=x;
        this.yInit=y;
        this.x=this.xInit;
        this.y=this.yInit;
        this.radians=0;
        this.$sunGroup=document.createElementNS('http://www.w3.org/2000/svg','g');
        this.$sunCall = document.createElementNS('http://www.w3.org/2000/svg','use');
        this.widthSVG=800;
        this.heightSVG=800;
        this.xOffset=this.widthSVG/-2;
        this.yOffset=this.heightSVG/-2;

        this.minMouseX=350;
        this.minMouseY=150;

        this.sunRayColor=GAME_STATE.currentColor;

        this.life=100;
    


    }
    createSun(){ 
        let sunPath = `
        <symbol id="sunParts"viewBox="0 0 800 800"  >
            <g id="sunRays">
            <path class="sunRays" d="M389.8,15.88,331.54,133.74a11,11,0,0,0,9.86,15.88H457.92a11,11,0,0,0,9.87-15.88L409.52,15.88A11,11,0,0,0,389.8,15.88Z"/>
            <path class="sunRays" d="M165.9,95,188,224.64a11,11,0,0,0,17.32,7.05l94.27-68.5a11,11,0,0,0-1.35-18.64L181.86,83.44A11,11,0,0,0,165.9,95Z"/>
            <path class="sunRays" d="M31.29,290.68l94.09,91.83A11,11,0,0,0,143.53,378l36-110.82a11,11,0,0,0-12-14.29l-130.1,19A11,11,0,0,0,31.29,290.68Z"/>
            <path class="sunRays" d="M37.39,528.08l130.1,19a11,11,0,0,0,12-14.29L143.53,422a11,11,0,0,0-18.15-4.47L31.29,509.32A11,11,0,0,0,37.39,528.08Z"/>
            <path class="sunRays" d="M182.54,716.56,299,655.45a11,11,0,0,0,1.35-18.64L206,568.31a11,11,0,0,0-17.31,7.05L166.58,705A11,11,0,0,0,182.54,716.56Z"/>
            <path class="sunRays" d="M410.2,784.12l58.26-117.86a11,11,0,0,0-9.86-15.88H342.08a11,11,0,0,0-9.87,15.88l58.27,117.86A11,11,0,0,0,410.2,784.12Z"/>
            <path class="sunRays" d="M634.1,705,612,575.36a11,11,0,0,0-17.32-7.05l-94.27,68.5a11,11,0,0,0,1.35,18.64l116.42,61.11A11,11,0,0,0,634.1,705Z"/>
            <path class="sunRays" d="M768.71,509.32l-94.09-91.83A11,11,0,0,0,656.47,422l-36,110.82a11,11,0,0,0,12,14.29l130.1-19A11,11,0,0,0,768.71,509.32Z"/>
            <path class="sunRays" d="M761.94,271.92l-130.11-19a11,11,0,0,0-12.05,14.29l36,110.82a11,11,0,0,0,18.15,4.47L768,290.68A11,11,0,0,0,761.94,271.92Z"/>
            <path class="sunRays" d="M617.46,83.44,501.05,144.55a11,11,0,0,0-1.35,18.64L594,231.69a11,11,0,0,0,17.31-7.05L633.42,95A11,11,0,0,0,617.46,83.44Z"/>
            </g>
            <g id="faceCircle">
                <circle class="circleSun" cx="400" cy="400" r="278.76"/>
            </g>
            
            <use href="#happy0048" id="useSunFrame"></use>
          
        </symbol>          
        `;
       


        this.$sunCall.setAttribute('href','#sunParts');
        this.$sunCall.setAttribute('width',this.widthSVG);
        this.$sunCall.setAttribute('height',this.heightSVG);
        this.$sunCall.setAttribute('x',this.xOffset);
        this.$sunCall.setAttribute('y',this.yOffset);
        this.$sunCall.setAttribute('id','sun');
        
        this.$sunGroup.innerHTML=sunPath; 
        this.$sunGroup.appendChild(this.$sunCall);   
        $gameContainer.appendChild(this.$sunGroup);

        let $circleSun = document.querySelector('.circleSun');
        $circleSun.setAttribute('fill',COLORS.yellow);



    }
    rotateSunRays(){
      let $sunRays = document.querySelector('#sunRays');
      $sunRays.setAttribute('transform',`rotate(${INTERACTIVE_ELEMENTS.interactiveAngle*-50} 400 400)`);
    }
    updatePosSun(){
       let values=rotateValuesOffset(this.xInit,this.yInit,this.radians,this.minMouseX,this.minMouseY,(-GAME_STATE.lastTime/1000)*8,20,20);
       this.x=values.dx;
       this.y=values.dy;
        
        this.updateFrameSun(this.x,this.y); 
        this.rotateSunRays(); 

        if(GAME_STATE.isPressed){
            let shot = new Shot(this.x,this.y,this.radians,GAME_STATE.currentColor);
            shot.createShot();
            GAME_STATE.shots.push(shot);
            GAME_STATE.isPressed=false;
        }
        
        
        
        
        
      
        setPostition(this.$sunCall,this.x, this.y);
    }
    updateFrameSun(x,y){
        let $useSunFrame = document.querySelector('#useSunFrame');

        let minValues = mousePositionMinimum(this.radians,this.minMouseX, this.minMouseY);

        let value = formatNumberFrame(x,y,minValues.x, minValues.y,sun);

        let $circleSun = document.querySelector('.circleSun');
        let $sunRays= document.querySelector('#sunRays');
        
        
        
        if(this.life<=0){
            $circleSun.setAttribute('fill',COLORS.sad);
            $sunRays.setAttribute('fill',COLORS.sad);
            setAttributeUse($useSunFrame,'sad',value);

        }else{
            
            $sunRays.setAttribute('fill',GAME_STATE.currentColor);
            $circleSun.setAttribute('fill',COLORS.yellow);
            setAttributeUse($useSunFrame,'happy',value);
            $background.style.background=GAME_STATE.currentColor;
            


        }

        
    }
}

class Flower{
    constructor(x,y,row,col,index){
        this.index = index;
        this.xInit=x;
        this.yInit=y;

        this.x=0;
        this.y=0;

        this.row=row;
        this.col=col;
        this.index=index;
        this.radians=0;
        this.randomRotateValue=rand(100,500);
        this.randomDirection=rand(-1,1);
        this.randomStemValue= rand(100,1000);
        this.$groupFlowerStem = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.$flowerGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.$flowerCall = document.createElementNS('http://www.w3.org/2000/svg','use');
        this.$stemPathBorder = document.createElementNS('http://www.w3.org/2000/svg','path');
        this.$stemPathInner = document.createElementNS('http://www.w3.org/2000/svg','path');
        this.widthSVG=300;
        this.heightSVG=300;
        this.xOffset=this.widthSVG/-2;
        this.yOffset=this.heightSVG/-2;

        this.COOLDOWN = rand(4,FLOWER_COOLDOWN);

        this.isHappy=false;
        this.faceColor;
        this.colorPetal=COLORS.sad;

        this.minMouseX=-150;
        this.minMouseY=-150;

    }
    createFlower(){
        let flowerPath=`
        <symbol viewBox="0 0 800 800" id="flower${this.index}">
            <!-- <g>  
                <path d="M 400 400 C 800 800 0 1600 400 2400" class="stem"/>
            </g>-->
            <g id="petalGroup${this.index}">
                <path class="petalSad" d="M480.19,84.85a74.12,74.12,0,0,1-1.74,16l-1.52,5.8L400,400,321.33,107.33l-1.7-6.34a74.05,74.05,0,0,1-1.76-16.14c0-42.79,36.33-77.49,81.16-77.49S480.19,42.06,480.19,84.85Z"/>
                <path class="petalSad" d="M311.87,87a74.49,74.49,0,0,1,6.49,14.71l1.59,5.79L400,400,185.54,185.87l-4.65-4.64a73.5,73.5,0,0,1-9.59-13.09C149.9,131.08,164,82.86,202.84,60.45S290.47,49.92,311.87,87Z"/>
                <path class="petalSad" d="M167.17,173a74.11,74.11,0,0,1,13,9.5l4.27,4.22L400,400,107.21,321.79l-6.35-1.69A74.69,74.69,0,0,1,86,313.56c-37.07-21.4-48.94-70.22-26.53-109S130.1,151.59,167.17,173Z"/>
                <path class="petalSad" d="M84.85,319.81a74.12,74.12,0,0,1,16,1.74l5.8,1.52L400,400,107.33,478.67l-6.34,1.7a74.05,74.05,0,0,1-16.14,1.76C42.06,482.13,7.36,445.8,7.36,401S42.06,319.81,84.85,319.81Z"/>
                <path class="petalSad" d="M87,488.13a74.49,74.49,0,0,1,14.71-6.49l5.79-1.59L400,400,185.87,614.46l-4.64,4.65a73.5,73.5,0,0,1-13.09,9.59C131.08,650.1,82.86,636,60.45,597.16S49.92,509.53,87,488.13Z"/>
                <path class="petalSad" d="M173,632.83a74.11,74.11,0,0,1,9.5-13l4.22-4.27L400,400,321.79,692.79l-1.69,6.35A74.69,74.69,0,0,1,313.56,714c-21.4,37.07-70.22,48.94-109,26.53S151.59,669.9,173,632.83Z"/>
                <path class="petalSad" d="M319.81,715.15a74.12,74.12,0,0,1,1.74-16l1.52-5.8L400,400l78.67,292.67,1.7,6.34a74.05,74.05,0,0,1,1.76,16.14c0,42.79-36.33,77.49-81.16,77.49S319.81,757.94,319.81,715.15Z"/>
                <path class="petalSad" d="M488.13,713a74.49,74.49,0,0,1-6.49-14.71l-1.59-5.79L400,400,614.46,614.13l4.65,4.64a73.5,73.5,0,0,1,9.59,13.09c21.4,37.06,7.28,85.28-31.54,107.69S509.53,750.08,488.13,713Z"/>
                <path class="petalSad" d="M632.83,627a74.11,74.11,0,0,1-13-9.5l-4.27-4.22L400,400l292.79,78.21,6.35,1.69A74.69,74.69,0,0,1,714,486.44c37.07,21.4,48.94,70.22,26.53,109S669.9,648.41,632.83,627Z"/>
                <path class="petalSad" d="M715.15,480.19a74.12,74.12,0,0,1-16-1.74l-5.8-1.52L400,400l292.67-78.67,6.34-1.7a74.05,74.05,0,0,1,16.14-1.76c42.79,0,77.49,36.33,77.49,81.16S757.94,480.19,715.15,480.19Z"/>
                <path class="petalSad" d="M627,167.17a74.11,74.11,0,0,1-9.5,13l-4.22,4.27L400,400l78.21-292.79,1.69-6.35A74.69,74.69,0,0,1,486.44,86c21.4-37.07,70.22-48.94,109-26.53S648.41,130.1,627,167.17Z"/>
                <path class="petalSad" d="M713,311.87a74.49,74.49,0,0,1-14.71,6.49L692.52,320,400,400,614.13,185.54l4.64-4.65a73.5,73.5,0,0,1,13.09-9.59c37.06-21.4,85.28-7.28,107.69,31.54S750.08,290.47,713,311.87Z"/>
            </g>
             
            <g id="faceCircle">
            <circle id="circleFlower${this.index}" class="circleFlower" cx="400" cy="400" r="278.76"/>
            </g>
            <use href="#sad0048" id="useFlowerFrame${this.index}"></use>
        </symbol>
        `
        this.$groupFlowerStem.appendChild(this.$stemPathBorder);
        this.$groupFlowerStem.appendChild(this.$stemPathInner);
        this.$stemPathBorder.classList.add('stemBorder');
        this.$stemPathInner.classList.add('stemInner');

        this.$flowerCall.setAttribute('href',`#flower${this.index}`);
        this.$flowerCall.setAttribute('width',this.widthSVG);
        this.$flowerCall.setAttribute('height',this.heightSVG);
        this.$flowerCall.setAttribute('x',this.xOffset);
        this.$flowerCall.setAttribute('y',this.yOffset);
        this.$flowerCall.setAttribute('id',`useFlowerFrame${this.index}`);

        this.$flowerGroup.innerHTML=flowerPath;
        this.$flowerGroup.appendChild(this.$flowerCall);
        
        this.$groupFlowerStem.appendChild(this.$flowerGroup);
        
        $flowersContainer.appendChild(this.$groupFlowerStem);

    }
    rotateFlowerPetal(){
        let $petalGroup= document.querySelector(`#petalGroup${this.index}`);
        $petalGroup.setAttribute('transform',`rotate(${INTERACTIVE_ELEMENTS.interactiveAngle*50} 400 400)`);
    }
    updatePosFlower(){
        let values = rotateValuesOffset(this.xInit, this.yInit, this.radians, this.minMouseX ,this.minMouseY,(GAME_STATE.lastTime/1000)*this.randomDirection,this.randomRotateValue,this.randomRotateValue/2);//the Value interactiveAngle isnt used at this function.
        this.x=values.dx;
        this.y=values.dy;
        setPostition(this.$flowerCall,this.x,this.y);

        this.rotateFlowerPetal();
        this.updateFrameFlower();
        this.updateStemFlower(this.x,this.y);

    }
    updateFrameFlower(){
        let $flowerUseFrame = document.querySelector(`#useFlowerFrame${this.index}`);

        let minValues= mousePositionMinimum(this.radians, this.minMouseX, this.minMouseY);
        
        let value = formatNumberFrame(this.x,this.y,minValues.x,minValues.y,GAME_STATE.flowers[this.index]);
        
        let $circleFlower=document.querySelector(`#circleFlower${this.index}`);
        let $petalGroup=document.querySelector(`#petalGroup${this.index}`);
        // this.isHappy=true;
        if(!this.isHappy){
            setAttributeUse($flowerUseFrame,'sad',value);
            this.faceColor=COLORS.sad;
            $circleFlower.style.fill=this.faceColor;

            this.colorPetal = COLORS.sadPetal;
            $petalGroup.style.fill=this.colorPetal;
        }else{
            setAttributeUse($flowerUseFrame,'happy',value);
            this.faceColor=COLORS.yellow;
            $circleFlower.style.fill=this.faceColor;

            $petalGroup.style.fill=this.colorPetal;

        }
       
    }
    updateStemFlower(x,y){
        let s= calculateStemPath(x,y,this.randomStemValue);
        this.$stemPathBorder.setAttribute('d',`M ${s.v1} ${s.v2} C ${s.v3} ${s.v4} ${s.v5} ${s.v6} ${s.v7} ${s.v8}`);
        this.$stemPathInner.setAttribute('d',`M ${s.v1} ${s.v2} C ${s.v3} ${s.v4} ${s.v5} ${s.v6} ${s.v7} ${s.v8}`);

    }
}

class FlowerShot{
    constructor(x,y,radians){
        this.x=x;
        this.y=y;
        this.radians=radians;
        this.MAX_SPEED=600;
        this.$shotFlower =document.createElementNS('http://www.w3.org/2000/svg','circle');
        this.r =15;
        this.color = COLORS.sad;
    }

    createFlowerShot(){
        this.$shotFlower.style.fill=this.color;
        this.$shotFlower.classList.add('borderOnly');
        this.$shotFlower.setAttribute('cx','0');
        this.$shotFlower.setAttribute('cy','0');
        this.$shotFlower.setAttribute('r',this.r);

        $flowerShotContainer.appendChild(this.$shotFlower);
    }
    updateFlowerShot(dt){
        this.x += (Math.cos(this.radians)*(dt*this.MAX_SPEED));
        this.y+= (Math.sin(this.radians)*(dt*this.MAX_SPEED));
        setPostition(this.$shotFlower,this.x,this.y);

    }
}

class Shot{
    constructor(x,y,radians,currentColor){
        this.x=x;
        this.y=y;
        this.radians=radians;
        this.degrees=radians/(Math.PI/180);
        this.MAX_SPEED=600;
        this.$shotGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.$shot=document.createElementNS('http://www.w3.org/2000/svg','path');
        this.width=125;
        this.height=100;

        this.color=currentColor;

    }
    createShot(){
        this.$shotGroup.style.fill = this.color;
        // this.$shotGroup.classList.add('borderOnly');
        this.$shot.setAttribute('d',`M ${-this.width/2} ${-this.height/2} L ${this.width/2} ${0} L ${-this.width/2} ${this.height/2} Z`);
        this.$shot.setAttribute('transform',`rotate(${this.degrees} 0 0)`);
        // this.$shot.style.fill=this.color;
        this.$shotGroup.appendChild(this.$shot);
        $shotContainer.appendChild(this.$shotGroup);
        

    }
    updateShot(dt){
        this.x += (Math.cos(this.radians)*(dt*this.MAX_SPEED));
        this.y +=(Math.sin(this.radians)*(dt*this.MAX_SPEED));
        setPostition(this.$shotGroup, this.x,this.y);
        
    }
}

class Selector{
    constructor(){
        this.$groupSelector = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.$selectorCall = document.createElementNS('http://www.w3.org/2000/svg','use');
        this.marginSVG=100;
        this.widthSVG=600;
        this.heightSVG= this.widthSVG;
        this.xSVG=this.marginSVG;
        this.ySVG=this.marginSVG;

        this.xCenterSVG=this.marginSVG + (this.widthSVG/2);
        this.yCenterSVG = this.marginSVG+ (this.heightSVG/2);
    
        
    }
    createSelector(){
        let selectorPath=`
        <symbol id="selector" viewBox="0 0 1000 1000">
            <g id="marco">
                <rect class="borderSelector" x="6.56" y="5.49" width="986.89" height="989.02" rx="171.71"/>
            </g>

            <g id="circles">
                <circle class="pink  circleSelector" cx="793.24" cy="498.62" r="102.13"/>
                <circle class="black circleSelector" cx="721.52" cy="308.13" r="102.13"/>
                <circle class="blue circleSelector" cx="544.22" cy="208.29" r="102.13"/>
                <circle class="yellow circleSelector" cx="344.16" cy="245.77" r="102.13"/>
                <circle class="red circleSelector" cx="215.06" cy="403.18" r="102.13"/>
                <circle class="purple circleSelector" cx="217.16" cy="606.69" r="102.13"/>
                <circle class="white circleSelector" cx="349.71" cy="761.23" r="102.13"/>
                <circle class="gray circleSelector" cx="550.53" cy="794.31" r="102.13"/>
                <circle class="green circleSelector" cx="725.73" cy="690.65" r="102.13"/>
            </g>
            <g id="birCircle">
                <circle class="bigCircle circleSelector" cx="496.21" cy="498.81" r="257.82"/>
                <use href="#wow0001" id="useSelectorFrame" ></use>
            </g>
        </symbol>
        `
        this.$selectorCall.setAttribute('href',`#selector`);
        this.$selectorCall.setAttribute('width',this.widthSVG);
        this.$selectorCall.setAttribute('height',this.heightSVG);
        this.$selectorCall.setAttribute('x',this.xSVG);
        this.$selectorCall.setAttribute('y',this.ySVG);
        this.$selectorCall.setAttribute('id',`useSelectorFrame`);

        this.$groupSelector.innerHTML = selectorPath;
        this.$groupSelector.appendChild(this.$selectorCall);
        $gameContainer.appendChild(this.$groupSelector);

    }
    updateFrameSelector(){
        let $selectorUseFrame = document.querySelector('#useSelectorFrame');
        let value = formatNumberFrame(this.xCenterSVG, this.yCenterSVG, INTERACTIVE_ELEMENTS.mouseX, INTERACTIVE_ELEMENTS.mouseY,$selector);
        setAttributeUse($selectorUseFrame,'wow',value);
    }
}

class LifeRange{
    constructor(){
        this.$groupRange = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.$baseLifeRange = document.createElementNS('http://www.w3.org/2000/svg','rect');
        this.$indicatorLifeRange = document.createElementNS('http://www.w3.org/2000/svg','rect');
        this.$lifeText = document.createElementNS('http://www.w3.org/2000/svg','text');

        this.colorBase='rgb(255,240,0)';
        this.x=2000;
        this.y = 100;
        this.width=900;
        this.height=100;
        this.rx= 50;
        this.ry=50; 
        
        this.colorIndicator='hsl(56,100%,50%)';
        this.lifeState=900;
        
    }
    createLifeRange(){
        this.$baseLifeRange.setAttribute('x',this.x);
        this.$baseLifeRange.setAttribute('y',this.y);
        this.$baseLifeRange.setAttribute('width',this.width);
        this.$baseLifeRange.setAttribute('height',this.height);
        this.$baseLifeRange.setAttribute('rx',this.rx);
        this.$baseLifeRange.setAttribute('ry',this.ry);
        this.$baseLifeRange.setAttribute('fill','white');
        this.$baseLifeRange.setAttribute('stroke','black');


        this.$indicatorLifeRange.setAttribute('x',this.x);
        this.$indicatorLifeRange.setAttribute('y',this.y);
        this.$indicatorLifeRange.setAttribute('height',this.height);
        this.$indicatorLifeRange.setAttribute('rx',this.rx);
        this.$indicatorLifeRange.setAttribute('ry',this.ry);
        this.$indicatorLifeRange.setAttribute('fill',this.colorIndicator);
        this.$indicatorLifeRange.setAttribute('width', mapValues(sun.life,0, 100, 0, this.width));

        this.$lifeText.setAttribute('text-anchor','middle');
        this.$lifeText.setAttribute('x','2450');
        this.$lifeText.setAttribute('y',this.y+this.y/1.25);
        this.$lifeText.setAttribute('font-size','80');
        this.$lifeText.classList.add('textSVG');
        this.$lifeText.innerHTML = `YOUR LIFE: ${sun.life}%`;
        

        this.$groupRange.appendChild(this.$baseLifeRange);
        this.$groupRange.appendChild(this.$indicatorLifeRange);
        this.$groupRange.appendChild(this.$lifeText);
        $gameContainer.appendChild(this.$groupRange);

    }
    updatePosRange(){
        this.$indicatorLifeRange.setAttribute('width', mapValues(sun.life,0, 100, 0, this.width));
        this.$indicatorLifeRange.setAttribute('fill',GAME_STATE.currentColor);
        this.$lifeText.innerHTML = `YOUR LIFE: ${Math.round(sun.life)}%`;
    }
}

class Cursor{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.$cursor =document.createElementNS('http://www.w3.org/2000/svg','circle');
        this.r =50;
        this.color = COLORS.yellow;
    }
    createCursor(){
        this.$cursor.style.fill=this.color;
        this.$cursor.classList.add('borderOnly');
        this.$cursor.setAttribute('cx','0');
        this.$cursor.setAttribute('cy','0');
        this.$cursor.setAttribute('r',this.r);

        $cursorContainer.appendChild(this.$cursor);
           
    }
    updateCursor(x,y){
        this.color=GAME_STATE.currentColor;
        this.$cursor.style.fill=this.color;
        setPostition(this.$cursor,x,y);

    }

}

//-------------------------funciones----------------//
//posiblesMultiusos

function rand(min, max){
    if(min==undefined) min=0;
    if(max==undefined) max=1;
    return min + Math.random()* (max-min);
}
function setPostition($element,x,y){
    //esta funcion establece la propiedad transformar a algun elemento
    $element.setAttribute('transform',`translate(${x} ${y})`);
}

function formatNumber(num, size){
    let s=num+"";
    while(s.length<size){
        s="0"+s;
    }
    return s;
}

function mapValues(value,low1,high1,low2,high2){
    return Math.round(low2 + (high2 -low2) * ( value-low1) / (high1-low1));
}

function mousePositionMinimum(radians,miniumumMouseRadioX, minimumMouseRadioY){
    let x = INTERACTIVE_ELEMENTS.mouseX+Math.cos(radians)*miniumumMouseRadioX;
    let y = INTERACTIVE_ELEMENTS.mouseY+Math.sin(radians)*minimumMouseRadioY;
    return{
        x,
        y
    }
}

function arctangentValue(originx1,originy1,mouseX,mouseY){


    let dx=mouseX-originx1;
    let dy=mouseY-originy1;
    let radians= Math.atan2(dy,dx);
    return radians;

}

function setAttributeUse($element,stringName,valueNumFrame){
    $element.setAttribute('href',`#${stringName}${valueNumFrame}`)
}

function formatNumberFrame(originX, originY,mouseX,mouseY,objectName){
    let radiansValue = arctangentValue(originX, originY,mouseX,mouseY);
    let mapValue = mapValues(radiansValue,Math.PI, -Math.PI, 1 ,INTERACTIVE_ELEMENTS.numFrames);
    let formatNumberFrame = formatNumber(mapValue,4);
    objectName.radians = radiansValue;
    return formatNumberFrame;
}

function rotateValuesOffset(x, y,radiansMouse,mouseConstrainX, mouseConstrainY,constantValue,autoRotateRadioX, autoRotateRadioY){
  //generate the constant movement with sin and cos
    let dx = x   +    ((Math.cos(radiansMouse)*mouseConstrainX)   +   ((Math.cos(constantValue)*autoRotateRadioX)));
    let dy = y   +    ((Math.sin(radiansMouse)*mouseConstrainY)   +   ((Math.sin(constantValue)*autoRotateRadioY)));
    return {
      dx,
      dy
    }

}

function calculateStemPath(xMovil,yMovil, randomValue){
    let long= SVG_CONTAINER_VALUES.height-yMovil;
    let quarterStem = long/4;

    let xFirstBezier= xMovil+(Math.cos(GAME_STATE.lastTime/randomValue)*500);
    let xSecondBezier = xMovil-(Math.cos(GAME_STATE.lastTime/randomValue)*500);
    
    let yFirstBezier = yMovil+quarterStem;
    let ySecondBezier = yMovil+(quarterStem*3) ;



    return{
        v1: xMovil,
        v2: yMovil,
        v3: xFirstBezier,
        v4: yFirstBezier,
        v5: xSecondBezier,
        v6: ySecondBezier,
        v7: 1500,
        v8:3000,

    }


}
function rectsIntersects(r1,r2){
    return(
        r1.x > r2.x && 
        r1.x+r1.width < r2.right &&
        r1.y> r2.y &&
        r1.y+r1.height <r2.bottom
    );
}

function destroyShot($container, $element, object){
    $container.removeChild($element);
    object.isOut= true;
}

//functionMouseValues
function mouseContainerSVGValues(e){
    /* CALCULA LA POS DEL MOUSE DENTRO DEL SVG CONTAINER*/

    INTERACTIVE_ELEMENTS.mouseX=mapValues(e.clientX,gameClientProperties.left,gameClientProperties.left+gameClientProperties.width,0,SVG_CONTAINER_VALUES.width);
    INTERACTIVE_ELEMENTS.mouseY=mapValues(e.clientY,gameClientProperties.top,gameClientProperties.top+gameClientProperties.height,0,SVG_CONTAINER_VALUES.height);
}

function touchContainerSVGValues(e){
      //touchmove events
    INTERACTIVE_ELEMENTS.mouseX=mapValues(e.targetTouches[0].pageX,gameClientProperties.left,gameClientProperties.left+gameClientProperties.width,0,SVG_CONTAINER_VALUES.width);
    INTERACTIVE_ELEMENTS.mouseY=mapValues(e.targetTouches[0].pageY,gameClientProperties.top,gameClientProperties.top+gameClientProperties.height,0,SVG_CONTAINER_VALUES.height);
}

function onMouseDownValidate(e){
    GAME_STATE.isPressed = true;
}
function onMouseUpValidate(e){
    GAME_STATE.isPressed=false;
}

//funcionesGenerales
function createFlowers(){
  let flowerPadding= SVG_CONTAINER_VALUES.width/12;
  for(let i=0; i<4; i++){
    for(let j=0; j<FLOWERS_PER_ROW; j++){
      let index = i*FLOWERS_PER_ROW + j;
      let yValue= SVG_CONTAINER_VALUES.height/2+ flowerPadding + (i*flowerPadding);
      let xValue= flowerPadding*2 + (j*flowerPadding);
      GAME_STATE.flowers.push(new Flower(xValue,yValue,i,j,index));
      GAME_STATE.flowers[index].createFlower();
    }
  }
}
function createFrontMountains(){
    let $mountain=document.createElementNS('http://www.w3.org/2000/svg','image');
    $mountain.setAttribute('href','img/frontMountains.png');
    $mountain.setAttribute('x','0');
    $mountain.setAttribute('y','0');
    $mountain.setAttribute('width','100%');
    $mountain.setAttribute('height','100%');
    $gameContainer.appendChild($mountain);
}

function createColorListeners(){
    let $pink = document.querySelector('.pink');
    let $black = document.querySelector('.black');
    let $yellow = document.querySelector('.yellow');
    let $red = document.querySelector('.red');
    let $purple = document.querySelector('.purple');
    let $white =document.querySelector('.white');
    let $gray =document.querySelector('.gray');
    let $green =document.querySelector('.green');
    let $blue = document.querySelector('.blue');

    colorEventListener($pink,COLORS.pink);
    colorEventListener($black,COLORS.black);
    colorEventListener($yellow,COLORS.yellow);
    colorEventListener($red,COLORS.red);
    colorEventListener($purple,COLORS.purple);
    colorEventListener($white,COLORS.white);
    colorEventListener($gray,COLORS.gray);
    colorEventListener($green,COLORS.green);
    colorEventListener($blue,COLORS.blue);
}

function colorEventListener($element,color){
    $element.addEventListener('click',()=>{
        GAME_STATE.currentColor= color
    });
}

function init(){
    $lifeRange.createLifeRange();
    sun.createSun(); //createSunFrames
    createFlowers();
    createFrontMountains();

    $selector.createSelector();

    createColorListeners();

    cursor.createCursor();
    
}
function updateFlowers(dt){
  for(let i=0; i<GAME_STATE.flowers.length;i++){
    let flower = GAME_STATE.flowers[i];
    flower.updatePosFlower();

    flower.COOLDOWN-=dt;
    if(flower.COOLDOWN<=0 && !flower.isHappy){
        let shotFlower = new FlowerShot(flower.x, flower.y,flower.radians);
        shotFlower.createFlowerShot();
        GAME_STATE.flowerShots.push(shotFlower);
        flower.COOLDOWN=FLOWER_COOLDOWN;

    }

  }
}
function updateDOMElements(){
    //actualiza el ancho y alto del contenedor del juego
    gameClientProperties = $gameContainer.getBoundingClientRect();
}
function updateShots(dt){
    for(let i = 0; i<GAME_STATE.shots.length;i++){
        const shot = GAME_STATE.shots[i];
        shot.updateShot(dt);
        if(shot.x<0-shot.width|| shot.x>SVG_CONTAINER_VALUES.width+shot.width || shot.y <0-shot.height || shot.y> SVG_CONTAINER_VALUES.height+shot.height){
            destroyShot($shotContainer,shot.$shotGroup,shot);
        }


        const r1 = shot.$shotGroup.getBoundingClientRect();
        const flowers = GAME_STATE.flowers;
        for(let j = 0; j<flowers.length; j++){
            const flower = flowers[j];
            if(sun.life<=0) continue;
            // if(flower.isHappy) continue;
            const r2 =flower.$flowerGroup.getBoundingClientRect();
            if(rectsIntersects(r1,r2)){
                destroyShot($shotContainer,shot.$shotGroup,shot);
                flower.isHappy=true;
                flower.colorPetal = shot.color;
                break;
            }

        }
        
    }
    GAME_STATE.shots = GAME_STATE.shots.filter(e=>!e.isOut);
}

function updateFlowerShots(dt){
    for(let i=0; i< GAME_STATE.flowerShots.length;i++){
        let flowerShot = GAME_STATE.flowerShots[i];
        flowerShot.updateFlowerShot(dt);
        if(flowerShot.x<0 || flowerShot.x>SVG_CONTAINER_VALUES.width || flowerShot.y<0 || flowerShot.y>SVG_CONTAINER_VALUES.height){
            destroyShot($flowerShotContainer,flowerShot.$shotFlower,flowerShot);
        }

        const r1 = flowerShot.$shotFlower.getBoundingClientRect();
        const r2 = sun.$sunCall.getBoundingClientRect(); 
        if(sun.life<=0) continue; //if the condition is true, execute 'continue' that consists in excludes the next code lines of the cicle, but not the cicle for;
        if(rectsIntersects(r1,r2)){
            destroyShot($flowerShotContainer,flowerShot.$shotFlower,flowerShot);
            sun.life-=0.75;
           
            break;
        }


    }
    GAME_STATE.flowerShots = GAME_STATE.flowerShots.filter(e=>!e.isOut);
}


function update(){
    const currentTime= Date.now();
    const dt = (currentTime-GAME_STATE.lastTime)/1000.0;
    GAME_STATE.lastTime = currentTime;

    updateDOMElements();

    sun.updatePosSun();
    

    updateFlowers(dt);
    updateFlowerShots(dt);


    $selector.updateFrameSelector();
    
    updateShots(dt);

    $lifeRange.updatePosRange();

    cursor.updateCursor(INTERACTIVE_ELEMENTS.mouseX,INTERACTIVE_ELEMENTS.mouseY);

    INTERACTIVE_ELEMENTS.interactiveAngle+=dt;
    window.requestAnimationFrame(update);
    



}


//-------------------------eventos-----------------//
window.requestAnimationFrame(update);
window.addEventListener('mousemove',mouseContainerSVGValues,false);
window.addEventListener('touchmove',touchContainerSVGValues,false);


$gameContainer.addEventListener('click',onMouseDownValidate,false);




//-------------------------to do------------------//
let sun = new Sun(SVG_CONTAINER_VALUES.width/2,SVG_CONTAINER_VALUES.sunYPos);
let $selector = new Selector();
let $lifeRange = new LifeRange();
let cursor = new Cursor(INTERACTIVE_ELEMENTS.mouseX,INTERACTIVE_ELEMENTS.mouseY);
init();