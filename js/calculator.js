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
var btnVar = document.getElementById('btnVar');

var res = document.getElementById('res');


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


btnClr.onclick = function() {
    res.innerHTML = '';

};

btnSub.onclick = function() {
    res.innerHTML = res.innerHTML+'-';

};
btnMul.onclick = function() {
    res.innerHTML = res.innerHTML+'*';

};
btnDiv.onclick = function() {
    res.innerHTML = res.innerHTML+'/';
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

btnVar.onclick = function(){
  res.innerHTML = res.innerHTML+ 'x';
};

/*Do math.*/
btnEql.onclick = function() {
  var q = ParseExpression(res.innerHTML);
  console.log(q);
  if(q.includes('x'))
  {
    drawPlot(q,CalcStackX,100);
  }
  else{
    res.innerHTML = CalcStack(q);
  }

};

/*Setup regexp for parsing*/
const reNum = /\d+/;
const re = /(\d+|\+|\-|\*|\/|\^|\(|\)|x)/g;

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
  var q = [];
  var s = [];

  var tokens = input_string.match(re);

  for(var o of tokens)
  {

    if(o == ' ')
    {
      continue;
    }
    if(reNum.test(o) || o == 'x')
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

/**
 * Evaluates a stack of infix reverse polish notation array using a vale for variable
 * @param {array} p with operators
 * @param {Number} xval the nr to set variable to.
 */
function CalcStackX(p,xval)
{
  console.log(" i got stack"+p + "xval:"+xval);
  stack = p.slice(0);
  for(let i = 0; i < stack.length; i++)
  {
    if(stack[i] == 'x')
    {
      stack[i] = Number(xval);
    }
  }
  console.log(" i got stack"+stack);


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
      console.log("Res will be " + op2 + " / " + op1);
      if(op1 !=0)
      {
        new_stack.push(op2/op1);
      }
      else{
        return 0;
      }
      break;
      // case 'x':
      //   new_stack.push(Number(xval));
      default:
        new_stack.push(p);
      break;
      }
  }

    return new_stack[0];
}

function drawPlot(stack,fun,n){
  /* implementation mainy from: https://gist.github.com/benjchristensen/2579599*/

  // define dimensions of graph
  var m = [80, 80, 80, 80]; // margins
  var w = 1000 - m[1] - m[3]; // width
  var h = 400 - m[0] - m[2]; // height

  var data = Array.from(Array(n).keys());
  var x = d3.scaleLinear().domain([0, data.length]).range([0, w]);
  var y = d3.scaleLinear().domain([0, 10]).range([h, 0]);

  var line = d3.line()
    // set x
    .x(function(d,i) {
      return x(i);
    })
    .y(function(d) {
      // verbose logging to show what's actually being done
      let val = fun(stack,d);
      console.log('Plotting Y value for data point: ' + d + ' to be at: ' + val + " using our yScale.");
      // return the Y coordinate where we want to plot this datapoint
      return val;
    })
    // Add an SVG element with the desired dimensions and margin.
    var graph = d3.select("#graph").append("svg:svg")
          .attr("width", w + m[1] + m[3])
          .attr("height", h + m[0] + m[2])
        .append("svg:g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    var xAxis = d3.axisBottom().scale(x);

    graph.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + h + ")")
          .call(xAxis);

    var yAxis = d3.axisLeft().scale(y);

    /*TODO FIx so that same plot is reused.*/
    graph.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(-25,0)")
          .call(yAxis);

      graph.append("svg:path").attr("d", line(data));
}
