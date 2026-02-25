let dT;

let showHitboxes = false;

let timesNewRoman;
let spaceBackground;

// Ratio
const minRatio = 3/2;
const maxRatio = 21/9;
let currentRatio;

let ratioTooSmall;
let ratioTooLarge;

// Planet with fox
const foxPlanet = "planet3";

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

// Landing
let landingTimerStart = 500;
let landingTimer = landingTimerStart;

// Buttons
const hoverZoom = 1.1;
const buttonRadius = 150;
let hovering = "none";

// Prince
let prince = {
    textureData: {
        noFox: {
            texture: null,
            textureName: "plane.PNG"
        },
        withFox: {
            texture: null,
            textureName: "plane_fox.PNG"
        }
    },

    position: {
        start: {
            original: [200, 800],
            scaled: []
        },

        current: {
            original: [],
            scaled: []
        },

        target: {
            original: [],
            scaled: []
        }
    },

    width: {
        original: 300,
        scaled: null
    },

    speed: 1000,
    moving: false,

    canMove: false,
    movingTowards: null,
    movingRight: true,
    currentPlanet: "planet1",
    justLanded: false,

    hasFox: false,

    scaleCoordinates() {
        this.scalePosition();
        this.width.scaled = this.width.original / 1920 * width;
    },

    scalePosition() {
        this.position.current.scaled = [this.position.current.original[0] / 1920 * width, this.position.current.original[1] / 1080 * height];
    },

    executeMovement() {
        if (this.moving) {
            let dx = this.position.target.original[0] - this.position.current.original[0];
            let dy = this.position.target.original[1] - this.position.current.original[1];

            let distance = dist(
                this.position.current.original[0], this.position.current.original[1],
                this.position.target.original[0], this.position.target.original[1]
            );
    
            if (distance > 0) {
                let dirX = dx / distance;
                let dirY = dy / distance;
    
                let moveX = dirX * this.speed * dT;
                let moveY = dirY * this.speed * dT;
    
                let moveDistance = Math.sqrt(moveX*moveX + moveY*moveY);
    
                if (moveDistance >= distance) {
                    this.position.current.original = [...this.position.target.original];
                    this.moving = false;
    
                    this.currentPlanet = this.movingTowards;
    
                    this.justLanded = true;
                    paper.paperSequenceActive = true;

                    if (this.currentPlanet == foxPlanet) {
                        this.hasFox = true;
                    }
                } else {
                    this.position.current.original[0] += moveX;
                    this.position.current.original[1] += moveY;
                }
            }
        }
    },

    draw() {
        let texture;
        let targetPosition;

        this.executeMovement();

        if (this.hasFox) {
            texture = this.textureData.withFox.texture;
        } else {
            texture = this.textureData.noFox.texture;
        }

        push();
            if (this.movingRight) {
                translate(this.position.current.scaled[0], this.position.current.scaled[1]);
                scale(-1, 1);

                targetPosition = [0, 0];
            } else {
                targetPosition = [this.position.current.scaled[0], this.position.current.scaled[1]];
            }
            
            image(
                texture,
                targetPosition[0],
                targetPosition[1],
                this.width.scaled,
                texture.height * (this.width.scaled / texture.width)
            );
        pop();
    }
}

