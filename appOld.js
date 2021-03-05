//-------------------------globales------------------//
//DOM ELEMENTS
const $gameContainer = document.querySelector('#game');
let gameContainerProperties;


//globalVariable&Constant
let gameWidth = 0;
let gameHeight = 0;

const FLOWERS_PER_ROW= 9;



//variableInteractiveElements
const INTERACTIVE_ELEMENTS={
  numFrames:96,
  mouseX:0,
  mouseY:0,
  interactiveAngle:0,
}

const GAME_STATE={
  flowers:[],
}

//-------------------------objetos-------------------//
class Sun{
    constructor(){
        this.x=gameWidth/2;
        this.y=gameHeight/2;
        this.radians;
        this.$sun=document.createElementNS('http://www.w3.org/2000/svg','svg');
    }
    createSun($container){
        
        this.$sun.setAttribute('viewBox','0 0 800 800');
        this.$sun.classList.add('sun');
        
        let sunPath = `
        <g id="rayos">
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
        <use href="#happy0001" id="useSunFrame"></use>
        `

        this.$sun.innerHTML=sunPath;
        $container.appendChild(this.$sun);

    }
    rotateSunRays(){
      let $sunRays = document.querySelector('#rayos');

      $sunRays.setAttribute('transform',`rotate(${INTERACTIVE_ELEMENTS.interactiveAngle*50} 400 400)`);
    }
    updatePosSun(x,y){
     
        let values=rotateValuesOffset(x,y,this.radians,INTERACTIVE_ELEMENTS.interactiveAngle,100,100,10,10);
        setPostition(this.$sun,values.dx,values.dy);
        this.rotateSunRays();

    }
    updateFrameSun(x,y,objectName){
        let $useSunFrame = document.querySelector('#useSunFrame');
        let value = formatNumberFrame(x,y,INTERACTIVE_ELEMENTS.mouseX,INTERACTIVE_ELEMENTS.mouseY,objectName);
        setAttributeUse($useSunFrame,'happy',value);
    }
}

class Flower{
  constructor($container,x,y,row,col,index){
    this.index= index;
    this.$container=$container;
    this.x=x;
    this.y=y;
    this.col=col;
    this.row=row;
    this.$flower= document.createElementNS('http://www.w3.org/2000/svg','svg');
    this.radians;
    this.randomNormRotate=Math.random()*50;

  }

