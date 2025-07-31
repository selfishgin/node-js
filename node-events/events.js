import EventEmitter from "events";

const emitter = new EventEmitter();

emitter.on("tick", (secondsLeft) => {
  console.log(`Time left: ${secondsLeft}s\n`);
});
emitter.on("done", () => {
  console.log("Countdown complete!");
});

let count = 5;               
emitter.emit("tick", count); 

const intervalId = setInterval(() => {
  count--;

  if (count > 0) {
    emitter.emit("tick", count);
  } else {
    clearInterval(intervalId);
    emitter.emit("done");
  }
}, 1000);
