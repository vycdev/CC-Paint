let rgbaColor = "rgba(0,0,0,1)";
let brushSize = "7";
var brushType = "brush";
var rgbaArr = [0,0,0,1];

var brushSizeInput = document.getElementById("brushSizeInput");
var brushElement = document.getElementById("brush");
var rangeInput = document.getElementById("rangeInput");
var numberInput = document.getElementById("numberInput");
var uploadImg = document.getElementById("uploadImg");
var uploadBox = document.getElementById("uploadImage");
var closeUploadButton = document.getElementById("closeUploadBox");
var fileInput = document.getElementById("fileInput");
var submitButton = document.getElementById("submitImage");
var downloadButton = document.getElementById("downloadImg");
var navBar = document.getElementById("navBar");
var canvas = document.getElementById("canvas");
var bucket = document.getElementById("bucket");
var eraser = document.getElementById("eraser");
var reset = document.getElementById("canvasReset");
var pickColor = document.getElementById("pickColor");
var isDone = true;


var mousePressed = false;
var lastX,lastY;
var ctx = canvas.getContext("2d");
function drawCanvas(){
canvas.width = 1080;
canvas.height = 720;
ctx.fillStyle = "rgba(255,255,255,1)";
ctx.fillRect(0,0,1080,720);
}
drawCanvas();
init();



///Reset canvas button
reset.onclick = ()=>{
    drawCanvas();
}


// Download and Upload
function convertImageToCanvas(image){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            ctx.drawImage(img,0,0,1080,720);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(image[0]);
    uploadBox.style.display = "none";
}

function convertCanvasToImage(canvas){
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}

uploadImg.onclick = ()=>{
    if(uploadBox.style.display == "none"){
        uploadBox.style.display = "block";

        closeUploadButton.onclick = ()=>{
            uploadBox.style.display = "none";
        }

    }else{
        uploadBox.style.display = "none"
    }
}


submitButton.onclick = ()=>{
    if(fileInput.files[0]){
    convertImageToCanvas(fileInput.files);
    }else{
        alert("Please select an image");
    }
}

function downloadImage(){
    var canvas = document.getElementById("canvas");
    var downImg = document.getElementById("downImg");
    downImg.href = convertCanvasToImage(canvas).src;
}

downloadButton.onclick = ()=>{
    downloadImage();
}


//Color picker
var picker = new Picker({    
        parent: document.querySelector('#colorPicker'),
        popup: 'bottom',
        color: '#000',
        editor: true,
        layout: 'default',
        editorFormat: 'hex'

});


picker.onChange = (color) => {
    rgbaColor = "rgba(" + color.rgba.toString() + ")";
    rgbaArr = color.rgba;
    document.getElementById("colorBox").style.background = rgbaColor;
}


/// Pick a color from canvas

pickColor.onclick = ()=>{
    canvas.style.cursor = "url('cursor/pick.cur'),auto";
    brushType = "colorPick";
}



//brush size
function selectBrushBrush(){
    canvas.style.cursor = "url('cursor/crosshair.cur'),auto";
    brushType = "brush";
    if(brushSizeInput.style.display == "none"){
        brushSizeInput.style.display = "inline-flex";

    }
}

brushElement.onclick = () => {
    selectBrushBrush();
}

rangeInput.oninput = ()=>{
    numberInput.value = rangeInput.value + "px";
    brushSize = rangeInput.value;
}

eraser.onclick = ()=>{
    canvas.style.cursor = "url('cursor/eraser.cur'),auto";
    brushType = "eraser";
}

//paint bucket

bucket.onclick = ()=>{
    canvas.style.cursor = "url('cursor/bucket.cur'),auto";
    brushType = "bucket";
}



///Actual Drawing

function init(){
    var bucketReady;
        canvas.onmousedown = (e)=>{
            mousePressed = true;
            if(isDone){
                bucketReady = true;
            }
            Draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false, brushType,bucketReady);
            
        };
        canvas.onmousemove = (e)=>{
            if(mousePressed){
                bucketReady = false;
                Draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true, brushType,bucketReady);
            }
        };
        canvas.onmouseup = ()=>{
            mousePressed = false;
            if(isDone){
                bucketReady = true;
            }
        };
        canvas.onmouseout = ()=>{
            bucketReady = false;
            mousePressed = false;
        };
}