// Planets
let planets = {
    planetData: {

        planet1: {
            textureData: {
                texture: null,
                textureName: "planet1.PNG"
            },
            position: {
                original: [200, 850],
                scaled: []
            },
            width: {
                original: 350,
                scaled: null
            }
        },

        planet2: {
            textureData: {
                texture: null,
                textureName: "planet2.PNG"
            },
            position: {
                original: [450, 300],
                scaled: []
            },
            width: {
                original: 420,
                scaled: null
            }
        },

        planet3: {
            textureData: {
                texture: null,
                textureName: "planet3.PNG"
            },
            position: {
                original: [750, 800],
                scaled: []
            },
            width: {
                original: 360,
                scaled: null
            }
        },

        planet4: {
            textureData: {
                texture: null,
                textureName: "planet4.PNG"
            },
            position: {
                original: [1000, 300],
                scaled: []
            },
            width: {
                original: 500,
                scaled: null
            }
        },

        planet5: {
            textureData: {
                texture: null,
                textureName: "planet5.PNG"
            },
            position: {
                original: [1300, 800],
                scaled: []
            },
            width: {
                original: 400,
                scaled: null
            }
        },

        planet6: {
            textureData: {
                texture: null,
                textureName: "planet6.PNG"
            },
            position: {
                original: [1600, 300],
                scaled: []
            },
            width: {
                original: 630,
                scaled: null
            }
        }

    },

    scaleCoordinates() {
        for (const key in this.planetData) {
            const planet = this.planetData[key];
            
            planet.position.scaled = [planet.position.original[0] / 1920 * width, planet.position.original[1] / 1080 * height];
            planet.width.scaled = planet.width.original / 1920 * width;
        }
    },

    draw() {
        let planetWidth;

        for (const key in this.planetData) {
            const planet = this.planetData[key];
            
            if (dist(mouseX, mouseY, planet.position.scaled[0], planet.position.scaled[1]) <= planet.width.scaled / 2) {
                hovering = key;
                break;
            } else {
                cursor(ARROW);
            }
        }

        if (prince.justLanded) {
            if (landingTimer <= 0) {
                landingTimer = landingTimerStart;
                prince.justLanded = false;
                paper.animationInProgress = true;
                paper.paperSequenceActive = true;
            } else {
                landingTimer -= deltaTime;
            }
        }

        for (const key in this.planetData) {
            const planet = this.planetData[key];
            const canMoveConditions = hovering == key && prince.currentPlanet != key && !prince.moving && !paper.paperSequenceActive && hovering != "planet1";
    
            if (canMoveConditions) {
                prince.canMove = true;
                planetWidth = planet.width.scaled * hoverZoom;
                cursor(HAND);
            } else {
                planetWidth = planet.width.scaled;
            }

            image(
                planet.textureData.texture,
                planet.position.scaled[0],
                planet.position.scaled[1],
                planetWidth,
                planet.textureData.texture.height * (planetWidth / planet.textureData.texture.width)
            );

            if (showHitboxes) {
                push();
                    fill(255, 0, 0, 128);
                    circle(planet.position.scaled[0], planet.position.scaled[1], planet.width.scaled);
                pop();
            }
        }
    }

};

