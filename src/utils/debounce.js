//this function runs a debounce for the api to hit every t time

export default function debounce (func, timeout = 500) { //timeout 500 default
  let timer; //set timer 
  return (...args) => {
    clearTimeout(timer) //clear timer that has been set
    timer = setTimeout(() => { //set new timeout with the function being passed 
      func.apply(this, args) 
    }, timeout)
  }
}
