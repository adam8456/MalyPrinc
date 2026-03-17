let buttons = {
    play: {
        positionPercentage: [50, 50],

        position: [],

        sizePercentage: [25, 7],
        size: []
    }
}

async function setup() {
    createCanvas(windowWidth, windowHeight);

    buttons.play.position = [buttons.play.positionPercentage[0] / 100 * width, buttons.play.positionPercentage[1] / 100 * height];
    buttons.play.size = [buttons.play.sizePercentage[0] / 100 * width, buttons.play.sizePercentage[1] / 100 * height];
}

function draw() {
    rectMode(CENTER)
    textSize(60 * width / 2560)
    textAlign(CENTER, CENTER)
    rect(buttons.play.position[0], buttons.play.position[1], buttons.play.size[0], buttons.play.size[1]);
    text("Spustit", buttons.play.position[0], buttons.play.position[1]);
}