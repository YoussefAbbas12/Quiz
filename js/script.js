// تعريف المتغيرات
let jsonData = {};
let score = 0;
let questionIndex = 0;
let selectedQuestions = [];

// دالة لبدء الكويز
async function startQuiz() {
    const numQuestions = document.getElementById('numQuestions').value || 10;
    const quizContent = document.getElementById('quizContent');
    const quizActions = document.getElementById('quizActions');

    // إخفاء عناصر الزر عند بدء الاختبار
    quizContent.innerHTML = '';
    quizActions.style.display = 'none';

    try {
        // محاولة تحميل ملف JSON
        const response = await fetch('./js/Question.json');
        if (!response.ok) {
            throw new Error(`Field on load file JSON: ${response.status} ${response.statusText}`);
        }

        // قراءة البيانات وتحويلها إلى JSON
        jsonData = await response.json();
        selectedQuestions = getRandomQuestions(jsonData.questions, numQuestions);
        questionIndex = 0;
        score = 0;
        displayQuestion();
    } catch (error) {
        console.error('Field in load data :', error);
        quizContent.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

// دالة اختيار أسئلة عشوائية
function getRandomQuestions(questions, num) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// دالة لعرض السؤال الحالي
function displayQuestion() {
    const quizContent = document.getElementById('quizContent');

    if (questionIndex >= selectedQuestions.length) {
        showResult();
        return;
    }

    const question = selectedQuestions[questionIndex];

    quizContent.innerHTML = `
        <div class="question-box">
            <h2>${question.topic}</h2>
            <p>${question.question}</p>
            <div class="choices">
                ${question.choices.map((choice) => 
                    `<button class="choice-btn" onclick="checkAnswer('${choice}', '${question.correctAnswer}', this)">
                        ${choice}
                    </button>`
                ).join('')}
            </div>
            <button class="skip-btn" onclick="skipQuestion('${question.correctAnswer}')">skip this question</button>
            <button class="hint-btn" onclick="showHint('${question.help}')">?</button>
            <p id="hintMessage" class="hint-text"></p>
        </div>
    `;
}

// دالة للتحقق من الإجابة وتغيير لون الخلفية

// دالة لتخطي السؤال
function skipQuestion(correct) {
    // خصم درجة واحدة من النقاط
    if (score > 0) {
        score--;
    }
    
    // عرض الإجابة الصحيحة
    const choices = document.querySelectorAll('.choice-btn');
    choices.forEach(choice => {
        if (choice.innerText === correct) {
            choice.style.backgroundColor = 'green'; // تغيير لون الإجابة الصحيحة
        }
    });

    // الانتظار لمدة ثانيتين قبل الانتقال للسؤال التالي
    setTimeout(() => {
        questionIndex++;
        displayQuestion();
    }, 2000); // 2000 مللي ثانية = ثانيتين
}

// دالة للتحقق من الإجابة وتغيير لون الخلفية
function checkAnswer(selected, correct, element) {
    // إذا كانت الإجابة صحيحة
    if (selected === correct) {
        element.style.backgroundColor = 'green';
        score++;
    } else {
        // إذا كانت الإجابة خاطئة
        element.style.backgroundColor = 'red';

        // عرض الإجابة الصحيحة بعد تحديد الإجابة الخاطئة
        const choices = document.querySelectorAll('.choice-btn');
        choices.forEach(choice => {
            if (choice.innerText === correct) {
                choice.style.backgroundColor = 'green'; // تغيير لون الإجابة الصحيحة
            }
        });
    }

    // الانتظار لمدة ثانيتين قبل الانتقال للسؤال التالي
    setTimeout(() => {
        questionIndex++;
        displayQuestion();
    }, 2000); // 2000 مللي ثانية = ثانيتين
}



// دالة لعرض المساعدة
function showHint(hint) {
    document.getElementById('hintMessage').innerText = hint;
}

// دالة عرض النتيجة النهائية
function showResult() {
    const quizContent = document.getElementById('quizContent');
    const quizActions = document.getElementById('quizActions');

    quizContent.innerHTML = `
        <h2>You finish the Quiz Sucsuffly</h2>
        <p>Your score: ${score} / ${selectedQuestions.length}</p>
        <p>Good Jop!</p>
    `;

    // إظهار الأزرار بعد الانتهاء
    quizActions.style.display = 'block';
}

// دالة لإعادة الاختبار
function restartQuiz() {
    questionIndex = 0;
    score = 0;
    displayQuestion();
}

// دالة لبدء اختبار جديد
function startNewQuiz() {
    startQuiz();
}

// دالة لتحديث عرض عدد الأسئلة المختار
function updateQuestionCount(value) {
    document.getElementById('questionCount').innerText = value;
}