  drawFlower(){
    this.$flower.setAttribute('viewBox','0 0 800 800');
    this.$flower.classList.add('flower');
   
    const bodyFlower = `
      <g id="petalos">
       <!-- <g>  
          <path d="M 400 400 C 800 800 0 1600 400 2400" class="stem"/>
        </g>-->
        <g id="petalGroup${this.index}">
          <path class="petal" d="M480.19,84.85a74.12,74.12,0,0,1-1.74,16l-1.52,5.8L400,400,321.33,107.33l-1.7-6.34a74.05,74.05,0,0,1-1.76-16.14c0-42.79,36.33-77.49,81.16-77.49S480.19,42.06,480.19,84.85Z"/>
          <path class="petal" d="M311.87,87a74.49,74.49,0,0,1,6.49,14.71l1.59,5.79L400,400,185.54,185.87l-4.65-4.64a73.5,73.5,0,0,1-9.59-13.09C149.9,131.08,164,82.86,202.84,60.45S290.47,49.92,311.87,87Z"/>
          <path class="petal" d="M167.17,173a74.11,74.11,0,0,1,13,9.5l4.27,4.22L400,400,107.21,321.79l-6.35-1.69A74.69,74.69,0,0,1,86,313.56c-37.07-21.4-48.94-70.22-26.53-109S130.1,151.59,167.17,173Z"/>
          <path class="petal" d="M84.85,319.81a74.12,74.12,0,0,1,16,1.74l5.8,1.52L400,400,107.33,478.67l-6.34,1.7a74.05,74.05,0,0,1-16.14,1.76C42.06,482.13,7.36,445.8,7.36,401S42.06,319.81,84.85,319.81Z"/>
          <path class="petal" d="M87,488.13a74.49,74.49,0,0,1,14.71-6.49l5.79-1.59L400,400,185.87,614.46l-4.64,4.65a73.5,73.5,0,0,1-13.09,9.59C131.08,650.1,82.86,636,60.45,597.16S49.92,509.53,87,488.13Z"/>
          <path class="petal" d="M173,632.83a74.11,74.11,0,0,1,9.5-13l4.22-4.27L400,400,321.79,692.79l-1.69,6.35A74.69,74.69,0,0,1,313.56,714c-21.4,37.07-70.22,48.94-109,26.53S151.59,669.9,173,632.83Z"/>
          <path class="petal" d="M319.81,715.15a74.12,74.12,0,0,1,1.74-16l1.52-5.8L400,400l78.67,292.67,1.7,6.34a74.05,74.05,0,0,1,1.76,16.14c0,42.79-36.33,77.49-81.16,77.49S319.81,757.94,319.81,715.15Z"/>
          <path class="petal" d="M488.13,713a74.49,74.49,0,0,1-6.49-14.71l-1.59-5.79L400,400,614.46,614.13l4.65,4.64a73.5,73.5,0,0,1,9.59,13.09c21.4,37.06,7.28,85.28-31.54,107.69S509.53,750.08,488.13,713Z"/>
          <path class="petal" d="M632.83,627a74.11,74.11,0,0,1-13-9.5l-4.27-4.22L400,400l292.79,78.21,6.35,1.69A74.69,74.69,0,0,1,714,486.44c37.07,21.4,48.94,70.22,26.53,109S669.9,648.41,632.83,627Z"/>
          <path class="petal" d="M715.15,480.19a74.12,74.12,0,0,1-16-1.74l-5.8-1.52L400,400l292.67-78.67,6.34-1.7a74.05,74.05,0,0,1,16.14-1.76c42.79,0,77.49,36.33,77.49,81.16S757.94,480.19,715.15,480.19Z"/>
          <path class="petal" d="M627,167.17a74.11,74.11,0,0,1-9.5,13l-4.22,4.27L400,400l78.21-292.79,1.69-6.35A74.69,74.69,0,0,1,486.44,86c21.4-37.07,70.22-48.94,109-26.53S648.41,130.1,627,167.17Z"/>
          <path class="petal" d="M713,311.87a74.49,74.49,0,0,1-14.71,6.49L692.52,320,400,400,614.13,185.54l4.64-4.65a73.5,73.5,0,0,1,13.09-9.59c37.06-21.4,85.28-7.28,107.69,31.54S750.08,290.47,713,311.87Z"/>
        </g>
      </g>
      <g id="faceCircle">
        <circle class="circleFlower" cx="400" cy="400" r="278.76"/>
      </g>
      <use href="#sad0001" id="useFlowerFrame${this.index}"></use>
    `
    this.$flower.innerHTML=bodyFlower;
    this.$container.appendChild(this.$flower);
    setPostition(this.$flower,this.x,this.y);
    
  }
  rotateFlowerPetal(){
    let $petalGroup = document.querySelector(`#petalGroup${this.index}`);
    $petalGroup.setAttribute('transform',`rotate(${INTERACTIVE_ELEMENTS.interactiveAngle*100} 400 400)`);
  }
  updateFlower(){
    this.rotateFlowerPetal();
    
    let flowerPadding= gameWidth/12;
    let yValue= gameWidth/2+ (flowerPadding + (this.row*flowerPadding));
    let xValue= flowerPadding*2 + (this.col*flowerPadding);
    this.x=xValue;
    this.y=yValue;
    let values=rotateValuesOffset(xValue,yValue,this.radians,INTERACTIVE_ELEMENTS.interactiveAngle,-50,-50,0,this.randomNormRotate);
    setPostition(this.$flower,values.dx,values.dy);

  }
  updateFrameFlower(){
    let $useFlowerFrame = document.querySelector(`#useFlowerFrame${this.index}`);
    let value = formatNumberFrame(this.x, this.y,INTERACTIVE_ELEMENTS.mouseX,INTERACTIVE_ELEMENTS.mouseY,GAME_STATE.flowers[this.index]);
    setAttributeUse($useFlowerFrame,'sad',value);
  }
}

    







//-------------------------funciones----------------//
//posiblesMultiusos
function setPostition($element, x,y){
    //esta funcion establece la propiedad transformar a algun elemento
    $element.style.transform= `translate(${x}px, ${y}px)`;
}
function getInformationElement($element){
    //esta funcion obtiene las propiedades de getBoundingClientRect  de algun elemento
    return $element.getBoundingClientRect();
}
function formatNumber(num, size){
    let s=num+"";
    while(s.length<size){
        s="0"+s;
    }
    return s;
}