// Paper
let paper = {
    textureData: {
        texture: null,
        textureName: "bg_paper.PNG"
    },
    
    width: {
        original: 750,
        scaled: null
    },

    visible: false,

    animationLength: 400,
    animationInProgress: false,
    currentAlpha: 0,

    paperSequenceActive: false,

    symbol: {
        symbolData: {},

        currentSymbol: "rose",

        image: {
            currentTexture: null,

            position: [],
            width: null,
            height: null,

            draw() {
                for (const key in paper.symbol.symbolData) {
                    const symbol = paper.symbol.symbolData[key];
                    
                    if (symbol.location == prince.currentPlanet) {
                        paper.symbol.currentSymbol = key;
                    }
                }

                const positionOnPaper = paper.symbol.symbolData[paper.symbol.currentSymbol].positionOnPaper;
                const widthOnPaper = paper.symbol.symbolData[paper.symbol.currentSymbol].widthOnPaper;
                
                this.currentTexture = paper.symbol.symbolData[paper.symbol.currentSymbol].textureData.texture;

                this.position = [
                    (width - paper.width.scaled) / 2 + positionOnPaper[0] / 100 * paper.width.scaled,
                    height / 2 - paper.textureData.texture.height * (paper.width.scaled / paper.textureData.texture.width) / 2 + positionOnPaper[1] / 100 * paper.textureData.texture.height * (paper.width.scaled / paper.textureData.texture.width)
                ];

                this.width = (widthOnPaper / 100) * paper.width.scaled;
                this.height = this.currentTexture.height * (this.width / this.currentTexture.width);

                image(
                    this.currentTexture,
                    this.position[0],
                    this.position[1],
                    this.width,
                    this.height
                );
            }
        },

        name: {
            positionOnPaper: [50, 48],

            position: [],

            fontSize: {
                original: 75,
                scaled: null
            },

            scaleFontSize() {
                this.fontSize.scaled = this.fontSize.original * width / 2560;
            },

            draw() {
                const symbolName = paper.symbol.symbolData[paper.symbol.currentSymbol].name;

                this.position = [
                    (width - paper.width.scaled) / 2 + this.positionOnPaper[0] / 100 * paper.width.scaled,
                    height / 2 - paper.textureData.texture.height * (paper.width.scaled / paper.textureData.texture.width) / 2 + this.positionOnPaper[1] / 100 * paper.textureData.texture.height * (paper.width.scaled / paper.textureData.texture.width)
                ];

                push();
                    textSize(this.fontSize.scaled);
                    textAlign(CENTER, CENTER);
                    text(symbolName, this.position[0], this.position[1]);
                pop();
            }
        },

        text: {
            positionOnPaper: [50, 53],
            widthOnPaper: 75,            

            position: [],
            width: null,

            fontSize: {
                original: 34,
                scaled: null
            },

            scaleFontSize() {
                this.fontSize.scaled = this.fontSize.original * width / 2560;
            },

            draw() {
                const symbolText = paper.symbol.symbolData[paper.symbol.currentSymbol].text;
                
                this.width = (this.widthOnPaper / 100) * paper.width.scaled;

                this.position = [
                    (width - paper.width.scaled) / 2 + this.positionOnPaper[0] / 100 * paper.width.scaled,
                    height / 2 - paper.textureData.texture.height * (paper.width.scaled / paper.textureData.texture.width) / 2 + this.positionOnPaper[1] / 100 * paper.textureData.texture.height * (paper.width.scaled / paper.textureData.texture.width)
                ];

                push();
                    textSize(this.fontSize.scaled);
                    textAlign(CENTER, TOP);
                    rectMode(CENTER);
                    text(symbolText, this.position[0], this.position[1], this.width);
                pop();
            }
        },

        draw() {
            this.image.draw();
            this.name.draw();
            this.text.draw();
        }
    },

    cross: {
        textureData: {
            texture: null,
            textureName: "cross.PNG"
        },

        // Percentage of paper width/height
        positionOnPaper: [85.5, 10],
        widthOnPaper: 7,

        position: [],

        width: null,
        height: null,

        hovering() {
            return (
            mouseX > this.position[0] - this.width / 2 && mouseX < this.position[0] + this.width / 2 &&
            mouseY > this.position[1] - this.height / 2 && mouseY < this.position[1] + this.height / 2
            );
        },

        draw() {
            if (paper.visible) {
                let crossWidth;

                this.position = [
                    (width - paper.width.scaled) / 2 + this.positionOnPaper[0] / 100 * paper.width.scaled,
                    height / 2 - paper.textureData.texture.height * (paper.width.scaled / paper.textureData.texture.width) / 2 + this.positionOnPaper[1] / 100 * paper.textureData.texture.height * (paper.width.scaled / paper.textureData.texture.width)
                ];

                this.width = (this.widthOnPaper / 100) * paper.width.scaled;
                
                if (this.hovering()) {
                    crossWidth = this.width * hoverZoom;
                    cursor(HAND);
                } else {
                    crossWidth = this.width;
                    cursor(ARROW);
                }

                this.height = this.textureData.texture.height * (crossWidth / this.textureData.texture.width);

                image(
                    this.textureData.texture,
                    this.position[0],
                    this.position[1],
                    crossWidth,
                    this.height
                );
            }
        }
    },

    scaleCoordinates() {
        paper.width.scaled = paper.width.original / 1920 * width;

        paper.symbol.name.scaleFontSize();
        paper.symbol.text.scaleFontSize();
    },

    draw() {
        push();
            if (this.animationInProgress) {
                this.currentAlpha += 255 * deltaTime / this.animationLength;

                if (this.currentAlpha > 255) {
                    this.currentAlpha = 255;
                }

                tint(255, this.currentAlpha);

                if (this.currentAlpha == 255) {
                    this.currentAlpha = 0;
                    this.animationInProgress = false;

                    this.visible = true;
                }
            }

            if (this.visible || this.animationInProgress) {
                image(
                    this.textureData.texture,
                    width / 2,
                    height / 2,
                    this.width.scaled,
                    this.textureData.texture.height * (this.width.scaled / this.textureData.texture.width)
                );
            }
        pop();

        if (this.visible) {
            this.symbol.draw();
            this.cross.draw();
        }
    }
}

