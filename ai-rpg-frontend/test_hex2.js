const { defineHex, Grid, Orientation } = require('honeycomb-grid');
const CustomHex = defineHex({ dimensions: 16, orientation: Orientation.POINTY });
const grid = new Grid(CustomHex, [{q: 0, r: 0}, {q: 1, r: 0}]);
grid.forEach(hex => {
    console.log(`Hex q=${hex.q}, r=${hex.r} -> x=${hex.x}, y=${hex.y}`);
    console.log(`Corners:`, hex.corners);
});
