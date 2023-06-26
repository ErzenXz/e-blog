// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAM5RxaJWdcImoTxEVKzshUUD8Gvvdwnt4",
    authDomain: "blog-46883.firebaseapp.com",
    databaseURL: "https://blog-46883-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "blog-46883",
    storageBucket: "blog-46883.appspot.com",
    messagingSenderId: "604907905454",
    appId: "1:604907905454:web:f5fff79b410cca9bcd683f",
    measurementId: "G-Z4CT90CNL8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const contactForm = document.getElementById("contactForm");
const responseMessage = document.getElementById("responseMessage");

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("nameInput").value;
    const email = document.getElementById("emailInput").value;
    const message = document.getElementById("messageInput").value;

    // Save contact form data to Firestore
    db.collection("contacts").add({
        name: name,
        email: email,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(() => {
            responseMessage.innerText = "Message sent successfully!";
            contactForm.reset();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            responseMessage.innerText = "An error occurred. Please try again.";
        });
});
