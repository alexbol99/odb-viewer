import Flatten from 'flatten-js';

const pgmResolution = 25.500025;
const microns2pixels = 400;
// const inch2pixels = 10160;
// const offsetX = 12.322830;
// const offsetY = 8.326776;
const sizeX = 3.0303;

function toPixels(str) {
    let num = Number(str);
    return Math.round(num*pgmResolution*microns2pixels,0);
}

export function parseImage(file) {
    let image = {};          // TODO: to be Flatten.Image

    let terms = file.name.split('_');
    let yStr = terms[0].substr(1);
    let xStr = terms[1].substr(1);

    let x = toPixels(xStr) + 90000;
    let y = toPixels(yStr) - 40000;

    image.center = new Flatten.Point(x,y);
    image.width = sizeX*microns2pixels*1000;    // 2 mm
    image.box = new Flatten.Box(
        image.center.x - image.width/2,
        image.center.y - image.width/2,
        image.center.x + image.width/2,
        image.center.y + image.width/2,
    );

    return image;
}