// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function savetrail() {
    var now = new Date();
    var storekey = "games." + now.getUTCFullYear() + "" + (now.getUTCMonth() + 1);
    var storedgames = read(storekey);
    if (storedgames === undefined) {
      storedgames = {}
    }
    var gamekey = now.getTime();
    storedgames[gamekey] = game;
    write(storekey, storedgames);
  }
  /*
   */
function write(k, v) {
  localStorage[k] = JSON.stringify(v);
}

function read(k) {
  if (localStorage[k] === undefined) {
    return undefined;
  }
  return JSON.parse(localStorage[k]);
}

function register(what) {
  var key = "l" + getLevel();

  if (Number(read(key)) === NaN) {
    key = 1;
  }
  write(key, read(key) + what);
}

function setLevel(level) {
  localStorage["level"] = level;
}

function getLevel() {
  if (getWins() > 40) {
    return 3;
  }
  if (getWins() > 20) {
    return 2;
  }
  return 1;
  level = Number(localStorage["level"]);
  if (level != NaN) {
    game.level = level;
  } else {
    localStorage["level"] = game.level;
  }
  return game.level;
}

function clearDiv(div) {
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

function setOperation(operation) {
  document.title = operation;
  document.querySelector("h1").textContent = operation;
  var operands = document.querySelectorAll(".operand"),
    lastop = operands[operands.length - 1];
  var opDiv = lastop.insertBefore(document.createElement("div"), lastop.firstChild);
  opDiv.classList.add("digit");
  opDiv.textContent = operation;
}

function showKeypad(index, target) {
  var positions = ["units",
    "tens",
    "hundreds",
    "thousands"
  ];
  var digitsDiv = document.querySelector("#digits");
  for (var i = 0; i < digitsDiv.classList.length; i++) {
    var c = digitsDiv.classList[i];
    digitsDiv.classList.remove(c);
  }
  digitsDiv.style.display = "initial";
  digitsDiv.classList.add(positions[index]);
  digitsDiv["xin-target"] = target;
  vpcenter(digitsDiv);
digitsDiv.style.top = resultDiv.offsetTop + resultDiv.offsetHeight;
}

function newDigit(char, kind) {
  var r = document.createElement(kind);
  r.classList.add("digit");
  r.textContent = char;
  if (kind === "button") {
    r.addEventListener('click', buttonPress);
    r.add
    var w = document.createElement("div");
    w.classList.add("digit");
    w.appendChild(r);
    return w;
  }
  return r;
}

function writeDiv(div, string, kind) {
  clearDiv(div);
  for (var i = 0; i < string.length; i++) {
    div.appendChild(newDigit(string[i], kind), div);
  }
  console.log("writeDiv", div, string);

}
function getOperands(low,high,carry) {
  if (typeof carry == "undefined") {
    carry = false;
  }
  operands = [getRandomInt(low, high), getRandomInt(low, high)];
}
function setup() {
  game = {
		'operation': '+',
    'level': 1,
    'operands': [],
    'trail': [],
    'strike': 0,
  }

  var level = getLevel();
  switch (level) {
    case 4: //
    case 3: // 2 digit operations and carry
      game.operands = [getRandomInt(30, 99), getRandomInt(30, 99)];
      break;
    case 2: // 2 digit operations
      game.operands = [getRandomInt(1, 50), getRandomInt(1, 50)];
      break;
    case 1: // 1 digit and carry
    case 0: // 1 digit operations
    default:
      game.operands = [getRandomInt(1, 9), getRandomInt(1, 9)];
  }

  operands = game.operands;
  real_result = operands.reduce(function(a, b) {
    switch (game.operation) {
      case '+':
        return a + b
        break;
      case '-':
        return a - b
        break;
      case '*':
        return a * b
        break;
      case '/':
        return a / b
        break;

    }

  });
  opels = document.querySelectorAll(".operand");
  for (var i = 0; i < opels.length; i++) {
    writeDiv(opels[i], String(operands[i]), "div");
    //opels[i].textContent = operands[i];
  };
  var rule = getCSSRule("#operation > div");
  rule.style.width = (String(operands[operands.length - 1]).length + 1) + "em";
  setOperation(game.operation);

  setupResult(String(real_result));
  replaceElements();
  playing = true;

  //result.style.width = String(real_result).length + "em";

}

function setupResult(string) {
  var zeros = "";
  for (var i = 0; i < string.length; i++) {
    zeros += "0";
  }
  writeDiv(resultDiv, zeros, "button")
}
function getWins() {
  var wins = read("wins");
  if (typeof wins == "undefined") {
    wins = 0;
  }
  return wins;
}
function check() {
  console.log("check");
  if (Number(real_result) === Number(readResult())) {
    // Win
    console.log("check ok");
    var wins = getWins();
    wins++;
    write("wins",wins);
    solve("ok");
  } else {
    console.log("check ko", Number(real_result) === Number(readResult()), Number(real_result), Number(readResult()));
    if (game.trail.length >= String(real_result).length) {
      strike();
    }
  }
}

function buttonPress(e) {
  var button = e.target,
    parent = e.target.parentNode.parentNode,
    digitsDiv = document.querySelector("#digits");
  console.log(parent.id, button.textContent);
  switch (parent.id) {
    case "result":
      var i = 0;
      var n = button.parentNode;
      while ((n = n.previousSibling) != null)
        i++;
      console.log("result", i, parent.children.length - i, button.parentNode);
      showKeypad(parent.children.length - i - 1, button);
      break;
    case "digits":
      game.trail.push({
        "value": button.textContent,
        "position": digitsDiv.classList.toString()
      });
      digitsDiv["xin-target"].textContent = button.textContent;
      digitsDiv.style.display = "none";
      check();
      break;
  }

}

function pocket(wat) {
  console.log(wat.propertyName, wat);
  var element = wat.target;

  if (["ko", "ok"].indexOf(element.id) == -1) {
    // Only listen to ko and ok button transitions.
    return;
  }
  if (wat.propertyName == "opacity") {
    /*
    	We get called for every property changed so we chose an animation that explicits a change.

    	We use opacity for diferent actions:
    		1) Fade the badge in (playing == false)
    			First time called. Fire fadeout (opacity = 0)
    			Change playing state (we want to play)
    		2) Move the operation out
    			Not binded to pocket
    		3) Pocket the badge (and continue playing)
    			When this transition ends we setup a new game
    */
    if (playing) {
      // save gametrail
      savetrail();
      setup(); // TODO: Use another function to explicit the flow
    } else {
      operationDiv.style.transition = "none";
      operationDiv.style.left = (window.innerWidth + 100) + "px"
      operationDiv.style.transition = "all 1s ease";

      var ref = window.getComputedStyle(document.querySelector("button.profile"));
      if (element.id == 'ok') {
        element.style.left = ref['left'];
        element.style.top = ref['top'];
      } else {
        // element.style.left = (-element.offsetWidth - 100) + 'px';
        element.style.top = '110vh';
        element.style.left = window.innerWidth / 2 - (document.querySelector("button.profile").offsetWidth / 2) + "px";
      }

      element.style.width = ref['width'];
      element.style.height = ref['height'];
      element.style.opacity = 0;
      playing = true;
    }
  }
}

function replaceElements() {
var digitsDiv = document.querySelector("#digits");
showKeypad(1);
digitsDiv.style.display = "none";


  ok.style.transition = '';
  ko.style.transition = '';

  operationDiv.style.opacity = 1;
  document.querySelector('#profile').style.display = 'none';
  var ref = window.getComputedStyle(document.querySelector("#operation"));
  ok.style.width = ref['height'];
  ok.style.height = ref['height'];
  vpcenter(ok);
  ok.style.top = '-10vh';

  ko.style.width = ref['height'];
  ko.style.height = ref['height'];
  vpcenter(ko);
  ko.style.top = '-10vh';
  //ok.classList.remove("show");
  //ko.classList.remove("show");
  ok.style.transition = "all 1s ease";
  ko.style.transition = "all 1s ease";

  operationDiv.style.transition = "all 1s ease";
  ok.addEventListener("transitionend", pocket, true);
  ko.addEventListener("transitionend", pocket, true);
}

function readResult() {
  var digits = resultDiv.querySelectorAll("button");
  var lecture = "";
  for (var i = 0; i < digits.length; i++) {
    lecture += digits[i].textContent;
  }
  return Number(lecture);
}



function strike() {
  game.strike++;
  console.log("game.strike", game.strike);
  if (game.strike == 3) {
    solve("ko");
  }
}

function solve(state) {
  var element = document.querySelector("#" + state);
  element.style.display = 'block';

  element.style.opacity = "0";
  hideOperation();


  element.classList.add("show");
  vpcenter(element);
  element.style.opacity = "1.0";
  playing = false;
  //
}

function setMode(mode) {}

var game;

var playing = false;

var resultDiv;
var real_result;
var operands;
var unfilled;
var ok = document.querySelector("#ok"),
  ko = document.querySelector("#ko"),
  operationDiv = document.querySelector("#operation");

window.addEventListener('load', function() {
  ok = document.querySelector("#ok"),
    ko = document.querySelector("#ko"),
    operationDiv = document.querySelector("#operation");

  resultDiv = document.getElementById('result');
  var calc = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];
  for (var i = 0; i < 10; i++) {
    var d = newDigit(calc[i], "button");
    document.querySelector("#digits").appendChild(d);
  }

  setup();

  resultDiv.addEventListener('input', function(e) {
    //console.log(e.target.);
    game.trail.push({
      "value": e.target.value,
      "position": e.target.getAttribute("tabindex")
    });
    check();
  });
  if (typeof localStorage.picture !== "undefined") {
    document.querySelector('button.profile').style.backgroundImage = "url(" + localStorage.picture + ")";
  }

});

