const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
const target = 'METHINKS IT IS LIKE A WEASEL';
const mutationThreshold = 0.05;

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
    score += (g[i] === target.charAt(i)) ? 0 : 1;
  }
  return score;
}

function mutate(parent) {
  let offspring = [];
  for (let i = 0; i < parent.length; i++) {
    offspring[i] = (Math.random() < mutationThreshold) ? getRandomCharacter() : parent[i];
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
  for (;;) {
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
  document.getElementById('results').innerHTML = results.join('<br>');
}