function Draw(x,y,isDown,brushType,bucketReady){
    if(isDown){
        if(brushType == "brush"){
            ctx.beginPath();
            ctx.strokeStyle = rgbaColor;
            ctx.lineWidth = brushSize;
            ctx.lineJoin = "round";
            ctx.moveTo(lastX,lastY);
            ctx.lineTo(x,y);
            ctx.closePath();
            ctx.stroke();
        }
        if(brushType == "eraser"){
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.lineWidth = brushSize;
            ctx.lineJoin = "round";
            ctx.moveTo(lastX,lastY);
            ctx.lineTo(x,y);
            ctx.closePath();
            ctx.stroke();
            
        }

    }
    if(brushType == "colorPick"){
        var imageData = ctx.getImageData(x,y,1,1);
        rgbaArr = imageData.data;
        imageData = "rgba("+ imageData.data.toString() + ")";
        if(imageData == "rgba(0,0,0,0)"){
            imageData = "rgba(255,255,255,1)";
        }
        rgbaColor = imageData;
        document.getElementById("colorBox").style.background = rgbaColor;
        selectBrushBrush();
    }
    if(brushType == "bucket" && bucketReady){
        bucketFill(x,y);
    }

    lastX = x;
    lastY = y;
}



function bucketFill(startX,startY){
        isDone = false;
        var colorLayer = ctx.getImageData(0,0,1080,720);
        const pixelStack = [[startX,startY]];
        var startR,startG,startB;
        var startPos;
        startPos = (startX + 1080*startY)*4;
        startR = colorLayer.data[startPos];
        startG = colorLayer.data[startPos+1];
        startB = colorLayer.data[startPos+2];
        
        

        if(!matchSelectedColor(startPos)){
            while(pixelStack.length != 0 ){
                var newPos, x,y, pixelPos, reachLeft, reachRight;
                newPos = pixelStack.pop();

                x = newPos[0];
                y = newPos[1];

                pixelPos = ((y*1080 + x)*4);

                while(y-- >= 0 && matchStartColor(pixelPos)){
                    pixelPos -= 1080*4;
                }
                pixelPos += 1080*4;
                ++y;
                reachLeft = false;
                reachRight = false;

                while(y++ < 720-1 && matchStartColor(pixelPos)){
                    colorPixel(pixelPos);


                    if(x > 0){
                        if(matchStartColor(pixelPos - 4)){
                            if(!reachLeft){
                                pixelStack.push([x-1,y]);
                                reachLeft = true;
                            }
                        }else if(reachLeft){
                            reachLeft = false;
                        }
                    }

                    if(x < 1080-1){
                        if(matchStartColor(pixelPos+4)){
                            if(!reachRight){
                                pixelStack.push([x+1, y]);
                                reachRight = true;
                            }
                        }else if(reachRight){
                            reachRight = false;
                        }
                    }
                    pixelPos += 1080 * 4;
                }
            }
        }

        ctx.putImageData(colorLayer,0,0);

        function matchSelectedColor(pixelPos){
            var r = colorLayer.data[pixelPos];
            var g = colorLayer.data[pixelPos+1];
            var b = colorLayer.data[pixelPos+2];

            
            if(r== rgbaArr[0] && g==rgbaArr[1] && b == rgbaArr[2]){
                return true;
            }else{
                return false;
            }
        }
        function matchStartColor(pixelPos){
            var r = colorLayer.data[pixelPos];
            var g = colorLayer.data[pixelPos+1];
            var b = colorLayer.data[pixelPos+2];

            if(r== startR && g==startG && b == startB){
                return true;
            }else{
                return false;
            }
        }

        function colorPixel(pixelPos){
            colorLayer.data[pixelPos] = rgbaArr[0];
            colorLayer.data[pixelPos+1] = rgbaArr[1];
            colorLayer.data[pixelPos+2] = rgbaArr[2];
            colorLayer.data[pixelPos+3] = 255;
        }
        isDone = true;
    }


