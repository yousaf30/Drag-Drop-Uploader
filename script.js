const dropArea = document.getElementById("dropArea");

const fileInput = document.getElementById("fileInput");

const preview = document.getElementById("preview");

const error = document.getElementById("error");

const progressBar = document.getElementById("progressBar");

const progressContainer =
document.getElementById("progressContainer");

const gallery = document.getElementById("gallery");

const saveBtn = document.getElementById("saveBtn");

const clearBtn = document.getElementById("clearBtn");


// Current Image
let currentImage = "";


// Click Upload
dropArea.addEventListener("click", () => {

    fileInput.click();

});


// File Change
fileInput.addEventListener("change", (e) => {

    handleFile(e.target.files[0]);

});


// Drag Over
dropArea.addEventListener("dragover", (e) => {

    e.preventDefault();

    dropArea.classList.add("active");

});


// Drag Leave
dropArea.addEventListener("dragleave", () => {

    dropArea.classList.remove("active");

});


// Drop File
dropArea.addEventListener("drop", (e) => {

    e.preventDefault();

    dropArea.classList.remove("active");

    const file = e.dataTransfer.files[0];

    handleFile(file);

});


// Handle File
function handleFile(file){

    error.textContent = "";

    if(!file) return;

    // Allowed Types
    const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif"
    ];

    // Invalid File
    if(!validTypes.includes(file.type)){

        error.textContent =
        "Only JPG, PNG, and GIF files are allowed!";

        return;
    }

    const reader = new FileReader();

    reader.onload = function(e){

        currentImage = e.target.result;

        // Preview
        preview.innerHTML = `
            <img src="${currentImage}">
        `;

    };

    reader.readAsDataURL(file);
}


// Save Button
saveBtn.addEventListener("click", () => {

    if(currentImage === ""){

        error.textContent =
        "Please upload an image first!";

        return;
    }

    simulateProgress(() => {

        saveImage(currentImage);

        loadImages();

        error.textContent =
        "Image Saved Successfully!";
    });

});


// Clear Preview
clearBtn.addEventListener("click", () => {

    preview.innerHTML = "";

    currentImage = "";

    error.textContent = "";

});


// Progress Simulation
function simulateProgress(callback){

    progressContainer.style.display = "block";

    progressBar.style.width = "0%";

    let progress = 0;

    const interval = setInterval(() => {

        progress += 10;

        progressBar.style.width =
        progress + "%";

        if(progress >= 100){

            clearInterval(interval);

            setTimeout(() => {

                progressContainer.style.display =
                "none";

                callback();

            },500);
        }

    },200);
}


// Save Image
function saveImage(imageData){

    let images =
    JSON.parse(localStorage.getItem("images")) || [];

    images.push(imageData);

    localStorage.setItem(
        "images",
        JSON.stringify(images)
    );
}


// Load Images
function loadImages(){

    let images =
    JSON.parse(localStorage.getItem("images")) || [];

    gallery.innerHTML = "";

    images.forEach((img,index) => {

        const imageBox =
        document.createElement("div");

        imageBox.classList.add("image-box");

        imageBox.innerHTML = `
            <img src="${img}">

            <button class="delete-btn"
            onclick="deleteImage(${index})">
                ×
            </button>
        `;

        gallery.appendChild(imageBox);

    });
}


// Delete Image
function deleteImage(index){

    let images =
    JSON.parse(localStorage.getItem("images")) || [];

    images.splice(index,1);

    localStorage.setItem(
        "images",
        JSON.stringify(images)
    );

    loadImages();
}


// Initial Load
loadImages();