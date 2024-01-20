// have "animation" add times all the way up
// and then have it go down

import { differenceInCalendarDays, differenceInCalendarMonths } from 'https://cdn.skypack.dev/date-fns@2.23.0';


const currDate = new Date();

const daysInMonth = {
  1: 31,
  2: (year) => (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28, // Leap year check for February
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31
}

const timeInputArr = Array.from(document.querySelectorAll('.time-input'));

[timeInputArr[0], timeInputArr[1]] = [timeInputArr[1], timeInputArr[0]];

[timeInputArr[1], timeInputArr[2]] = [timeInputArr[2], timeInputArr[1]]

const errorArr = Array.from(document.querySelectorAll('.error'));

[errorArr[0], errorArr[1]] = [errorArr[1], errorArr[0]];

[errorArr[1], errorArr[2]] = [errorArr[2], errorArr[1]];

const timeTitles = Array.from(document.querySelectorAll('.time-title'));

const timeValues = Array.from(document.querySelectorAll('.time-value'));

const enterButton = document.querySelector('.enter-button');

function validateInput(input) {
  // Remove non-numeric characters
  const inputValue = input.value.replace(/[^0-9]/g, '');
  input.value = inputValue;

  // Check if the input is a positive number
  if (inputValue !== '' && parseFloat(inputValue) < 0) {
    input.value = '';
  }
}

function convertDifference(date1) {
  const daysDifference = differenceInCalendarDays(currDate, date1);
  const monthsDifference = differenceInCalendarMonths(currDate, date1);
  // Calculate years, months, and remaining days
  const years = Math.floor(monthsDifference / 12);
  let remainingMonths = monthsDifference % 12;
  let remainingDays = daysDifference - (years * 365 + remainingMonths * 30);


   // Handle negative days
  if (remainingDays < 0) {
    remainingDays += new Date(currDate.getFullYear(), currDate.getMonth(), 0).getDate();
    remainingMonths--;
  }

  return {
    years,
    months: remainingMonths,
    days: remainingDays,
  };
}

function updateText(difference) {
  timeValues.forEach(timeVal => {
    const time = timeVal.classList[0].split('-')[0];
    timeVal.innerText = difference[time];
  })
}


function yearCheck(timeVal, timeEle, errorEle, year, month) {
  if (timeEle.placeholder === 'YYYY') {
    //first condition checks for years before current year
    //second condiiton has to use day and months if the same years 
    if ((timeVal < currDate.getFullYear()) ||
     (Number(timeVal) === currDate.getFullYear() && month <= currDate.getMonth() + 1 && currDate.getDate() >= timeInputArr[2].value 
    )) {
      year = timeVal;
    }

    else {
      errorEle.innerText = 'Must be in the past'
      timeTitles[2].classList.add('red-text');
      timeInputArr[1].classList.add('red-border');
    }
  }
  return year;
}

function monthCheck(timeVal, timeEle, errorEle, month) {
  if (timeEle.placeholder === 'MM') {
    if (timeVal < 13 && timeVal > 0) {
      month = timeVal;
    }
    else {
      errorEle.innerText = 'Must be a valid month';
      timeTitles[1].classList.add('red-text');
      timeInputArr[0].classList.add('red-border');
    }
  }
  return month;
}

function dayCheck(timeVal, timeEle, errorEle, day, month, year) {
  if (timeEle.placeholder === 'DD') {
    const dayNum = daysInMonth[month] || 31;
    let dayComparison = 0;
    if (typeof dayNum === 'function') {
      dayComparison = dayNum(year);
    }
    else {
      dayComparison = dayNum;
    }

    if (timeVal <= dayComparison) {
      day = timeVal;
    }
    else {
      errorEle.innerText = 'Must be a valid day';
      timeTitles[0].classList.add('red-text');
      timeInputArr[2].classList.add('red-border');
    }
  }
  return day;
}

timeInputArr.forEach(timeInput => {
  timeInput.addEventListener('input', () => {
    validateInput(timeInput);
  })
})

enterButton.addEventListener('click', e => {
  if (timeInputArr.every(x => x.value)) {
    let [month, day, year] = [0, 0, 0];

    for (let i = 0; i < timeInputArr.length; i++) {
      const timeEle = timeInputArr[i];
      const errorEle = errorArr[i];
      const timeVal = timeEle.value;
      
      month = monthCheck(timeVal, timeEle, errorEle, month);
      year = yearCheck(timeVal, timeEle, errorEle, year, month)
      day = dayCheck(timeVal, timeEle, errorEle, day, month, year);
    }
    console.log(month, day, year);
    const inputDate = new Date(`${month}/${day}/${year}`);
    const dateDifference = convertDifference(inputDate);
    updateText(dateDifference);
  }
})