function mapRangeRadiansToFrames(value,low1,high1,low2,high2){
    return Math.round(low2 + (high2 -low2) * ( value-low1) / (high1-low1));
}

function arctangentValue(originx1,originy1,mouseX,mouseY){
    let dx=mouseX -originx1;
    let dy=mouseY -originy1;
    let radians= Math.atan2(dy,dx);
    return radians;

}

function setAttributeUse($element,stringName,valueNumFrame){
    $element.setAttribute('href',`#${stringName}${valueNumFrame}`)
}

function formatNumberFrame(originX, originY,mouseX,mouseY,objectName){
    let radiansValue = arctangentValue(originX, originY,mouseX,mouseY);
    let mapValue = mapRangeRadiansToFrames(radiansValue,Math.PI, -Math.PI, 0 ,INTERACTIVE_ELEMENTS.numFrames);
    let formatNumberFrame = formatNumber(mapValue,4);

    objectName.radians=radiansValue;
    return formatNumberFrame;
}
function rotateValuesOffset(x, y,radiansMouse,interactiveAngle,mouseConstrainX, mouseConstrainY,autoRotateRadioX, autoRotateRadioY){
  //generate the constant movement with sin and cos
    let dx = x   +    ((Math.cos(radiansMouse)*mouseConstrainX)   +   ((Math.cos(interactiveAngle)*autoRotateRadioX)));
    let dy = y   +    ((Math.sin(radiansMouse)*mouseConstrainY)   +   ((Math.sin(interactiveAngle)*autoRotateRadioY)));
    return {
      dx,
      dy
    }

}

//functionMouseValues
function adjustMouseValue(xx,yy){
    let x= xx-gameContainerProperties.left;
    let y= yy-gameContainerProperties.top;
    return { 
        x:x,
        y:y
    }
}

function mouseContainerValues(e){
    let pos = adjustMouseValue(e.clientX, e.clientY);
    INTERACTIVE_ELEMENTS.mouseX=pos.x;
    INTERACTIVE_ELEMENTS.mouseY=pos.y;
    return{
      mouseX:INTERACTIVE_ELEMENTS.mouseX,
      mouseY:INTERACTIVE_ELEMENTS.mouseY,
    }
}


//funcionesGenerales
function createFlowers($container){
  let flowerPadding= gameWidth/12;
  // const flowerSpacing = (widthContainer-flowerPadding*2)/ (FLOWERS_PER_ROW-1);
  for(let i=0; i<3; i++){
    for(let j=0; j<FLOWERS_PER_ROW; j++){
      let index = i*FLOWERS_PER_ROW + j;
      let yValue= gameWidth/2+ flowerPadding + (i*flowerPadding);
      let xValue= flowerPadding*2 + (j*flowerPadding);
      GAME_STATE.flowers.push(new Flower($gameContainer,xValue,yValue,i,j,index));
      GAME_STATE.flowers[index].drawFlower();
    }
  }
}

function updateFlowers($container){
  for(let i=0; i<GAME_STATE.flowers.length;i++){
    let flower = GAME_STATE.flowers[i];
    flower.updateFlower();
    flower.updateFrameFlower();
  }
}
function updateDOMElements(){
    //actualiza el ancho y alto del contenedor del juego
    gameContainerProperties = getInformationElement($gameContainer);
    gameWidth = gameContainerProperties.width;
    gameHeight = gameContainerProperties.height;
}
function createFrontMountains(){
  let $mountain=document.createElement('image');
  $mountain.setAttribute('href','img/frontMountains.png');
  $mountain.setAttribute('x','0');
  $mountain.setAttribute('y','0');
  $mountain.setAttribute('width','100%');
  $mountain.setAttribute('height','100%');
  $gameContainer.appendChild($mountain);
}

function init(){
    sun.createSun($gameContainer); //createSunFrames
    createFlowers($gameContainer);
    // createFrontMountains();

}

function update(){
    updateDOMElements();
    sun.updatePosSun(gameWidth/2,0);
    sun.updateFrameSun(gameWidth/2,0,sun);
    updateFlowers($gameContainer);





    window.requestAnimationFrame(update);
    INTERACTIVE_ELEMENTS.interactiveAngle+=0.03;
    



}






//-------------------------eventos-----------------//
window.requestAnimationFrame(update);
window.addEventListener('mousemove',mouseContainerValues,false);






//-------------------------to do------------------//
let sun = new Sun();
init();