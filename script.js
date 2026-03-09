let questions=[];
let index=0;
let score=0;
let timer;
let timeLeft=15;

const clickSound = new Audio("../mp3/button-press-386165.mp3");
const winSound = new Audio("../mp3/victory-chime-366449.mp3");
const loseSound = new Audio("../mp3/game-over-417465.mp3");

function startQuiz(){
clickSound.play();
document.getElementById("startScreen").classList.add("hide");
document.getElementById("categoryScreen").classList.remove("hide");
}

function selectCategory(cat){
selectedCategory=cat;
document.getElementById("categoryScreen").classList.add("hide");
document.getElementById("quizScreen").classList.remove("hide");
fetchQuestions();
}


async function fetchQuestions(){
let res=await fetch(`https://opentdb.com/api.php?amount=5&category=${selectedCategory}&type=multiple`);
let data=await res.json();
questions=data.results;
index=0;
score=0;
document.getElementById("score").innerText=score;
showQuestion();
}

function showQuestion(){
resetTimer();
updateProgress();
document.getElementById("reaction").innerHTML="";

let q=questions[index];
document.getElementById("question").innerHTML=q.question;

let opts=[...q.incorrect_answers,q.correct_answer].sort(()=>Math.random()-0.5);
let div=document.getElementById("options");
div.innerHTML="";

opts.forEach(o=>{
let btn=document.createElement("button");
btn.className="option-btn";
btn.innerHTML=o;
btn.onclick=()=>checkAnswer(btn,o,q.correct_answer);
div.appendChild(btn);
});
}

function checkAnswer(btn,selected,correct){
clearInterval(timer);
document.querySelectorAll(".option-btn").forEach(b=>b.disabled=true);

if(selected===correct){
btn.classList.add("correct");
score++;
document.getElementById("score").innerText=score;
document.getElementById("reaction").innerHTML="🎉 Correct!";
winSound.play();
}else{
btn.classList.add("wrong");
document.getElementById("reaction").innerHTML="❌ Wrong!";
loseSound.play();
}

setTimeout(nextQuestion,1500);
}

function nextQuestion(){
index++;
if(index>=questions.length) endQuiz();
else showQuestion();
}

function endQuiz(){
clearInterval(timer);

document.getElementById("quizScreen").classList.add("hide");
document.getElementById("resultScreen").classList.remove("hide");

let text=document.getElementById("finalText");
let img=document.getElementById("resultImg");

if(score>=3){
text.innerText="🎉 YOU WIN! Score: "+score+"/5";
img.src="https://media.tenor.com/ebP-D3VZ6tEAAAAC/winner-cup.gif";
winSound.play();
}else{
text.innerText="😢 YOU LOST! Score: "+score+"/5";
img.src="https://media.tenor.com/V2qA6U51c1MAAAAC/game-over-lose.gif";
loseSound.play();
}
}

function resetTimer(){
clearInterval(timer);
timeLeft=15;
document.getElementById("time").innerText=timeLeft;

timer=setInterval(()=>{
timeLeft--;
document.getElementById("time").innerText=timeLeft;
if(timeLeft<=0){clearInterval(timer);nextQuestion();}
},1000);
}

function updateProgress(){
let percent=((index+1)/5)*100;
document.getElementById("progressBar").style.width=percent+"%";
}






