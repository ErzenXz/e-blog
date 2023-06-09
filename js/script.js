
// Initialize Cloud Firestore
const db = firebase.firestore();

// Adding a post

function addPost() {
  toast("Adding a post");
  let title = document.getElementById("title").value;
  let titleMINI = document.getElementById("miniTitle").value;
  let post = document.getElementById("post").value;
  let tags = document.getElementById("tags").value;
  let img = document.getElementById("image").value;

  if (title == "" || post == "" || tags == "" || img == "") {
    toast("Please fill all the fields!");
    return false
  };

  document.getElementById("loading").classList.remove("hidden");

  var words = tags.split(" ");
  for (var i = 0; i < words.length - 1; i++) {
    words[i] += " ";
  }
  console.log(words);
  let date = new Date();
  let tagsA = words;

  if (img == "") {
    img = "https://media.istockphoto.com/vectors/picture-icon-vector-id931643150?k=20&m=931643150&s=612x612&w=0&h=j0OTu0faJVhzOkH4xXFnzXGNBKtsj0agu7cHMbCEIEk=";
  }

  console.log("Adding a post 2");

  db.collection("posts").add({
    title,
    titleMINI,
    description: post,
    tags: tagsA,
    dateF: date,
    date: date.getTime(),
    image: img,
    likes: 0,
    views: 0,
    shares: 0
  })
    .then((docRef) => {
      document.getElementById("loading").classList.add("hidden");
      document.getElementById("title").value = "";
      document.getElementById("post").innerHTML = "";
      document.getElementById("tags").value = "";
      document.getElementById("miniTitle").innerText = "";
      toast("Document written with ID: ", docRef.id);
      let blogRef = firebase.firestore().collection("stats").doc("1");
      blogRef.get().then(function (doc) {
        if (doc.exists) {
          let posts = doc.data().posts;
          posts++;
          blogRef.update({
            posts: posts
          })
        }
      })
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      toast("An error has happend!  : " + error);
    });

}


function likePost(user, key) {
  if (user == "" || key == "") return false;

  let post = db.collection("posts").doc(key);

  post.update({
    likes: firebase.firestore.FieldValue.arrayUnion(String(user))
  });
}

function dislikePost(user, key) {
  if (user == "" || key == "") return false;

  let post = db.collection("posts").doc(key);

  post.update({
    likes: firebase.firestore.FieldValue.arrayRemove(String(user))
  });
}



function countWords(str) {
  // Remove leading and trailing whitespaces
  str = str.trim();

  // If the string is empty, return 0
  if (str === '') {
    return 0;
  }

  // Split the string into an array of words using whitespace as the delimiter
  const words = str.split(/\s+/);

  // Return the count of words
  return words.length;
}


function formatReadingTime(minutes) {
  if (minutes < 1) {
    return "Less than a minute";
  } else if (minutes === 1) {
    return "1 minute";
  } else if (minutes < 60) {
    return minutes + " minutes";
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    let formattedTime = `${hours} hour${hours > 1 ? "s" : ""}`;

    if (remainingMinutes > 0) {
      formattedTime += ` ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
    }

    return formattedTime;
  }
}

function calculateReadingTime(text) {
  // Average reading speed in words per minute
  const readingSpeed = 200;

  // Remove leading and trailing white spaces
  text = text.trim();

  // Split the string into an array of words
  const words = text.split(/\s+/);

  // Calculate the number of words
  const wordCount = words.length;

  // Calculate the reading time in minutes
  const readingTime = Math.ceil(wordCount / readingSpeed);

  // Format the reading time
  const formattedTime = formatReadingTime(readingTime);

  console.log(formattedTime);
  return formattedTime;
}


// Get a reference to the textarea element
const textarea = document.getElementById('post');

// Add an event listener for the 'input' event
textarea.addEventListener('input', handleTextareaInput);

// Event handler function
function handleTextareaInput(event) {
  // Get the value of the textarea
  const text = event.target.value;

  // Perform any desired actions with the text
  document.getElementById("time").innerHTML = "Time to read: " + calculateReadingTime(text);
  document.getElementById("words").innerHTML = countWords(text) + " words";
}

function toast(message, duration = 4500, delay = 0) {

  // Check for existing toast class elements

  const existingToast = document.querySelector('.toast');

  if (existingToast) {
    existingToast.remove();
  }


  const toastContainer = document.createElement('div');
  toastContainer.style.position = 'fixed';
  toastContainer.style.top = '1rem';
  toastContainer.style.right = '1rem';
  toastContainer.style.display = 'flex';
  toastContainer.style.alignItems = 'center';
  toastContainer.style.justifyContent = 'center';
  toastContainer.style.width = '16rem';
  toastContainer.style.padding = '1rem';
  toastContainer.style.backgroundColor = '#1F2937';
  toastContainer.style.color = '#FFF';
  toastContainer.style.borderRadius = '0.25rem';
  toastContainer.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.25)';
  toastContainer.style.overflow = 'auto';
  toastContainer.style.maxHeight = '500px';
  toastContainer.style.minWidth = '200px';
  toastContainer.style.width = 'fit-content';
  toastContainer.style.zIndex = '9999';
  toastContainer.setAttribute('class', 'toast');

  const toastText = document.createElement('span');
  toastText.style.whiteSpace = 'nowrap';
  toastText.style.overflow = 'hidden';
  toastText.style.textOverflow = 'ellipsis';
  toastText.textContent = message;
  toastContainer.appendChild(toastText);

  document.body.appendChild(toastContainer);

  setTimeout(() => {
    toastContainer.style.opacity = '0';
    setTimeout(() => {
      toastContainer.remove();
    }, 300);
  }, duration + delay);

  toast.dismiss = function () {
    toastContainer.style.opacity = '0';
    setTimeout(() => {
      toastContainer.remove();
    }, 300);
  };
}