async function setup() {
    createCanvas(windowWidth, windowHeight);

    imageMode(CENTER);

    prince.position.current.original = [...prince.position.start.original];

    scaleAllCoordinates();

    currentRatio = width / height;
    ratioTooSmall = currentRatio < minRatio;
    ratioTooLarge = currentRatio > maxRatio;

    paper.symbol.symbolData = await loadJSON(paths.assets + paths.data + "symbols.json");
    timesNewRoman = await loadFont(paths.assets + paths.fonts + "timesNewRoman.otf");

    textFont(timesNewRoman);

    await loadAllImages();
}

function draw() {
    background(0);

    if (ratioTooSmall || ratioTooLarge) {
        let errorMessage;

        push();
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(50);

            if (ratioTooSmall) {
                errorMessage = "Poměr stran musí být minimálně 3:2.";
            } else if (ratioTooLarge) {
                errorMessage = "Poměr stran musí být maximálně 21:9."
            }

            text(
                errorMessage,
                0,
                height / 2,
                width
            );
        pop();

        return;
    }

    dT = deltaTime / 1000;
    
    hovering = "none";

    prince.canMove = false;
    prince.scalePosition();

    image(
        spaceBackground,
        width  / 2,
        height / 2,
        width,
        spaceBackground.height * (width / spaceBackground.width)
    );

    planets.draw();
    prince.draw();
    paper.draw();
}

function mousePressed() {
    if(mouseButton.left) {
        if (paper.cross.hovering()) {
            paper.visible = false;
            paper.paperSequenceActive = false;
        } else if (prince.canMove) {
            prince.position.target.original = planets.planetData[hovering].position.original;
            prince.movingTowards = hovering;
            prince.moving = true;

            if (prince.position.current.original[0] < prince.position.target.original[0]) {
                prince.movingRight = true;
            } else {
                prince.movingRight = false;
            }
        }
    }
}

function keyPressed() {
    if (key == "j" && !showHitboxes) {
        showHitboxes = true;
    } else if (key == "j" && showHitboxes) {
        showHitboxes = false;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    currentRatio = width / height;
    ratioTooSmall = currentRatio < minRatio;
    ratioTooLarge = currentRatio > maxRatio;

    if (ratioTooSmall || ratioTooLarge) {
        return;
    }
    
    scaleAllCoordinates();
}

async function loadAllImages() {
    spaceBackground = await loadImage(paths.assets + paths.textures + paths.backgrounds + "bg_space.PNG");
    paper.textureData.texture = await loadImage(paths.assets + paths.textures + paths.backgrounds + paper.textureData.textureName)

    paper.cross.textureData.texture = await loadImage(paths.assets + paths.textures + paths.icons + paper.cross.textureData.textureName);

    prince.textureData.noFox.texture = await loadImage(paths.assets + paths.textures + paths.characters + prince.textureData.noFox.textureName);
    prince.textureData.withFox.texture = await loadImage(paths.assets + paths.textures + paths.characters + prince.textureData.withFox.textureName);
    
    for (const key in planets.planetData) {
        const planet = planets.planetData[key];

        planet.textureData.texture = await loadImage(paths.assets + paths.textures + paths.planets + planet.textureData.textureName);
    }

    for (const key in paper.symbol.symbolData) {
        paper.symbol.symbolData[key].textureData.texture = await loadImage(paths.assets + paths.textures + paths.symbols + paper.symbol.symbolData[key].textureData.textureName);
    }
}

function scaleAllCoordinates() {
    planets.scaleCoordinates();
    prince.scaleCoordinates();
    paper.scaleCoordinates();
}