// Select all calculator keys
const keys = document.querySelectorAll('.key');

// Select display elements
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

// Current input string (raw expression)
let input = "";

// Loop through each calculator key and add event listeners
for (let key of keys) {
  const value = key.dataset.key; // read "data-key" attribute
  key.addEventListener('click', () => {
    if (IsEmpty(input)) {
      // If input is empty, only allow starting with a digit, minus, or brackets
      if (isDigit(value) || value === "-") {
        input += value;
      } else if (isBracketsKey(value)) {
        input += "(";
      }
    } else {
      // Last character in current input
      let prv = input.at(-1);

      // Clear all
      if (value === "clear") {
        input = "";
        display_input.innerHTML = "";
        display_output.innerHTML = "";

        // Delete last char
      } else if (value === "backspace") {
        input = input.slice(0, -1);

        // Evaluate the expression
      } else if (value === "=") {
        let validInput = BalanceInput(input);       // balance brackets, decimals
        let result = eval(validInput);              // ⚠️ Using eval is dangerous if input isn't sanitized!
        display_input.innerHTML = CleanInput(validInput);
        display_output.innerHTML = CleanOutput(result);

        // Handle brackets key
      } else if (value === "brackets") {
        let open = 0, close = 0;
        for (let c of input) {
          if (c === "(") open++;
          else if (c === ")") close++;
        }

        if (input.length === 0) {
          input += '(';
        } else if (isOperator(prv)) {
          input += '(';
        } else if (isDigit(prv) || isCloseBrackets(prv)) {
          if (open > close) input += ")";
          else input += "*(";
        } else if (isDecimal(prv)) {
          input += "0";
          if (open > close) input += ')';
          else input += '*(';
        } else if (isOpenBrackets(prv)) {
          input += '(';
        }
      }

      // Handle digit input
      else if (isDigit(value)) {
        if (isPercent(prv) || isCloseBrackets(prv)) input += `*${value}`;
        else input += value;

        // Handle operators
      } else if (isOperator(value)) {
        if (isOpenBrackets(prv)) {
          if (value === "-") input += value;
        } else if (isDecimal(prv)) {
          input += `0${value}`;
        } else {
          input += value;
        }

        // Handle decimal
      } else if (isDecimal(value)) {
        if (isDigit(prv)) {
          let c = input.length - 1;
          let dc = 0;
          while (c >= 0) {
            let n = input[c];
            if (n === '.') dc++;
            else if (!isDigit(n)) break;
            c--;
          }
          if (dc < 1) input += value;
        } else if (isOpenBrackets(prv) || isOperator(prv)) {
          input += `0${value}`;
        }

        // Handle percentage
      } else if (isPercent(value)) {
        if (isDigit(prv) || isCloseBrackets(prv)) input += "/100";
        else if (isDecimal(prv)) input += `0/100`;
        else if (isOperator(prv)) input = input.slice(0, -1) + "/100";
        else if (isOpenBrackets(prv)) input += "1/100";
      }
    }

    // Update input display (pretty format)
    display_input.innerHTML = CleanInput(input);
  });
}

// Format the output number (add commas, handle decimals)
function CleanOutput(output) {
  let output_string = output.toString();
  let decimal = output_string.split(".")[1];
  output_string = output_string.split(".")[0];

  let output_array = output_string.split("");

  // Add commas every 3 digits
  if (output_array.length > 3) {
    for (let i = output_array.length - 3; i > 0; i -= 3) {
      output_array.splice(i, 0, ",");
    }
  }

  if (decimal) {
    output_array.push(".");
    output_array.push(decimal);
  }

  return output_array.join("");
}

// Ensure balanced brackets and fix decimals before evaluation
function BalanceInput(input) {
  let last = input.at(-1);

  // If last is decimal, add a 0
  if (isDecimal(last)) input += '0';

  let open = 0, close = 0;
  for (let c of input) {
    if (c === "(") open++;
    else if (c === ")") close++;
  }

  // Add missing closing brackets
  for (let i = 0; i < open - close; i++) {
    input += ')';
  }
  return input;
}

// Clean input for display (replace symbols with pretty HTML)
function CleanInput(input) {
  let input_array = input.split("");
  let input_array_length = input_array.length;

  for (let i = 0; i < input_array_length; i++) {
    if (input_array[i] === "*") {
      input_array[i] = `<span class="operator">x</span>`;
    } else if (input_array[i] === "/") {
      input_array[i] = `<span class="operator">÷</span>`;
    } else if (input_array[i] === "+") {
      input_array[i] = `<span class="operator">+</span>`;
    } else if (input_array[i] === "-") {
      input_array[i] = `<span class="operator">-</span>`;
    } else if (input_array[i] === "(") {
      input_array[i] = `<span class="brackets">(</span>`;
    } else if (input_array[i] === ")") {
      input_array[i] = `<span class="brackets">)</span>`;
    } else if (input_array[i] === "%") {
      input_array[i] = `<span class="percent">%</span>`;
    }
  }
  return input_array.join("");
}

// ----------------- Utility Functions ------------------

// Check if input is empty
function IsEmpty(x) {
  return x.length === 0;
}

// FIX: Correct isDigit implementation
function isDigit(x) {
  return ["0","1","2","3","4","5","6","7","8","9"].includes(x);
}

// Check if decimal point
function isDecimal(x) {
  return x === '.';
}

// FIX: Add missing OR (use || not single |)
function isOperator(x) {
  return x === "*" || x === "/" || x === "-" || x === "+";
}

// Check if percent sign
function isPercent(x) {
  return x === "%";
}

// Check if key pressed was "brackets"
function isBracketsKey(x) {
  return x === "brackets";
}

// Check if open bracket
function isOpenBrackets(x) {
  return x === "(";
}

// Check if close bracket
function isCloseBrackets(x) {
  return x === ")";
}
