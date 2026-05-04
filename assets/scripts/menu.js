let timesNewRoman;
let spaceBackground;

const hoverZoom = 1.1;

// Ratio
const minRatio = 3/2;
const maxRatio = 21/9;

// main/author
let renderedMenu = "main";

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

let buttons = {
    start: {
        positionY: 0.6,
        width: 0.2,
        height: 0.1,
        newSize: 1
    },
    author: {
        positionY: 0.75,
        width: 0.2,
        height: 0.1,
        newSize: 1
    },
    back: {
        positionY: 0.87,
        width: 0.2,
        height: 0.1,
        newSize: 1
    }
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

    timesNewRoman = await loadFont(paths.assets + paths.fonts + "timesNewRoman.otf");

    textFont(timesNewRoman);
    
    spaceBackground = await loadImage(paths.assets + paths.textures + paths.backgrounds + "bg_space.PNG");
}

function draw() {
    currentlyHovering = hovering();

    background(0);

    cursor(ARROW);

    image(
        spaceBackground,
        width / 2,
        height / 2,
        width,
        spaceBackground.height * (width / spaceBackground.width)
    );

    if (renderedMenu == "main") {
        fill("white");
        textSize(160 * height / 1080);
        text("Malý princ", width / 2, height * 0.25);

        fill("#e6b3e4");
        textSize(90 * height / 1080);
        text("Antoine de Saint-Exupéry", width / 2, height * 0.38);

        fill("white");

        buttons.start.newSize = 1;
        buttons.author.newSize = 1;

        if (currentlyHovering == "start") {
            cursor(HAND);
            buttons.start.newSize = hoverZoom;
        } else if (currentlyHovering == "author") {
            cursor(HAND);
            buttons.author.newSize = hoverZoom;
        }

        rect(width / 2, height * buttons.start.positionY, width * buttons.start.width * buttons.start.newSize, height * buttons.start.height * buttons.start.newSize);
        rect(width / 2, height * buttons.author.positionY, width * buttons.author.width * buttons.author.newSize, height * buttons.author.height * buttons.author.newSize);

        fill("black");

        push();
            textSize(70 * height / 1080 * buttons.start.newSize);
            text("Začít", width / 2, height * buttons.start.positionY);
        pop();

        push();
            textSize(70 * height / 1080 * buttons.author.newSize);
            text("O autorovi", width / 2, height * buttons.author.positionY);
        pop();

    } else if (renderedMenu == "author") {
        buttons.back.newSize = 1;

        if (currentlyHovering == "back") {
            cursor(HAND);
            buttons.back.newSize = hoverZoom;
        }

        fill("white");
        rect(width / 2, height * buttons.back.positionY, width * buttons.back.width * buttons.back.newSize, height * buttons.back.height * buttons.back.newSize);

        fill("black");
        textSize(70 * height / 1080 * buttons.back.newSize);
        text("Zpět", width / 2, height * buttons.back.positionY);

        fill("white");
        textSize(45 * width / 1920);
        text(
            "Autorem knihy Malý princ je Antoine de Saint-Exupéry (1900-1944), francouzský spisovatel, letec a dobrodruh. Narodil se ve Francii a už od mládí ho fascinovalo létání. Stal se pilotem a pracoval pro leteckou poštu, což ho zavedlo do různých částí světa, například do Afriky nebo Jižní Ameriky. Jeho zážitky z létání a samoty v přírodě silně ovlivnily jeho tvorbu. Saint-Exupéry psal knihy, ve kterých spojoval dobrodružství s filozofickými myšlenkami o životě, přátelství, lásce a odpovědnosti. Mezi jeho další známá díla patří například Noční let nebo Země lidí. Během druhé světové války sloužil jako vojenský pilot. V roce 1944 při průzkumném letu nad Středozemním mořem zmizel a už se nikdy nevrátil. Okolnosti jeho smrti zůstaly dlouho nejasné. Jeho nejznámější dílo, Malý princ, je pohádkový příběh s hlubokým poselstvím, který oslovuje děti i dospělé.",
            width / 2,
            height * 0.42,
            width * 0.8
        );
    }
}

function mousePressed() {
    if (mouseButton.left) {
        if (currentlyHovering == "start") {
            window.location.href = "game.html";
        } else if (currentlyHovering == "author") {
            renderedMenu = "author";
        } else if (currentlyHovering == "back") {
            renderedMenu = "main";
        }
    }
}

function windowResized() {
    resizeToAspectRatio();
}

function resizeToAspectRatio() {
    let windowRatio = windowWidth / windowHeight;
    let newWidth;
    let newHeight;

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

function hovering() {
    if (renderedMenu == "main" && mouseX > width / 2 - width * buttons.start.width / 2 && mouseX < width / 2 + width * buttons.start.width / 2 && mouseY > height * buttons.start.positionY - height * buttons.start.height / 2 && mouseY < height * buttons.start.positionY + height * buttons.start.height / 2) {
        return "start";
    } else if (renderedMenu == "main" && mouseX > width / 2 - width * buttons.author.width / 2 && mouseX < width / 2 + width * buttons.author.width / 2 && mouseY > height * buttons.author.positionY - height * buttons.author.height / 2 && mouseY < height * buttons.author.positionY + height * buttons.author.height / 2) {
        return "author";
    } else if (renderedMenu == "author" && mouseX > width / 2 - width * buttons.back.width / 2 && mouseX < width / 2 + width * buttons.back.width / 2 && mouseY > height * buttons.back.positionY - height * buttons.back.height / 2 && mouseY < height * buttons.back.positionY + height * buttons.back.height / 2) {
        return "back";
    } else {
        return "none";
    }
}