function hideOperation() {
  var element = document.querySelector("#operation");
  operationDiv.style.opacity = 0;
  element.style.left = -element.offsetWidth + "px";
}

function vpcenter(vpc) {
  console.log("centering", vpc);
  console.log("window:", window.innerWidth, "x", window.innerHeight);
  console.log("element:", vpc.offsetWidth, "x", vpc.offsetHeight);
  console.log(window.innerHeight / 2, vpc.offsetHeight / 2);
  vpc.style.left = ((window.innerWidth / 2) - (vpc.offsetWidth / 2)) + "px";
  vpc.style.top = ((window.innerHeight / 2) - (vpc.offsetHeight / 2)) + "px";
  vpc.style.position = "absolute";
}

function replayAll() {
  var digits = resultDiv.children.length;
  var lecture = "";
  for (var j = 0; j < digits; j++) {
    resultDiv.children[i].value = "";
  }

  for (var i = 0; i < game.trail.length; i++) {
    replay(i);
  }
}

function replay(m) {
  var position = game.trail[m].position;
  var value = game.trail[m].value;
  var input = document.querySelector('[tabindex="' + position + '"]');
  input.value = value;
  check();
}

function debug(wat) {
  document.getElementById('debug').textContent += new Date() + "> " + wat + "\n";
}
