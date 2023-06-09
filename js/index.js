"use strict";

// Initialize Cloud Firestore
const db = firebase.firestore();
const BLOGS = document.getElementById("container");


let searchIndex = [];
let currentPost = null;

db.collection("posts").orderBy("date", "desc").get().then((querySnapshot) => {
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("footer").classList.remove("hidden");

  let urlKey = extractPostKeyFromURL(location.href);

  if (urlKey != null && urlKey != undefined && urlKey != "" && urlKey != " " && urlKey != currentPost) {
    console.log("URL key: " + urlKey);
    getPost(urlKey);
  }

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());

    let key = doc.id;

    let title = doc.data().title ?? "Untitled Post";
    let description = doc.data().description ?? "No description yet.";
    let tags = doc.data().tags ?? "No tags";
    let date = doc.data().date ?? "Date error";
    let dateF = doc.data().dateF ?? "Date error";
    let image = doc.data().image ?? "https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg";

    let mini = doc.data().titleMINI || description.split(" ").slice(0, 40).join(" ") + "...";
    // Remove all formating from mini

    mini = removeTags(mini);
    // Remove all formating from mini

    let views = doc.data().views ?? 0;

    createPost(key, title, description, tags, date, dateF, image, mini, views);

    let t = description;

    if (String(t).length > 5000) {
      t = cutTextTo500Words(t);
    }

    searchIndex.push({
      title: title,
      description: t,
      tags: tags,
      date: date,
      views: views,
      key: key,
      image: image
    });


  });
});

function cutTextTo500Words(text) {
  const words = text.trim().split(/\s+/);
  const cutWords = words.slice(0, 750);
  const cutText = cutWords.join(' ');
  return cutText;
}


function createPost(key, title, description, tags, date, dateF, image, mini, views) {
  let div = document.createElement("div");
  let att1 = document.createAttribute("id");
  let att2 = document.createAttribute("class");

  let titleA = (String(title));
  let descriptionA = (String(description).trim());
  let tagsA = replaceSpecialChars(String(tags).trim());

  // Replace line breaks with HTML entities
  descriptionA = descriptionA.replace(/\n/g, '&#10;');

  att1.value = `post-${key}`;
  att2.value = `item`;
  div.setAttributeNode(att1);
  div.setAttributeNode(att2);

  // Format unix timestamps to day month year using Intl to their respective languages
  calculateReadingTime(descriptionA);
  let dateF2 = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }).format(date);

  div.innerHTML = `
    <article>
      <div class="art-head">
        <a href="${image}" data-lightbox="image-1" data-title="${title}"><img class="img0" src="${image}" loading="lazy"></a>
      </div>
      
      <div class="article main">
        <h2>${titleA}</h2>
        <p>${mini}</p>
        <div class="article-footer">
          <span>Views: ${views}</span>
          <span>Time to read: ${calculateReadingTime(descriptionA)}</span>
          <span>${dateF2}</span>
        </div>
      </div>
    </article>
  `;

  const button = document.createElement("button");
  button.href = "#";
  button.className = "button";
  // button.setAttribute(
  //   "onclick",
  //   `viewPost("${key}", "${titleA}", "${descriptionA.replace(/"/g, '&quot;')}", "${tagsA}", "${date}", "${dateF}", "${image}", "${views}")`
  // );

  button.setAttribute(
    "onclick",
    `getPost("${key}")`
  );

  button.textContent = "Read more";

  div.querySelector(".article-footer").appendChild(button);

  BLOGS.appendChild(div);
}


function removeTags(str) {
  if (str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, "");
}

