let rgbaColor = "rgba('0,0,0,1')";
let brushSize = "18";

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


// Download and Upload
function convertImageToCanvas(image){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
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
    document.getElementById("colorBox").style.background = rgbaColor;
}




//brush size
brushElement.onclick = () => {
    canvas.style.cursor = "url('cursor/crosshair.cur'),auto";
    if(brushSizeInput.style.display == "none"){
        brushSizeInput.style.display = "inline-flex";
        
    }else{
        brushSizeInput.style.display = "none";
    }
}

rangeInput.oninput = ()=>{
    numberInput.value = rangeInput.value + "px";
    brushSize = rangeInput.value;
}

//paint bucket

bucket.onclick = ()=>{
    canvas.style.cursor = "url('cursor/bucket.cur'),auto";
}