/**
 * Created by alexanderbol on 01/05/2017.
 */

import Flatten from 'flatten-js';
let {Point, Segment, Arc, Polygon} = Flatten;
let { vector } = Flatten;

/*
let debug_str = `+		[0]	{nrec=27 nalloc=27 h_ind_id=-1 ...} mat_cont_hdr_struc	mat_cont_struc
    +		[1]	{pmin=59146400,5973200 pmax=59606001,6438000} mat_cont_lim_struc	mat_cont_struc
+		[2]	{nedge=23 nalloc=25 ntop=2 ...} mat_cont_poly_struc	mat_cont_struc
+		[3]	{pmin=59146400,5973200 pmax=59606001,6438000} mat_cont_lim_struc	mat_cont_struc
+		[4]	{ps=59192738,6363124 pe=59216000,6372800 pc=59216000,6340000 cw=1} mat_curve_struc	mat_cont_struc
+		[5]	{ps=59216000,6372800 pe=59267652,6372800} mat_seg_struc	mat_cont_struc
+		[6]	{ps=59267652,6372800 pe=59267652,6307200 pc=59360000,6340000 cw=1} mat_curve_struc	mat_cont_struc
+		[7]	{ps=59267652,6307200 pe=59229586,6307200} mat_seg_struc	mat_cont_struc
+		[8]	{ps=59229586,6307200 pe=59212000,6289614} mat_seg_struc	mat_cont_struc
+		[9]	{ps=59212000,6289614 pe=59212000,6056386} mat_seg_struc	mat_cont_struc
+		[10]	{ps=59212000,6056386 pe=59229586,6038800} mat_seg_struc	mat_cont_struc
+		[11]	{ps=59229586,6038800 pe=59469614,6038800} mat_seg_struc	mat_cont_struc
+		[12]	{ps=59469614,6038800 pe=59487200,6056386} mat_seg_struc	mat_cont_struc
+		[13]	{ps=59487200,6056386 pe=59487200,6100500} mat_seg_struc	mat_cont_struc
+		[14]	{ps=59487200,6100500 pe=59434000,6180000 pc=59520000,6180000 cw=1} mat_curve_struc	mat_cont_struc
+		[15]	{ps=59434000,6180000 pe=59552800,6100500 pc=59520000,6180000 cw=1} mat_curve_struc	mat_cont_struc
+		[16]	{ps=59552800,6100500 pe=59552800,6042800} mat_seg_struc	mat_cont_struc
+		[17]	{ps=59552800,6042800 pe=59543124,6019538 pc=59520000,6042800 cw=1} mat_curve_struc	mat_cont_struc
+		[18]	{ps=59543124,6019538 pe=59506462,5982876} mat_seg_struc	mat_cont_struc
+		[19]	{ps=59506462,5982876 pe=59483200,5973200 pc=59483200,6006000 cw=1} mat_curve_struc	mat_cont_struc
+		[20]	{ps=59483200,5973200 pe=59216000,5973200} mat_seg_struc	mat_cont_struc
+		[21]	{ps=59216000,5973200 pe=59192738,5982876 pc=59216000,6006000 cw=1} mat_curve_struc	mat_cont_struc
+		[22]	{ps=59192738,5982876 pe=59156076,6019538} mat_seg_struc	mat_cont_struc
+		[23]	{ps=59156076,6019538 pe=59146400,6042800 pc=59179200,6042800 cw=1} mat_curve_struc	mat_cont_struc
+		[24]	{ps=59146400,6042800 pe=59146400,6303200} mat_seg_struc	mat_cont_struc
+		[25]	{ps=59146400,6303200 pe=59156076,6326462 pc=59179200,6303200 cw=1} mat_curve_struc	mat_cont_struc
+		[26]	{ps=59156076,6326462 pe=59192738,6363124} mat_seg_struc	mat_cont_struc
`;
*/

export class Parser {
    parseToWatchArray(str) {
        let arrayOfLines = str.match(/[^\r\n]+/g);
        let watchArray = [];
        for (let line of arrayOfLines) {
            watchArray.push(line.substring(line.indexOf('{')));
        }
        return watchArray;
    }

    parseToPolygon(str) {
        let polygon = new Polygon();
        // let mulitystr = debug_str;
        let arrayOfLines = str.match(/[^\r\n]+/g);

        for (let i=0; i < arrayOfLines.length; i++) {
            let line = arrayOfLines[i];
            if (line.search('mat_cont_poly_struc') >= 0) {
                let parenth = line.match(/\{([^)]+)\}/)[1];       // string inside {..}
                let termArr = parenth.split(' ');                 // array of terms "attr=value"
                let nedgesTerm = termArr[0];                      // "nedge=nn"
                let nedgesStr = nedgesTerm.split('=')[1];
                let nedges = parseInt(nedgesStr,10);

                // Create new face from next #nedges of segments and arcs
                let edges = [];
                for (let j=i+2; j < i+2+nedges; j++) {
                    line = arrayOfLines[j];
                    let parenth = line.match(/\{([^)]+)\}/)[1];   // string inside {..}
                    let termArr = parenth.split(' ');             // array of terms "attr=value"

                    if (line.search('mat_seg_struc') >= 0) {
                        let psArr = termArr[0].split('=')[1].split(',');
                        let ps = new Point(parseInt(psArr[0],10), parseInt(psArr[1],10));

                        let peArr = termArr[1].split('=')[1].split(',');
                        let pe = new Point(parseInt(peArr[0],10), parseInt(peArr[1],10));

                        edges.push(new Segment(ps, pe));
                    }
                    else if (line.search('mat_curve_struc') >= 0) {
                        let psArr = termArr[0].split('=')[1].split(',');
                        let ps = new Point(parseInt(psArr[0],10), parseInt(psArr[1],10));

                        let peArr = termArr[1].split('=')[1].split(',');
                        let pe = new Point(parseInt(peArr[0],10), parseInt(peArr[1],10));

                        let pcArr = termArr[2].split('=')[1].split(',');
                        let pc = new Point(parseInt(pcArr[0],10), parseInt(pcArr[1],10));

                        let cwStr = termArr[3].split('=')[1];
                        let counterClockwise = cwStr === '0' ? true : false;

                        let startAngle = vector(pc,ps).slope;
                        let endAngle = vector(pc, pe).slope;

                        if (Flatten.Utils.EQ(startAngle, endAngle)) {
                            endAngle += 2*Math.PI;
                        }
                        let r = vector(pc, ps).length;

                        edges.push(new Arc(pc, r, startAngle, endAngle, counterClockwise));
                    }
                }
                polygon.addFace(edges);
            }
        }
        return polygon;
    }
}

