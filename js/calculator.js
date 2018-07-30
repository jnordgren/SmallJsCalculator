/*
Simple infix calculator using shunting yard algorithm
(C) J.Nordgren
*/

var btn0 = document.getElementById('btn0');
var btn1 = document.getElementById('btn1');

var btnClr = document.getElementById('btnClr');
var btnSum = document.getElementById('btnSum');
var btnSub = document.getElementById('btnSub');
var btnMul = document.getElementById('btnMul');
var btnDiv = document.getElementById('btnDiv');
var btnLef = document.getElementById('btnLeft');
var btnRig = document.getElementById('btnRigth');

var res = document.getElementById('res');
var q = [];
var s = [];

var num_buttons = [];
function init_num_buttons(){
  for(let i = 0; i <= 9; i++)
  {
    var clickMeButton = document.createElement('button');
    clickMeButton.id = 'btn_'+i;
    clickMeButton.innerHTML = i;
    clickMeButton.className = 'num_button';

    clickMeButton.addEventListener("click", function() {
      res.innerHTML +=this.id.split('_')[1];
    });
    document.getElementById('num_buttons').appendChild(clickMeButton);
    num_buttons.push(clickMeButton);
  }
}

init_num_buttons();


var current_op = '';

btnClr.onclick = function() {
    res.innerHTML = '';
    current_op = '';
};

btnSub.onclick = function() {
    res.innerHTML = res.innerHTML+'-';
    current_op = '-';
};
btnMul.onclick = function() {
    res.innerHTML = res.innerHTML+'*';
    current_op = '*';
};
btnDiv.onclick = function() {
    res.innerHTML = res.innerHTML+'/';
    current_op = '/';
};

btnLef.onclick = function() {
    res.innerHTML = res.innerHTML+'(';
};
btnRig.onclick = function() {
    res.innerHTML = res.innerHTML+')';
};

btnSum.onclick = function() {
    res.innerHTML = res.innerHTML+'+';
};

/*Do math.*/
btnEql.onclick = function() {
  var q = ParseExpression(res.innerHTML);
  res.innerHTML = CalcStack(q);
};

/*Setup regexp for parsing*/
const reNum = /\d+/g;
const re = /(\d+|\+|\-|\*|\/|\^|\(|\))/g;

/**
 * Check if op2 has higher precended than op2 if so returns true
 * @param {string} op1 - The first operator.
 * @param {string} op2 - The Second operator.
 */
function check_prec(op1,op2)
{
  if(op2 == '(')
  {
    return false;
  }

  if(op1 == '^')
  {
    return false;
  }

  if(op1 == '+')
  {
    switch(op2)
    {
      case '*':
      case '/':
      case '^':
        return true;
      break;
      case '-':
        return false;
      break;
      default:
        return false;
        break;
    }
  }
  else if(op1 == '*')
  {
    switch(op2)
    {
      //case '+':
      //case '-':
      //case '*':
      //case '/':
      case '^':
        return true;
      break;
      default:
        return false;
        break;
    }
  }
}
/**
 * Parses given string using shunting yard algorithm,
 * currently only supports balanced strings.
 * @param {string} input_string - String in regular infix notaiton
 */
function ParseExpression(input_string){

  var tokens = input_string.match(re);
  //var tokens = "3+4*15/2".match(re); //res.innerHTML.match(re);
  //var tokens = "3+4*2/(1−5)^2^3".match(re);
  //var tokens = "3+4*(2-1)".match(re);
  for(let o of tokens)
  {
    if(o == ' ')
    {
      continue;
    }
    if(reNum.test(o))
    {
      q.push(o);
    }
    else if(o == '(')
    {
      s.push(o);
    }
    else if(o == ')')
    {
      while(s.length > 0)
      {
        var top_op = s.pop();
        if(top_op == '(')
        {
          break;
        }
        q.push(top_op);
      }
    }
    else {
      /*Special case for first op*/
      if(s.length <= 0)
      {
        s.push(o);
        continue;
      }
      else {
        while(s.length > 0 && check_prec(o,s[s.length-1]))
        {
          let last_op = s.pop();
          q.push(last_op);
        }
        s.push(o);
      }
    }
  }

  while(s.length > 0 )
  {
    q.push(s.pop());
  }
  console.log(q);
  return q;

}
/**
 * Evaluates a stack of infix reverse polish notation array
 * @param {array} stack with operators
 */
function CalcStack(stack)
{
  var new_stack = [];

  while(stack.length > 0 )
  {
      var p = stack.shift();
      switch(p){
      case '*':
      var op1 = Number(new_stack.pop());
      var op2 = Number(new_stack.pop());
        new_stack.push(op2*op1);
      break;
      case '+':
      var op1 = Number(new_stack.pop());
      var op2 = Number(new_stack.pop());
      new_stack.push(op2+op1);
      break;
      case '-':
      var op1 = Number(new_stack.pop());
      var op2 = Number(new_stack.pop());
      new_stack.push(op2-op1);
      break;
      case '/':
      var op1 = Number(new_stack.pop());
      var op2 = Number(new_stack.pop());
      new_stack.push(op2/op1);
      break;
      default:
        new_stack.push(p);
      break;
      }
  }
  return new_stack[0];
}
