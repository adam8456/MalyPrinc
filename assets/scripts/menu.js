let dT;

let timesNewRoman;
let spaceBackground;

const hoverZoom = 1.1

// Ratio
const minRatio = 3/2;
const maxRatio = 21/9;
let currentRatio;

let ratioTooSmall;
let ratioTooLarge;

// Paths
const paths = {
    assets: "assets/",

    textures: "textures/",
    data: "data/",
    fonts: "fonts/",

    icons: "icons/",
    backgrounds: "backgrounds/",
    symbols: "symbols/",
    characters: "characters/",
    planets: "planets/"
};

async function setup() {
    createCanvas(100, 100);
    resizeToAspectRatio();

    push();
        fill(255);
        textSize(50);
        textAlign(CENTER, CENTER);
        text("Načítání...", width / 2, height / 2);
    pop();

    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);

    scaleAllCoordinates();

    currentRatio = width / height;
    ratioTooSmall = currentRatio < minRatio;
    ratioTooLarge = currentRatio > maxRatio;

    timesNewRoman = await loadFont(paths.assets + paths.fonts + "timesNewRoman.otf");

    textFont(timesNewRoman);

    await loadAllImages();
}

function draw() {
    background(0);

    cursor(ARROW);

    hovering = mouseX > width / 2 - width * 0.2 / 2 && mouseX < width / 2 + width * 0.2 / 2 && mouseY > height * 0.6 - height * 0.1 / 2 && mouseY < height * 0.6 + height * 0.1 / 2;

    dT = deltaTime / 1000;///

    image(
        spaceBackground,
        width / 2,
        height / 2,
        width,
        spaceBackground.height * (width / spaceBackground.width)
    );

    fill("white");
    textSize(130 * height / 1080);

    text("Malý princ", width / 2, height * 0.3);

    textSize(70 * height / 1080);
    text("Antoine de Saint-Exupéry", width / 2, height * 0.4);

    fill("white");

    if (!hovering) {
        rect(width / 2, height * 0.6, width * 0.2, height * 0.1);

        fill("black");
        text("START", width / 2, height * 0.6);
    } else {
        cursor(HAND);

        rect(width / 2, height * 0.6, width * 0.2 * hoverZoom, height * 0.1 * hoverZoom);

        fill("black");
        textSize(70 * height / 1080 * hoverZoom);
        text("START", width / 2, height * 0.6);
    }


}

function mousePressed() {
    if (mouseButton.left && hovering) {
        window.location.href = "http://127.0.0.1:5500/game.html";
    }
}

function windowResized() {
    resizeToAspectRatio();

    currentRatio = width / height;
    ratioTooSmall = currentRatio < minRatio;
    ratioTooLarge = currentRatio > maxRatio;
    
    scaleAllCoordinates();
}

async function loadAllImages() {
    spaceBackground = await loadImage(paths.assets + paths.textures + paths.backgrounds + "bg_space.PNG");
}

function scaleAllCoordinates() {
}

function resizeToAspectRatio() {
    let windowRatio = windowWidth / windowHeight;
    let newWidth, newHeight;

    if (windowRatio > maxRatio) {
        newHeight = windowHeight;
        newWidth = newHeight * maxRatio;
    } else if (windowRatio < minRatio) {
        newWidth = windowWidth;
        newHeight = newWidth / minRatio;
    } else {
        newWidth = windowWidth;
        newHeight = windowHeight;
    }

    resizeCanvas(newWidth, newHeight);
}