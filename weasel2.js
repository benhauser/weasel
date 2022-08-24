// weasel2.js
// ----------
//
// experiments with:
// 1. mutating by nudging a character along the alphabet rather than generating
//    a totally new random character. I thought this would make it converge
//    faster. It did but not by much.
// 2. Hyperparameter tuning:
//    a. I discovered threshold is best at about 5%.
//    b. And nudge distance is best as a random int between 1 and 4.
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
const target = 'METHINKS IT IS LIKE A WEASEL';
// hyperparameter tuning gave 0.05 as the best mutation threshold:
//
// threshold: 0.01 mean: 5657.32 median: 6067
// threshold: 0.02 mean: 3453.36 median: 2884
// threshold: 0.03 mean: 2732.31 median: 2379
// threshold: 0.04 mean: 2421.48 median: 1880
// threshold: 0.05 mean: 2241.2 median: 1884
// threshold: 0.06 mean: 2282.29 median: 2490
// threshold: 0.07 mean: 2273.32 median: 2756
// threshold: 0.08 mean: 2579.04 median: 1954
// threshold: 0.09 mean: 2802.12 median: 2438
// threshold: 0.10 mean: 2754.41 median: 1422
// threshold: 0.11 mean: 3377.94 median: 2247
// threshold: 0.12 mean: 3409.71 median: 1867
// threshold: 0.13 mean: 4232.03 median: 2086
// threshold: 0.14 mean: 4572.11 median: 5044
// threshold: 0.15 mean: 5385.58 median: 5791
// threshold: 0.16 mean: 6430.09 median: 11805
// threshold: 0.17 mean: 7147.46 median: 5491
// threshold: 0.18 mean: 8826.32 median: 5994
// threshold: 0.19 mean: 10114.07 median: 19276
let mutationThreshold = 0.05;
// hyperparameter tuning consistently gave 4 as the best mutation distance:
//
// distance: 2 mean: 3877.86 median: 3625
// distance: 3 mean: 2396.76 median: 2606
// distance: 4 mean: 2322.97 median: 2644
// distance: 5 mean: 2648.36 median: 2519
// distance: 6 mean: 2783.42 median: 2383
// distance: 7 mean: 3416.05 median: 4466
// distance: 8 mean: 3907.03 median: 3243
// distance: 9 mean: 4859.24 median: 3058
let mutationDistance = 4;

function getRandomCharacter() {
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function initialise() {
  let g = [];
  for (let i = 0; i < target.length; i++) {
    g.push(getRandomCharacter());
  }
  return g;
}

// lower the better
function score(g) {
  let score = 0;
  for (let i = 0; i < g.length; i++) {
    let gCode = g[i].charCodeAt(0);
    let tCode = target.charAt(i).charCodeAt(0);
    score += Math.abs(gCode - tCode);
  }
  return score;
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function shiftCharacter(c) {
  const currCharCode = c.charCodeAt(0);
  if (currCharCode === 32) {
    return 'M';
  } else {
    let newCharCode = (Math.random() < 0.5) ? (currCharCode + randomInt(mutationDistance)) : (currCharCode - randomInt(mutationDistance));
    if (newCharCode < 65 || newCharCode > 90) {
      newCharCode = 32;
    }
    return String.fromCharCode(newCharCode);
  }
}

function mutate(parent) {
  let offspring = [];
  for (let i = 0; i < parent.length; i++) {
    // offspring[i] = (Math.random() < mutationThreshold) ? getRandomCharacter() : parent[i];
    offspring[i] = (Math.random() < mutationThreshold) ? shiftCharacter(parent[i]) : parent[i];
  }
  return offspring;
}

function display(g) {
  return g.join('');
}

function run() {
  const results = [];
  let parent = initialise();
  results.push('STRING                       GENERATION');
  results.push('---------------------------- ----------');
  results.push(display(parent) + ' 0');
  let offspring = [];
  let generation = 0;
  for (; ;) {
    offspring = mutate(parent);
    if (score(offspring) < score(parent)) {
      results.push(display(offspring) + ' ' + generation);
      if (score(offspring) === 0) {
        break;
      }
      parent = offspring;
    }
    generation++;
  }
  return generation;
}

function runSet(threshold) {
  mutationThreshold = threshold;
  const generationCounts = [];
  for (let j = 0; j < 100; j++) {
    generationCounts.push(run());
  }
  let sum = 0;
  generationCounts.forEach((c) => sum += c);
  const mean = sum / generationCounts.length;
  const median = generationCounts[Math.floor(generationCounts.length / 2)];
  console.log(`threshold: ${threshold} mean: ${mean} median: ${median}`);
  // console.log(JSON.stringify(generationCounts, null, 2));
}

function runSetOfSets() {
  // for (let k = 2; k < 10; k++) {
  //   runSet(k);
  // }
  for (let k = 0.01; k < 0.1; k += 0.01) {
    runSet(k);
  }
}

runSetOfSets();