const GpxParser = require('gpxparser');
const fs = require('fs');

const data = fs.readFileSync('C:/vibeCoding/LGR strona/lgr-media-server/articles/2026-03-25-trasa test/2025-07-16_2410366609_RPT Limanowa - Zabawa.gpx', 'utf-8');

const gpx = new GpxParser();
gpx.parse(data);

const track = gpx.tracks[0];
console.log("Distance:", track.distance.total);
console.log("Elevation Max:", track.elevation.max);
console.log("Elevation Neg:", track.elevation.neg);
console.log("Elevation Pos:", track.elevation.pos);
console.log("First coord:", track.points[0]);
console.log("Number of points:", track.points.length);
