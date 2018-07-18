function ETA (str1, num1) { //13:00, 8
  let h = parseInt(str1.substr(0,2)); //13
  let result = h + num1; //21
  //let ap = str1.slice(-2); //
  if (result >= 24 ) {
    result -= 24;
    str1 += ' Next day';
  } else {
    str1 += ' Today';
  }
  let rString = result.toString (); // '21'
  if (rString.length === 1) {
    rString = '0' + rString;
  }
  str1 = str1.replace (str1.substr (0,2), rString); //'21:00'
  return str1;
}

module.exports = ETA;
