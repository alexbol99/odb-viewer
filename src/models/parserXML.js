import { Job } from '../models/job';
import Flatten from 'flatten-js';

let {Point, Segment, Arc, Polygon} = Flatten;
let { vector } = Flatten;

function parseEdges(edgesXML) {
    let edges = [];

    for (let edge of edgesXML) {
        let type = edge.getAttribute('type');

        if (type === "segment") {
            let ps = new Point(parseInt(edge.getAttribute('xs'),10), parseInt(edge.getAttribute('ys'),10));
            let pe = new Point(parseInt(edge.getAttribute('xe'),10), parseInt(edge.getAttribute('ye'),10));

            edges.push(new Segment(ps, pe));
        }

        if (type === "curve") {
            let ps = new Point(parseInt(edge.getAttribute('xs'),10), parseInt(edge.getAttribute('ys'),10));
            let pe = new Point(parseInt(edge.getAttribute('xe'),10), parseInt(edge.getAttribute('ye'),10));
            let pc = new Point(parseInt(edge.getAttribute('xc'),10), parseInt(edge.getAttribute('yc'),10));

            let counterClockwise = edge.getAttribute('cw') === 'no' ? true : false;

            let startAngle = vector(pc,ps).slope;
            let endAngle = vector(pc, pe).slope;

            let r = vector(pc, ps).length;

            edges.push(new Arc(pc, r, startAngle, endAngle, counterClockwise));
        }
    }

    return edges;
}

function parsePolygon(polygonsXML) {
    let polygon = new Polygon();

    // let nedges = parseInt(profile.getAttribute("n_edges"), 10);

    // Augment Flatten object with style
    let color = polygonsXML.getAttribute("color");
    polygon.style = {
        stroke: color || undefined,
        fill: color || undefined,
        alpha: 1.0
    };

    // Augment Flatten object with label
    let label = polygonsXML.getAttribute("label");
    polygon.label = label;

    // Add islands
    let islands = polygonsXML.getElementsByTagName('island');
    for (let island of islands) {
        let edgesXML = island.getElementsByTagName('edge');
        polygon.addFace(parseEdges(edgesXML));
    }

    // Add holes
    let holes = polygonsXML.getElementsByTagName('hole');
    for (let hole of holes) {
        let edgesXML = hole.getElementsByTagName('edge');
        polygon.addFace(parseEdges(edgesXML));
    }

    return polygon;
}

function parseSegment(segmentXML) {
    let ps = new Point(parseInt(segmentXML.getAttribute('xs'),10), parseInt(segmentXML.getAttribute('ys'),10));
    let pe = new Point(parseInt(segmentXML.getAttribute('xe'),10), parseInt(segmentXML.getAttribute('ye'),10));

    let segment = new Segment(ps, pe);

    // Augment Flatten object with label property
    let label = segmentXML.getAttribute("label");
    segment.label = label;

    return segment;
}

function parsePoint(pointXML) {
    let point = new Point(parseInt(pointXML.getAttribute('x'),10), parseInt(pointXML.getAttribute('y'),10));

    // Augment Flatten object with label property
    let label = pointXML.getAttribute("label");
    point.label = label;

    return point;
}
export function parseXML(filename, str) {
    let job = new Job();

    job.filename = filename;

    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(str, "text/xml");

    // Parse document title
    let titles = xmlDoc.getElementsByTagName('title');
    if (titles && titles.length > 0) {
        job.title = titles[0].firstChild.nodeValue;          // take the first title if more than one
    }

    // Parse profiles and add polygons to the job
    let profilesXML = xmlDoc.getElementsByTagName('profile');
    for (let profileXML of profilesXML) {
        let polygon = parsePolygon(profileXML);
        job.profiles.push(polygon);
    }

    // Parse materials and add polygons to the job
    let materialXML = xmlDoc.getElementsByTagName('material');
    for (let shapeXML of materialXML) {
        let polygon = parsePolygon(shapeXML);
        job.materials.push(polygon);
    }

    // Parse segments
    let segmentsXML = xmlDoc.getElementsByTagName('segment');
    for (let segmentXML of segmentsXML) {
        let segment = parseSegment(segmentXML);
        job.shapes.push(segment);
    }

    // Parse points
    let pointsXML = xmlDoc.getElementsByTagName('point');
    for (let pointXML of pointsXML) {
        let point = parsePoint(pointXML);
        job.shapes.push(point);
    }
    return job;
}