function replaceSpecialChars(str) {
  const specialChars = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
    '(': '&#40;',
    ')': '&#41;',
    '[': '&#91;',
    ']': '&#93;',
    '{': '&#123;',
    '}': '&#125;',
    '\\': '&#92;',
    '/': '&#47;'
    // Add more special characters and their HTML entities as needed
  };

  return str.replace(/[<>&"'`()\[\]{}\\\/]/g, match => specialChars[match]);
}


function escapeHTML(str) {
  const replacements = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
    '(': '&#40;',
    ')': '&#41;',
    '{': '&#123;',
    '}': '&#125;',
    '[': '&#91;',
    ']': '&#93;',
    // Add more replacements as needed
  };

  return str.replace(/[<>&"'`()\[\]{}]/g, (match) => replacements[match]);
}


function escapeString(str) {
  const specialChars = {
    '\\': '\\\\',
    '`': '\\`',
    '"': '\\"',
    "'": "\\'",
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\b': '\\b',
    '\f': '\\f',
  };

  // Replace backslashes with double backslashes
  str = str.replace(/\\/g, '\\\\');

  return str.replace(/[`"'\n\r\t\b\f]/g, (match) => specialChars[match]);
}



function time_ago(time) {

  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var time_formats = [
    [60, 'seconds', 1], // 60
    [120, '1 minute ago', '1 minute from now'], // 60*2
    [3600, 'minutes', 60], // 60*60, 60
    [7200, '1 hour ago', '1 hour from now'], // 60*60*2
    [86400, 'hours', 3600], // 60*60*24, 60*60
    [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = 'ago',
    list_choice = 1;

  if (seconds == 0) {
    return 'Just now'
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }
  var i = 0,
    format;
  while (format = time_formats[i++])
    if (seconds < format[0]) {
      if (typeof format[2] == 'string')
        return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
    }
  return time;
}


function viewPost(post) {
  // key, title, description, tags, date, dateF, image, views

  let key = post.key;
  let title = post.title;
  let description = post.description;
  let tags = post.tags;
  let date = post.date;
  let image = post.image;
  let views = post.views;

  document.getElementById("demo").value = description;

  let tagsA = String(tags);

  let div = document.createElement("div");

  let att1 = document.createAttribute("id");
  let att2 = document.createAttribute("class");


  // Format unix time stap to human readable format

  let dateF2 = new Date(Number(date)).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });


  att1.value = `post-${key}`;
  att2.value = `item`;

  div.setAttributeNode(att1);
  div.setAttributeNode(att2);

  div.innerHTML = `
    <article class="two" style="flex-direction: column" id="${'article-' + key}">
    <div class="art">

      <div class="art-head">
      <a href="${image}" data-lightbox="image-1" data-title="${title}"><img class="img" src="${image}" loading="lazy"></a>
        
      </div>

        <div class="article">
          <h2>${title}</h2>
          <div class="article-footer">
              <span>Views: ${Number(views) + 1}</span>
              <span>${time_ago(Number(date))}</span>
              <span>Time to read: ${calculateReadingTime(description)}</span>
              <span>${dateF2}</span>

              <div class="tags">
                  ${tagsA.split(",").map(tag => `<a href="${location.href + "?tag=" + tag}">${tag}</a>`).join("")}
              </div>
          </div>
        </div>
    </div>
        
  </article>
    `;
  BLOGS.innerHTML = "";


  let t = document.getElementById("demo").value;



  let desc = document.createElement("p");
  desc.innerHTML = marked.parse(t);
  desc.setAttribute("id", "desc");

  BLOGS.appendChild(div);
  document.getElementById("article-" + key).appendChild(desc);

  hljs.highlightAll();
  window.scrollTo(0, 0);

  // adding a like

  let blogRef = firebase.firestore().collection("posts").doc(key);
  blogRef.get().then(function (doc) {
    if (doc.exists) {
      let views = doc.data().views;
      views++;
      blogRef.update({
        views: views
      })
    }
  })


  // window

  // Back button

  let backButton = document.createElement("button");
  backButton.innerHTML = "Back";
  backButton.setAttribute("class", "button");
  backButton.setAttribute("onclick", "back()");
  BLOGS.appendChild(backButton);

  // // Edit button

  // let editButton = document.createElement("button");
  // editButton.innerHTML = "Edit";
  // editButton.setAttribute("class", "button");
  // editButton.setAttribute("onclick", `editPost("${key}", "${title}", "${description}", "${tags}", "${date}", "${dateF}", "${image}")`);
  // BLOGS.appendChild(editButton);

  // // Delete button

  // let deleteButton = document.createElement("button");
  // deleteButton.innerHTML = "Delete";
  // deleteButton.setAttribute("class", "button");
  // deleteButton.setAttribute("onclick", `deletePost("${key}")`);
  // BLOGS.appendChild(deleteButton);

  // Comments

  let comments = document.createElement("div");
  let h3 = document.createElement("h2");
  h3.innerHTML = "Comments";

  BLOGS.appendChild(h3);

  comments.setAttribute("id", "comments");
  BLOGS.appendChild(comments);

  // Get comments

  let commentsRef = firebase.database().ref(`comments/${key}`);
  commentsRef.on("child_added", function (snapshot) {
    let comment = snapshot.val();
    let div = document.createElement("div");
    div.setAttribute("class", "comment");
    div.innerHTML = `
      <div class="comment-head">
        <img src="${comment.image}" alt="${comment.name}" loading="lazy">
        <span>${comment.name}</span>
      </div>
      <div class="comment-body">
        <p>${removeTags(comment.comment)}</p>
      </div>
    `
    comments.appendChild(div);
  }
  );

  addComment(key);

  // Add copy buttons to code blocks
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach((codeBlock) => {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy';
    copyButton.addEventListener('click', () => copyCode(codeBlock));

    codeBlock.parentNode.insertBefore(copyButton, codeBlock.nextSibling);
  });

  // Function to copy code to the clipboard
  function copyCode(codeBlock) {
    const range = document.createRange();
    range.selectNode(codeBlock);
    window.getSelection().addRange(range);

    try {
      // Copy the selected text
      document.execCommand('copy');
      toast('Code copied to clipboard!');
    } catch (err) {
      toast('Failed to copy code:', err);
    }

    // Remove the selection
    window.getSelection().removeAllRanges();
  }


  // Recomended posts

  let recomended = document.createElement("div");
  recomended.setAttribute("class", "recomended");
  recomended.innerHTML = `
  <br>
    <h2>Recomended Posts</h2>
    <div class="recomended-posts" id="recomendet">
    </div>
  `;
  BLOGS.appendChild(recomended);

  let currentPost = {
    title: title,
    description: description,
    tags: tags,
    views: views
  };

  let recomendedPosts = findRecommendedPosts(currentPost, searchIndex, 5);

  recomendedPosts.forEach(post => {
    if (post.title === currentPost.title) return;
    let div = document.createElement("div");
    div.setAttribute("class", "recomended-post");
    div.innerHTML = `
      <h4>${post.title}</h4>
      <img src="${post.image}" alt="${post.title}" width="200px" height="auto" loading="lazy">
      <button onclick='getPost("${post.key}")'>View</button>
    `;
    document.getElementById("recomendet").appendChild(div);
  }
  );



}

function back() {
  window.location.reload();
}

// Function to add a view to a post using firebase firestore

function addView(key) {
  let blogRef = firebase.firestore().collection("posts").doc(key);
  blogRef.get().then(function (doc) {
    if (doc.exists) {
      let views = doc.data().views;
      views++;
      blogRef.update({
        views: views
      })
    }
  })
}

// Function to add a comment to a post using firebase firestore

function addComment(key) {
  let div = document.createElement("div");
  div.setAttribute("class", "comment-form");
  div.innerHTML = `
    <h3>Add comment</h3>
    <input type="text" id="name" placeholder="Name">
    <input type="text" id="image" placeholder="Image URL">
    <textarea id="comment" placeholder="Message" rows="5"></textarea>
    <button class="button" onclick="postComment('${key}')">Post comment</button>
  `
  BLOGS.appendChild(div);
}

// Add the comment to the database

function postComment(key) {
  let name = document.getElementById("name").value || "Anonymous";
  let image = document.getElementById("image").value || "https://www.w3schools.com/howto/img_avatar.png";
  let comment = String(document.getElementById("comment").value);

  comment = String(comment);
  comment = removeTags(comment);

  if (comment == "" || comment == false || comment == null || comment == undefined || comment == " ") {
    toast("You can't post an empty comment!")
    return;
  }

  let commentsRef = firebase.database().ref(`comments/${key}`);

  try {
    commentsRef.push({
      name: name,
      image: image,
      comment: comment
    });

    let blogRef = firebase.firestore().collection("stats").doc("1");
    blogRef.get().then(function (doc) {
      if (doc.exists) {
        let comments = doc.data().comments;
        comments++;
        blogRef.update({
          comments: comments
        })
      }
    })

    toast("Your comment has been posted!")
  } catch (error) {
    toast("There was an error posting your comment. Please try again later.")
  }

  document.getElementById("comment").value = "";
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

  return formattedTime;
}


// Function that takes a key of a post and returns the post

function getPost(key) {

  if (key == undefined || key == null || key == "" || key == false || key == currentPost) return false;

  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("container").classList.add("hidden");
  document.getElementById("footer").classList.add("hidden");
  currentPost = key;

  toast("Loading post (" + key + ")", 5000);
  let time = new Date().getTime();
  let blogRef = firebase.firestore().collection("posts").doc(key);
  blogRef.get().then(function (doc) {
    if (doc.exists) {
      let post = doc.data();
      post.key = key;
      viewPost(post);
      document.getElementById("loading").classList.add("hidden");
      document.getElementById("footer").classList.remove("hidden");
      document.getElementById("container").classList.remove("hidden");
      document.getElementById("backButton").classList.remove("hidden");

      document.getElementById("search").value = "";
      document.getElementById("searchResults").innerHTML = "";
      toast("Post loaded in " + (new Date().getTime() - time) + "ms", 5000);

      // Add a new entry to the browser history
      window.history.pushState({ post: key }, "", "?/post/" + key);
    }
  })
}

function search() {
  let query = String(document.getElementById("search").value).toLowerCase();
  if (query == "" || query == false || query == null || query == undefined || query == " ") {
    document.getElementById("searchResults").innerHTML = "";
    return false;
  }

  if (query.length < 2) {
    document.getElementById("searchResults").innerHTML = "";
    return false;
  }

  let dataArray = searchIndex;

  // Initialize variables for tracking the best matches
  let bestMatches = [];
  let bestMatchScore = 0;

  // Iterate over each data object in the array
  for (let i = 0; i < dataArray.length; i++) {
    const data = dataArray[i];
    const { title, description, tags } = data;
    // Calculate the relevance score for the current data object
    const score = calculateRelevanceScore(query, String(title).toLowerCase(), description, tags);

    // Update the best matches if the current score is higher or equal
    if (score >= bestMatchScore && score > 0) {
      // If the current score is higher, clear the previous best matches
      if (score > bestMatchScore) {
        bestMatches = [];
      }

      bestMatches.push(data);
      bestMatchScore = score;
    }
  }

  // If there are best matches, add them to the search results
  let results = document.getElementById("searchResults");
  results.innerHTML = "";
  console.log(bestMatches);
  if (bestMatches.length > 0) {
    // let length = bestMatches.length;

    // if (length > 5) {
    //   length = 15;
    // }

    for (let j = 0; j < bestMatches.length; j++) {
      const bestMatch = bestMatches[j];
      let result = document.createElement("div");
      result.setAttribute("class", "searchResult");
      result.innerHTML = `<div onclick="getPost('${bestMatch.key}')" class="srq">
        <img src="${bestMatch.image}" alt="${bestMatch.title}" width="30px" height="30px" loading="lazy">
        <span>
          ${bestMatch.title}
        </span>
      </div>`;
      results.appendChild(result);
    }
  } else {
    let result = document.createElement("div");
    result.setAttribute("class", "searchResult");
    result.innerHTML = "No results found";
    results.appendChild(result);
  }

  return bestMatches;
}


function calculateRelevanceScore(query, title, description, tags) {
  // Convert the query and data to lowercase for case-insensitive matching
  const lowerQuery = query.toLowerCase();
  const lowerTitle = title.toLowerCase();
  const lowerDescription = description.toLowerCase();
  const lowerTags = tags.map(tag => tag.toLowerCase());

  // Initialize the relevance score
  let score = 0;

  // Check if the query is present in the title or description
  if (lowerTitle.includes(lowerQuery)) {
    score += 2; // Increase the score if the query is found in the title
  }
  if (lowerDescription.includes(lowerQuery)) {
    score += 1; // Increase the score if the query is found in the description
  }
  // Check if the query is present in any of the tags
  if (lowerTags.includes(lowerQuery)) {
    score += 1; // Increase the score if the query is found in the tags
  }

  return score;
}


document.addEventListener('keydown', function (event) {
  if (event.key === '/' && !event.target.matches('input, textarea')) {
    // Slash key was pressed outside of input and textarea
    console.log("Slash key was pressed!");

    // Get a reference to the element you want to focus
    var element = document.getElementById('search');

    // Prevent the default behavior of the slash key
    event.preventDefault();

    // Set focus to the element
    element.focus();
    element.value = "";
  }
});


function findRecommendedPosts(currentPost, searchIndex, numRecommendations) {
  // Calculate the relevance score for each post
  const recommendedPosts = searchIndex.map((post) => {
    let score = 0;

    // Check for matching tags
    score += post.tags.filter((tag) => currentPost.tags.includes(tag)).length;

    // Check for similar titles (case-insensitive)
    if (
      post.title.toLowerCase().includes(currentPost.title.toLowerCase())
    ) {
      score += 1;
    }

    // You can add more criteria to calculate the score

    return { post, score };
  });

  // Sort the recommended posts based on their scores
  recommendedPosts.sort((a, b) => b.score - a.score);

  // Limit the number of recommended posts if specified
  if (numRecommendations) {
    recommendedPosts.splice(numRecommendations);
  }

  // Return the recommended posts
  return recommendedPosts.map((recommendedPost) => recommendedPost.post);
}

document.getElementById("scrollToTopButton").addEventListener("click", scrollToTop);

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document.getElementById("backButton").addEventListener("click", back1);

function back1() {
  removePathFromURL();
  back();
}



// Listen for the popstate event
window.addEventListener("popstate", handlePopstate);

function handlePopstate(event) {
  // Retrieve the state object
  const state = event.state;

  if (state && state.post) {
    // Load the post based on the state object
    loadPost(state.post);
  } else {
    // Handle the default behavior (e.g., go back to the homepage)
    back();
  }
}


// function extractPostKeyFromURL(url) {
//   const startIndex = url.lastIndexOf("/") + 1;
//   const endIndex = url.length;
//   const key = url.substring(startIndex, endIndex);

//   return key;
// }

function extractPostKeyFromURL(url) {
  const regex = /\/post\/([^/?#]+)/;
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    return "";
  }
}

function removePathFromURL() {
  const currentURL = window.location.href;
  const baseURL = window.location.protocol + "//" + window.location.host;
  const newState = { url: baseURL };

  window.history.replaceState(newState, "", baseURL);
}


document.body.addEventListener('click', (event) => {
  const clickedElement = event.target.closest('a');

  if (clickedElement && clickedElement.getAttribute('href').startsWith('#')) {
    event.preventDefault();
    const hash = clickedElement.getAttribute('href');

    const targetElement = document.querySelector(hash);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

function back2() {
  let url = window.location.origin
  let a = document.createElement('a');
  a.href = url;
  a.click();
}