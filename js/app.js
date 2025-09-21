const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "";

for (let key of keys) {
  const value = key.dataset.key;
  key.addEventListener('click', () => {
    if (IsEmpty(input)) {
      if (isDigit(value) ||
      value === "-"){
        input += value;
      } else if (isBracketsKey(value)) {
        input += "(";
      }
    } else {
      let prv = input.at(-1);
      if (value === "clear"){
        input = "";
        display_input.innerHTML = "";
        display_output.innerHTML = "";
      } else if (value === "backspace") {
        input = input.slice(0,-1);
      } else if (value === "=") {
        let validInput = BalanceInput(input);
        let result = eval(validInput);
        display_input.innerHTML = CleanInput(validInput);
        display_output.innerHTML = CleanOutput(result);
      } else if (value === "brackets") {
        let open = 0
        let close = 0
        for (c of input) {
          if (c === "(") open++;
          else if (c === ")") close++;
        }
        if (input.length === 0) {
          input += '(';
        }
        else if (isOperator(input.at(-1))) {
          input += '(';
        }

        else if (isDigit(prv) || isCloseBrackets(prv)) {
          if (open > close) input += ")";
          else {
            input += "*(";
          }
        }
        else if (isDecimal(prv)){
          input += "0"
          if (open > close) input +=  ')';
          else input += '*(';
        }
        else if(isOpenBrackets(prv)) {
          input += '(';
        }
        else if (isOperator(prv)) {
          input += '(';
        }
      } else if (isDigit(value)) {
        if (isPercent(prv) || isCloseBrackets(prv)) input += `*${value}`;
        else input += value;
      } else if (isOperator(value)) {
        if (isOpenBrackets(prv)) {
          if (value === "-") input += value;
        } else if (isDecimal(prv)) {
          input += `0${value}`;
        }
        input += value;
      } else if (isDecimal(value)) {
        if (isDigit(prv)) {
          let c = input.length - 1
          let dc = 0
          while(true) {
            n = input[c]
            if (n === '.')
              dc++;
            else if (!isDigit(n))
              break;
            c--;
          }
          if (dc < 1)
            input += value;
        }
        else if (isOpenBrackets(prv) || isOperator(prv)) input += `0${value}`
      } else if (isPercent(value)) {
        if (isDigit(prv) || isCloseBrackets(prv)) input += "/100";
        else if (isDecimal(prv)) input += `0/100`;
        else if (isOperator(prv)) input = input.slice(0,-1) + "/100";
        else if (isOpenBrackets(prv)) input += "1/100";
      }
    }

    display_input.innerHTML = CleanInput(input);
  });
}

function CleanOutput(output) {
  let output_string = output.toString();
  let decimal = output_string.split(".")[1];
  output_string = output_string.split(".")[0];

  let output_array = output_string.split("");

  if (output_array.length > 3) {
    for (let i = output_array.length - 3; i > 0 ; i -= 3) {
      output_array.splice(i, 0, ",");
    }
  }

  if (decimal) {
    output_array.push(".");
    output_array.push(decimal);
  }

  return output_array.join("");
}

function BalanceInput(input) {
  let last = input.at(-1);
  if (isDecimal(last))
    input += '0'
  let open = 0
  let close = 0
  for (c of input) {
    if (c === "(") open++;
    else if (c === ")") close++;
  }
  for (let i = 0 ; i < open - close ; i++) {
    input += ')';
  }
  return input;
}
function CleanInput(input) {
  let input_array = input.split("");
  let input_array_length = input_array.length;

  for (let i = 0; i < input_array_length; i++) {
    if (input_array[i] === "*") {
      input_array[i] = ` <span class="operator">x</span> `;
    } else if (input_array[i] === "/") {
      input_array[i] = ` <span class="operator">÷</span> `;
    } else if (input_array[i] === "+") {
      input_array[i] = ` <span class="operator">+</span> `;
    } else if (input_array[i] === "-") {
      input_array[i] = ` <span class="operator">- </span> `;
    } else if (input_array[i] === "(") {
      input_array[i] = ` <span class="brackets">(</span> `;
    } else if (input_array[i] === ")") {
      input_array[i] = ` <span class="brackets">)</span> `;
    } else if (input_array[i] === "%") {
      input_array[i] = ` <span class="percent">%</span> `;
    }
  }
  return input_array.join("")
}

function IsEmpty(x) {
  return x.length === 0;
}

function isDigit(x) {
  return x in ["1","2","3","4","5","6","7","8","9","0"];
}

function isDecimal(x) {
  return x === '.';
}
function isOperator(x) {
  return x === "*" || x === "/" || x === "-" | x === "+";
}

function isPercent(x) {
  return x === "%";
}


function isBracketsKey(x){
  return x === "brackets";
}
function isOpenBrackets(x) {
  return x === "(";
}

function isCloseBrackets(x) {
  return x === ")";
}
