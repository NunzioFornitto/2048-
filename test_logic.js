const gameSize = 4;
let grid;

function move(dir, tiles) {
    const current = JSON.parse(JSON.stringify(tiles));
    let moved = false;
    let points = 0;
    let bigMerge = false;

    // Create grid
    grid = Array(gameSize).fill().map(() => Array(gameSize).fill(null));
    current.forEach(t => { grid[t.r][t.c] = { ...t, merged: false }; });

    // Move and merge
    const traverseRows = dir === 'down'
        ? Array.from({ length: gameSize }, (_, i) => gameSize - 1 - i)
        : Array.from({ length: gameSize }, (_, i) => i);  

    const traverseCols = dir === 'right'
        ? Array.from({ length: gameSize }, (_, i) => gameSize - 1 - i)
        : Array.from({ length: gameSize }, (_, i) => i);

    for (const i of traverseRows) {
        for (const j of traverseCols) {
            if (grid[i][j]) {
                const tile = grid[i][j];
                grid[i][j] = null;

                let r = i, c = j;
                let mergedInto = false;

                // Move tile as far as possible
                if (dir === 'left') {
                    while (c > 0) {
                        if (grid[r][c - 1] === null) {
                            c--;
                            moved = true;
                        } else if (grid[r][c - 1].val === tile.val && !grid[r][c - 1].merged && !tile.merged) {
                            grid[r][c - 1].val *= 2;
                            grid[r][c - 1].merged = true;
                            points += grid[r][c - 1].val;
                            if (grid[r][c - 1].val >= 32) bigMerge = true;
                            moved = true;
                            mergedInto = true;
                            break;
                        } else {
                            break;
                        }
                    }
                } else if (dir === 'right') {
                    while (c < gameSize - 1) {
                        if (grid[r][c + 1] === null) {
                            c++;
                            moved = true;
                        } else if (grid[r][c + 1].val === tile.val && !grid[r][c + 1].merged && !tile.merged) {
                            grid[r][c + 1].val *= 2;
                            grid[r][c + 1].merged = true;
                            points += grid[r][c + 1].val;
                            if (grid[r][c + 1].val >= 32) bigMerge = true;
                            moved = true;
                            mergedInto = true;
                            break;
                        } else {
                            break;
                        }
                    }
                } else if (dir === 'up') {
                    while (r > 0) {
                        if (grid[r - 1][c] === null) {
                            r--;
                            moved = true;
                        } else if (grid[r - 1][c].val === tile.val && !grid[r - 1][c].merged && !tile.merged) {
                            grid[r - 1][c].val *= 2;
                            grid[r - 1][c].merged = true;
                            points += grid[r - 1][c].val;
                            if (grid[r - 1][c].val >= 32) bigMerge = true;
                            moved = true;
                            mergedInto = true;
                            break;
                        } else {
                            break;
                        }
                    }
                } else if (dir === 'down') {
                    while (r < gameSize - 1) {
                        if (grid[r + 1][c] === null) {
                            r++;
                            moved = true;
                        } else if (grid[r + 1][c].val === tile.val && !grid[r + 1][c].merged && !tile.merged) {
                            grid[r + 1][c].val *= 2;   
                            grid[r + 1][c].merged = true;
                            points += grid[r + 1][c].val;
                            if (grid[r + 1][c].val >= 32) bigMerge = true;
                            moved = true;  
                            mergedInto = true;
                            break;
                        } else {
                            break;
                        }
                    }
                }

                if (!mergedInto) {
                    tile.r = r;
                    tile.c = c;
                    grid[r][c] = tile;
                }
            }
        }
    }

    // Collect tiles
    const nextTiles = [];
    for (let r = 0; r < gameSize; r++) {
        for (let c = 0; c < gameSize; c++) {
            if (grid[r][c]) {
                const t = grid[r][c];
                nextTiles.push({ val: t.val, r: t.r, c: t.c });
            }
        }
    }
    return nextTiles;
}

// Test Case 1: [2, 2, 2, 2] Right -> [0, 0, 4, 4]
const t1 = [
    { val: 2, r: 0, c: 0 }, { val: 2, r: 0, c: 1 }, { val: 2, r: 0, c: 2 }, { val: 2, r: 0, c: 3 }
];
const r1 = move('right', t1);
console.log('Test 1 (Right):', JSON.stringify(r1));

// Test Case 2: [2, 2, 2, 2] Left -> [4, 4, 0, 0]
const r2 = move('left', t1);
console.log('Test 2 (Left):', JSON.stringify(r2));

// Test Case 3: Column [2, 2, 2, 2] Down -> [0, 0, 4, 4]
const t3 = [
    { val: 2, r: 0, c: 0 }, { val: 2, r: 1, c: 0 }, { val: 2, r: 2, c: 0 }, { val: 2, r: 3, c: 0 }
];
const r3 = move('down', t3);
console.log('Test 3 (Down):', JSON.stringify(r3));

// Test Case 4: Column [2, 2, 2, 2] Up -> [4, 4, 0, 0]
const r4 = move('up', t3);
console.log('Test 4 (Up):', JSON.stringify(r4));

// Test Case 5: [8, 8, 16, 16] Right -> [0, 0, 16, 32]
const t5 = [
    { val: 8, r: 0, c: 0 }, { val: 8, r: 0, c: 1 }, { val: 16, r: 0, c: 2 }, { val: 16, r: 0, c: 3 }
];
const r5 = move('right', t5);
console.log('Test 5 (8s and 16s Right):', JSON.stringify(r5));

// Test Case 6: [4, 4, 8, 8] Left -> [8, 16, 0, 0]
const t6 = [
    { val: 4, r: 0, c: 0 }, { val: 4, r: 0, c: 1 }, { val: 8, r: 0, c: 2 }, { val: 8, r: 0, c: 3 }
];
const r6 = move('left', t6);
console.log('Test 6 (4s and 8s Left):', JSON.stringify(r6));
