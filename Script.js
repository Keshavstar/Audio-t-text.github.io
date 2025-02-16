// 🔹 Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🔹 Speech Recognition Setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const transcriptionBox = document.getElementById("transcription");
const languageSelect = document.getElementById("language");

let transcriptText = "";

// 🎤 Start Recording
startBtn.addEventListener("click", () => {
    recognition.lang = languageSelect.value;
    recognition.start();
    stopBtn.disabled = false;
    startBtn.disabled = true;
});

// ⏹️ Stop Recording
stopBtn.addEventListener("click", () => {
    recognition.stop();
    stopBtn.disabled = true;
    startBtn.disabled = false;
});

// 🔹 Real-Time Transcription
recognition.onresult = (event) => {
    transcriptText = "";
    for (let i = 0; i < event.results.length; i++) {
        transcriptText += event.results[i][0].transcript + ". ";
    }
    transcriptionBox.value = transcriptText;
};

// 🔹 Save to Firebase
document.getElementById("save-btn").addEventListener("click", () => {
    db.collection("transcriptions").add({ text: transcriptText })
        .then(() => alert("Saved to Firebase!"));
});

// 🔹 Download as TXT
document.getElementById("download-txt").addEventListener("click", () => {
    const blob = new Blob([transcriptText], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transcription.txt";
    a.click();
});

// 🔹 Download as PDF
document.getElementById("download-pdf").addEventListener("click", () => {
    const docDefinition = { content: transcriptText };
    pdfMake.createPdf(docDefinition).download("transcription.pdf");
});

// 🔹 Download as DOCX
document.getElementById("download-docx").addEventListener("click", () => {
    const doc = new docx.Document();
    doc.addSection({ children: [new docx.Paragraph(transcriptText)] });
    docx.Packer.toBlob(doc).then(blob => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "transcription.docx";
        a.click();
    });
});