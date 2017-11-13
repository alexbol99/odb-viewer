import { Job } from '../models/job';
import Flatten from 'flatten-js';

let {Point, Segment, Arc, Polygon} = Flatten;
let { vector } = Flatten;

const inch2pixels = 10160000;

function toPixels(str) {
    return Math.round(Number(str)*inch2pixels,0);
}

function parsePolygon(lines, start) {
    let shapes = [];
    let i = start;
    let line = lines[i];
    let terms = line.split(' ');
    let ps = new Point( toPixels(terms[1]), toPixels(terms[2]) );
    let pe;
    let pc;
    let end_of_face = false;
    while(true) {
        line = lines[i];
        terms = line.split(' ');
        switch (terms[0]) {
            case 'OS':
                pe = new Point( toPixels(terms[1]), toPixels(terms[2]) );
                shapes.push( new Segment(ps, pe));

                ps = pe.clone();
                break;
            case 'OC':
                pe = new Point( toPixels(terms[1]), toPixels(terms[2]) );
                pc = new Point( toPixels(terms[3]), toPixels(terms[4]) );

                let cwStr = terms[5];
                let counterClockwise = cwStr === 'Y' ? Flatten.CW : Flatten.CCW; /* sic ! */

                let startAngle = vector(pc,ps).slope;
                let endAngle = vector(pc, pe).slope;
                if (Flatten.Utils.EQ(startAngle, endAngle)) {
                    endAngle += 2*Math.PI;
                    counterClockwise = true;
                }
                let r = vector(pc, ps).length;

                shapes.push(new Arc(pc, r, startAngle, endAngle, counterClockwise));

                ps = pe.clone();
                break;
            case 'OE':
                end_of_face = true;
                break;
            default:
                break;
        }
        if (end_of_face) {
            break;
        }

        i++;
    }
    return shapes;
}

export function parseODB(filename, str) {
    let job = new Job();
    job.filename = filename;

    let arrayOfLines = str.match(/[^\r\n]+/g);
    let polygon;

    for (let i=0; i < arrayOfLines.length; i++) {
        let line = arrayOfLines[i];
        let terms = line.split(' ');

        switch (terms[0]) {
            case 'S':                  // surface started
                polygon = new Polygon();
                let termArr = line.split(' ');
                let polarity = termArr[1];      // consider later
                polygon.polarity = polarity;
                break;
            case 'OB':                  // polygon started
                let start = i;
                let shapes = parsePolygon(arrayOfLines, start);
                polygon.addFace(shapes);
                i = start + shapes.length + 1;
                break;
            case 'SE':     // surface ended
                job.shapes.push(polygon);
                break;
            default:
                break;
        }
    }
    return job;
}