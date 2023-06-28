"use strict";

const db = firebase.firestore();
const BLOGS = document.getElementById("container");

let done = false;
let b = false;

let searchIndex = [];
let currentPost = null;
const postsRef = db.collection("posts");
let lastVisible = null; // Reference to the last visible document

if (getSettingsFromFirebase) {


  // Check the localStorange if the settings are alerdy cached and not oldern than 3 days

  let settings = localStorage.getItem("settings");
  let settingsDate = localStorage.getItem("settingsDate") ?? new Date(0);

  let date = new Date();
  let date2 = new Date(settingsDate);
  let diff = date.getTime() - date2.getTime();
  let diffDays = Math.ceil(diff / (1000 * 3600 * 24));

  if (settings != null && settings != undefined && settings != "" && settings != " " && settingsDate != null && settingsDate != undefined && settingsDate != "" && settingsDate != " " && diffDays <= 1) {

    const data = JSON.parse(settings);

    document.getElementById("blogTitle").innerText = data.title;
    document.getElementById("footer").innerText = data.footer;
    document.title = data.titleHeader;
    document.getElementById("loadingMain").style.display = "none";
    document.getElementById("navMain").innerHTML = data.nav;
    document.getElementById("ads").innerHTML = data.ads;


    let ht1 = document.createElement("div");
    ht1.innerHTML = data.html1;
    document.body.appendChild(ht1);

    // Run scripts within the new element
    const scripts = ht1.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      eval(scripts[i].innerHTML);
    }


    limit = data.postsPerLoad; // limit of the number of posts to be displayed on the page
    loadMoreText = data.loadMoreTest; // text of the "Load more" button
    backButtonText = data.backButtonText; // text of the "Back" button
    commentsText = data.commentsText; // text of the "Comments" button
    recomendedText = data.recomendedText; // text of the "Recommended posts" button
    addCommentText = data.addCommentText; // text of the "Add comment" button
    defaultCommentName = data.defaultCommentName; // default name of the user who left the comment
    defaultCommentAvatar = data.defaultCommentAvatar; // default avatar of the user who left the comment
    showSearch = data.settings.showSearch; // show the search bar
    showImage = data.settings.showImage; // show the image of the post
    showViews = data.settings.showViews; // show the number of views of the post
    showReadingTime = data.settings.showReadingTime; // show the reading time of the post
    showDate = data.settings.showDate; // show the date of the post
    showTitle = data.settings.showTitle; // show the title of the post
    showImage2 = data.settings.showImage2; // show the image of the post
    showViews2 = data.settings.showViews2; // show the number of views of the post
    showReadingTime2 = data.settings.showReadingTime2; // show the reading time of the post
    showDate2 = data.settings.showDate2; // show the date of the post
    showDateF2 = data.settings.showDateF2; // show the date of the post in full format
    showTags = data.settings.showTags; // show the tags of the post
    showComments = data.settings.showComments; // show the number of comments of the post
    allowComments = data.settings.allowComments; // allow comments on the post
    showBackButton = data.settings.showBackButton; // show the "Back" button at the end of the post
    showRecommendedPosts = data.settings.showRecommendedPosts; // show recommended posts at the end of the post
    showCopyCodeButton = data.settings.showCopyCodeButton; // show the "Copy code" button at the end of the post
    modernLook = data.settings.modernLook; // use the modern look of the blog
    customCssLink = data.customCssLink; // link to the custom CSS file

    let urlKey = extractPostKeyFromURL(location.href);

    if (urlKey != null && urlKey != undefined && urlKey != "" && urlKey != " " && urlKey != currentPost) {
      getPost(urlKey);
      document.getElementById("load-more").classList.add("hidden");
    } else {
      loadPosts();

    }

    if (showSearch == false) {
      document.getElementById("searchCont").style.display = "none";
    }

    if (modernLook == true) {
      document.getElementById("style").href = "css/modern.css";
    } else {
      if (customCssLink != null && customCssLink != undefined && customCssLink != "" && customCssLink != " ") {
        document.getElementById("style").href = customCssLink;
      } else {
        document.getElementById("style").href = "css/index.css";
      }
    }

    done = true;

  } else {
    console.log("Settings were not cached");



    const settingsRef = db.collection("settings");

    settingsRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Process each document
        const data = doc.data();

        // Cache the settings
        localStorage.setItem("settings", JSON.stringify(data));
        localStorage.setItem("settingsDate", new Date());



        document.getElementById("blogTitle").innerText = data.title;
        document.getElementById("footer").innerText = data.footer;
        document.title = data.titleHeader;
        document.getElementById("loadingMain").style.display = "none";
        document.getElementById("navMain").innerHTML = data.nav;
        document.getElementById("ads").innerHTML = data.ads;


        let ht1 = document.createElement("div");
        ht1.innerHTML = data.html1;
        document.body.appendChild(ht1);

        // Run scripts within the new element
        const scripts = ht1.getElementsByTagName("script");
        for (let i = 0; i < scripts.length; i++) {
          eval(scripts[i].innerHTML);
        }


        limit = data.postsPerLoad; // limit of the number of posts to be displayed on the page
        loadMoreText = data.loadMoreTest; // text of the "Load more" button
        backButtonText = data.backButtonText; // text of the "Back" button
        commentsText = data.commentsText; // text of the "Comments" button
        recomendedText = data.recomendedText; // text of the "Recommended posts" button
        addCommentText = data.addCommentText; // text of the "Add comment" button
        defaultCommentName = data.defaultCommentName; // default name of the user who left the comment
        defaultCommentAvatar = data.defaultCommentAvatar; // default avatar of the user who left the comment
        showSearch = data.settings.showSearch; // show the search bar
        showImage = data.settings.showImage; // show the image of the post
        showViews = data.settings.showViews; // show the number of views of the post
        showReadingTime = data.settings.showReadingTime; // show the reading time of the post
        showDate = data.settings.showDate; // show the date of the post
        showTitle = data.settings.showTitle; // show the title of the post
        showImage2 = data.settings.showImage2; // show the image of the post
        showViews2 = data.settings.showViews2; // show the number of views of the post
        showReadingTime2 = data.settings.showReadingTime2; // show the reading time of the post
        showDate2 = data.settings.showDate2; // show the date of the post
        showDateF2 = data.settings.showDateF2; // show the date of the post in full format
        showTags = data.settings.showTags; // show the tags of the post
        showComments = data.settings.showComments; // show the number of comments of the post
        allowComments = data.settings.allowComments; // allow comments on the post
        showBackButton = data.settings.showBackButton; // show the "Back" button at the end of the post
        showRecommendedPosts = data.settings.showRecommendedPosts; // show recommended posts at the end of the post
        showCopyCodeButton = data.settings.showCopyCodeButton; // show the "Copy code" button at the end of the post
        modernLook = data.settings.modernLook; // use the modern look of the blog
        customCssLink = data.customCssLink; // link to the custom CSS file

        let urlKey = extractPostKeyFromURL(location.href);

        if (urlKey != null && urlKey != undefined && urlKey != "" && urlKey != " " && urlKey != currentPost) {
          getPost(urlKey);
          document.getElementById("load-more").classList.add("hidden");
        } else {
          loadPosts();

        }

        if (showSearch == false) {
          document.getElementById("searchCont").style.display = "none";
        }

        if (modernLook == true) {
          document.getElementById("style").href = "css/modern.css";
        } else {
          if (customCssLink != null && customCssLink != undefined && customCssLink != "" && customCssLink != " ") {
            document.getElementById("style").href = customCssLink;
          }
        }


        done = true;
      });
    });

  }

} else {
  done = true;

  let urlKey = extractPostKeyFromURL(location.href);

  if (urlKey != null && urlKey != undefined && urlKey != "" && urlKey != " " && urlKey != currentPost) {
    console.log("URL key: " + urlKey);
    getPost(urlKey);
    document.getElementById("load-more").classList.add("hidden");
  } else {
    loadPosts();

  }

  document.getElementById("loadingMain").style.display = "none";

  document.getElementById("blogTitle").innerText = blogTitle;
  document.getElementById("footer").innerText = blogFooter;
  document.title = blogHeaderTitle;

  if (showSearch == false) {
    document.getElementById("searchCont").style.display = "none";
  }

}



function loadPosts() {
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("footer").classList.add("hidden");

  postsRef
    .orderBy("date", "desc")
    .limit(Number(limit))
    .get()
    .then((querySnapshot) => {
      document.getElementById("loading").classList.add("hidden");
      document.getElementById("footer").classList.remove("hidden");

      querySnapshot.forEach((doc) => {
        let key = doc.id;
        let title = doc.data().title ?? "Untitled Post";
        let description = doc.data().description ?? "No description yet.";
        let tags = doc.data().tags ?? "No tags";
        let date = doc.data().date ?? "Date error";


        let newDate = new Date().getTime();

        if (newDate < date) {
          return;
        }

        let dateF = doc.data().dateF ?? "Date error";
        let image =
          doc.data().image ||
          "./images/placeholder.svg";

        let mini =
          doc.data().titleMINI || description.split(" ").slice(0, 40).join(" ") + "...";
        // Remove all formatting from mini
        mini = removeTags(mini);

        let views = doc.data().views ?? 0;

        // Update the last visible document
        lastVisible = doc;

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
          image: image,
        });
      });

      if (querySnapshot.size < limit) {
        // All posts have been loaded
        document.getElementById("load-more").classList.add("hidden");
      } else {
        document.getElementById("load-more").classList.remove("hidden");
      }
    });
}

function loadMorePosts() {
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("footer").classList.add("hidden");

  postsRef
    .orderBy("date", "desc")
    .startAfter(lastVisible) // Start after the last visible document
    .limit(limit)
    .get()
    .then((querySnapshot) => {
      document.getElementById("loading").classList.add("hidden");
      document.getElementById("footer").classList.remove("hidden");

      querySnapshot.forEach((doc) => {

        let key = doc.id;

        let title = doc.data().title ?? "Untitled Post";
        let description = doc.data().description ?? "No description yet.";
        let tags = doc.data().tags ?? "No tags";
        let date = doc.data().date ?? "Date error";
        let dateF = doc.data().dateF ?? "Date error";
        let image =
          doc.data().image ||
          "./images/placeholder.svg";

        let mini =
          doc.data().titleMINI || description.split(" ").slice(0, 40).join(" ") + "...";
        // Remove all formatting from mini
        mini = removeTags(mini);

        let views = doc.data().views ?? 0;

        // Update the last visible document
        lastVisible = doc;

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
          image: image,
        });
      });

      if (querySnapshot.size < limit) {
        // All posts have been loaded
        document.getElementById("load-more").classList.add("hidden");
      }
    });
}

document.getElementById("load-more").addEventListener("click", loadMorePosts);


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


  let imageA = ``;
  let viewsA = ``;
  let timeA = ``;
  let dateA = ``;

  if (showImage) {
    imageA = `<a href="${image}" data-lightbox="image-1" data-title="${title}"><img class="img0" src="${image}" loading="lazy"></a>`;
  }

  if (showViews) {
    viewsA = `<span>Views: ${views}</span>`;
  }

  if (showReadingTime) {
    timeA = `<span>Time to read: ${calculateReadingTime(descriptionA)}</span>`;
  }

  if (showDate) {
    dateA = `<span>${dateF2}</span>`;
  }


  div.innerHTML = `
    <article>
      <div class="art-head">
      ${imageA}
      </div>
      
      <div class="article main">
        <h2>${titleA}</h2>
        <p>${mini}</p>
        <div class="article-footer">
          ${viewsA}
          ${timeA}
          ${dateA}
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

  button.textContent = loadMoreText;

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

  trackAnalyticsData();

  let key = post.key;
  let title = post.title;
  let description = post.description;
  let tags = post.tags;
  let date = post.date;
  let image = post.image;
  let views = post.views;

  document.title = title;

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

  let imageA = ``;
  let titleA = ``;

  let viewsA = ``;
  let dateA = ``;
  let tagsA2 = ``;
  let timetoReadA = ``;
  let dateF2A = ``;

  if (showImage2) {
    imageA = `<a href="${image}" data-lightbox="image-1" data-title="${title}"><img class="img" src="${image}" loading="lazy"></a>`;
  }

  if (showTitle) {
    titleA = `<h2>${title}</h2>`;
  }

  if (showViews2) {
    viewsA = `<span>Views: ${Number(views) + 1}</span>`;
  }

  if (showDate2) {
    dateA = `<span>${time_ago(Number(date))}</span>`;
  }

  if (showTags) {
    tagsA2 = `<div class="tags">
    ${tagsA.split(",").map(tag => `<a title="Show all posts with tag ${tag}" href="${location.origin + "?tag=" + tag}">${tag}</a>`).join("")} </div>`;
  }

  if (showReadingTime2) {
    timetoReadA = `<span>Time to read: ${calculateReadingTime(description)}</span>`;
  }

  if (showDateF2) {
    dateF2A = `<span>${dateF2}</span>`;
  }



  div.innerHTML = `
    <article class="two" style="flex-direction: column" id="${'article-' + key}">
    <div class="art">

      <div class="art-head">
      ${imageA}
      </div>

        <div class="article">
          ${titleA}
          <div class="article-footer">
              ${viewsA}
              ${dateA}
              ${tagsA2}
          </div>
          <div class="statsButtons">
          <button class="share" title="Like post" id="like-${key}" onclick="likePost('${key}')">Like</button>
          <p>${dateF2A}</p>
          <p title="Time it takes to read this post.">${timetoReadA}</p>
          <button class="share" title="Share post" onclick="openShareMenu('${key}')">Share</button>
          </div>
        </div>
    </div>
        
  </article>
    `;
  BLOGS.innerHTML = "";

  let ccc = `<p class="share" onclick="dislikePost('${key}')">Dislike</p>`;


  let t = document.getElementById("demo").value;

  let desc = document.createElement("p");
  desc.innerHTML = marked.parse(t);
  desc.setAttribute("id", "desc");

  BLOGS.appendChild(div);
  document.getElementById("article-" + key).appendChild(desc);

  hljs.highlightAll();
  window.scrollTo(0, 0);

  // adding a view

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

  if (showBackButton) {
    let backButton = document.createElement("button");
    backButton.innerHTML = backButtonText;
    backButton.setAttribute("class", "button");
    backButton.setAttribute("onclick", "back()");
    BLOGS.appendChild(backButton);
  }



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

  if (showComments) {
    let comments = document.createElement("div");
    let h3 = document.createElement("h2");
    h3.innerHTML = commentsText;

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

  }


  if (allowComments) {
    addComment(key);
  }


  if (showCopyCodeButton) {
    // Add copy buttons to code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock) => {
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.textContent = 'Copy';
      copyButton.addEventListener('click', () => copyCode(codeBlock));

      codeBlock.parentNode.insertBefore(copyButton, codeBlock.nextSibling);
    });
  }



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
      reportError(err);
    }

    // Remove the selection
    window.getSelection().removeAllRanges();
  }


  // Recomended posts

  if (showRecommendedPosts) {
    let recomended = document.createElement("div");
    recomended.setAttribute("class", "recomended");
    recomended.innerHTML = `
    <br>
      <h2>${recomendedText}</h2>
      <div class="recomended-posts" id="recomendet">
      No recomended posts
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
    document.getElementById("recomendet").innerHTML = "";

    if (recomendedPosts.length === 0) {
      document.getElementById("recomendet").innerHTML = "No recomended posts";
    } else {
      document.getElementById("recomendet").innerHTML = "";
    }


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

  // Set all code tags with .hljs class the width of max container width

  let codeTags = document.querySelectorAll("code.hljs");
  codeTags.forEach(tag => {
    // tag.style.maxWidth = "50%";
    // Break the line if text is too long with css
    tag.style.whiteSpace = "pre-wrap";
  }
  );

}

function back() {
  back2();
}

// Function to add a view to a post using firebase firestore

function addView(key) {
  let blogRef = firebase.firestore().collection("posts").doc(key);

  // Use Firestore's FieldValue.increment() to atomically increment the value
  blogRef.update({
    views: firebase.firestore.FieldValue.increment(1)
  })
    .then(function () {
      console.log("View count incremented successfully!");
    })
    .catch(function (error) {
      console.error("Error incrementing view count: ", error);
    });
}

// Function to add a comment to a post using firebase firestore

function addComment(key) {
  let div = document.createElement("div");
  div.setAttribute("class", "comment-form");
  div.innerHTML = `
    <h3>${addCommentText}</h3>
    <input type="text" id="name" placeholder="Name">
    <input type="text" id="image" placeholder="Image URL">
    <textarea id="comment" placeholder="Message" rows="5"></textarea>
    <button class="button" onclick="postComment('${key}')">Post comment</button>
  `
  BLOGS.appendChild(div);
}

// Add the comment to the database

function postComment(key) {
  let name = document.getElementById("name").value || defaultCommentName;
  let image = document.getElementById("image").value || defaultCommentAvatar;
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
    // Use Firestore's FieldValue.increment() to atomically increment the value
    blogRef.update({
      comments: firebase.firestore.FieldValue.increment(1)
    })
      .then(function () {
        console.log("View count incremented successfully!");
      })
      .catch(function (error) {
        console.error("Error incrementing view count: ", error);
      });

    toast("Your comment has been posted!")
  } catch (error) {
    toast("There was an error posting your comment. Please try again later.")
    reportError(error);
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


  // Check the localStorage if the post is cached and date is not older than 1 week

  let cachedPost = localStorage.getItem("cache-" + key);

  if (cachedPost != null) {
    cachedPost = JSON.parse(cachedPost);
    let time1 = new Date().getTime();
    if (time1 - cachedPost.time < 604800000) {
      console.log(`Post ${key} was loaded from cache`);

      // Load the post from cache

      document.getElementById("tagsC").classList.add("hidden");
      document.getElementById("loading").classList.add("hidden");
      document.getElementById("footer").classList.remove("hidden");
      document.getElementById("container").classList.remove("hidden");
      document.getElementById("backButton").classList.remove("hidden");
      viewPost(cachedPost.post);

      document.getElementById("search").value = "";
      document.getElementById("searchResults").innerHTML = "";
      toast("Post loaded in " + (new Date().getTime() - time1) + "ms", 5000);

      // Add a new entry to the browser history
      window.history.pushState({ post: key }, "", "?/post/" + key);

      setTimeout(function () {
        let postId = key;

        if (localStorage.getItem(postId) === null) {
          document.getElementById("like-" + postId).innerHTML = '<i class="far fa-heart"></i>';
        } else {
          if (localStorage.getItem(postId) === "liked") {
            document.getElementById("like-" + postId).innerHTML = '<i class="fas fa-heart"></i>';
          } else {
            document.getElementById("like-" + postId).innerHTML = '<i class="far fa-heart"></i>';
          }
        }
      }, 50);
      return true;
    }
  }


  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("container").classList.add("hidden");
  document.getElementById("footer").classList.add("hidden");
  currentPost = key;

  toast("Loading post (" + key + ")", 5000);
  let time2 = new Date().getTime();
  let blogRef = firebase.firestore().collection("posts").doc(key);
  blogRef.get().then(function (doc) {
    if (doc.exists) {
      let post = doc.data();
      post.key = key;

      // Cache the post
      let time = new Date().getTime();
      let cachedPost = {
        time: time,
        post: post
      }

      localStorage.setItem("cache-" + key, JSON.stringify(cachedPost));


      console.log(cachedPost);

      document.getElementById("tagsC").classList.add("hidden");
      viewPost(cachedPost.post);
      document.getElementById("loading").classList.add("hidden");
      document.getElementById("footer").classList.remove("hidden");
      document.getElementById("container").classList.remove("hidden");
      document.getElementById("backButton").classList.remove("hidden");

      document.getElementById("search").value = "";
      document.getElementById("searchResults").innerHTML = "";
      toast("Post loaded in " + (new Date().getTime() - time2) + "ms", 5000);

      // Add a new entry to the browser history
      window.history.pushState({ post: key }, "", "?/post/" + key);

      setTimeout(function () {
        let postId = key;

        if (localStorage.getItem(postId) === null) {
          document.getElementById("like-" + postId).innerHTML = '<i class="far fa-heart"></i>';
        } else {
          if (localStorage.getItem(postId) === "liked") {
            document.getElementById("like-" + postId).innerHTML = '<i class="fas fa-heart"></i>';
          } else {
            document.getElementById("like-" + postId).innerHTML = '<i class="far fa-heart"></i>';
          }
        }
      }, 50);
    }
  })
}


async function search2(event) {
  if (event.key === 'Enter' || event.keyCode === 13) {

    let query = String(document.getElementById("search").value).toLowerCase();

    if (query == "" || query == false || query == null || query == undefined || query == " ") {
      document.getElementById("searchResults").innerHTML = "";
      return false;
    }

    if (query.length < 2) {
      document.getElementById("searchResults").innerHTML = "";
      return false;
    }


    let data = await searchTitleInFirestore(query);

    // Display the results in the DOM
    let results = document.getElementById("searchResults");
    results.innerHTML = "";

    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const result = data[i];
        let resultDiv = document.createElement("div");
        resultDiv.setAttribute("class", "searchResult");
        resultDiv.innerHTML = `<a href="?/post/${result.id}">
        <div  class="srq">
        <img src="${result.image}" alt="${result.title}" width="30px" height="30px" loading="lazy">
        <span>
          ${result.title}
        </span>
      </div>
      </a>`;
        results.appendChild(resultDiv);
      }
    } else {
      let resultDiv = document.createElement("div");
      resultDiv.setAttribute("class", "searchResult");
      resultDiv.innerHTML = "No results found";
      results.appendChild(resultDiv);
    }

    return data;

  } else {
    // Check if the event key is Tab or Shift
    if (event.key === 'Tab' || event.keyCode === 9 || event.key === 'Shift' || event.keyCode === 16) {
      return false;
    } else {
      let results = document.getElementById("searchResults");
      results.innerHTML = "";
    }
  }

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
    getPost(state.post);
  } else {
    // Handle the default behavior (e.g., go back to the homepage)
    back();
  }
}


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

// Function to create a post item
function createPostItem(title, imageSrc, postId) {
  const template = document.getElementById('post-template');
  const postItem = template.content.cloneNode(true).querySelector('.post-item');

  // Set post title
  // const postTitle = postItem.querySelector('.post-title');
  // postTitle.textContent = title;

  // Set post image
  const postImage = postItem.querySelector('.post-image');
  postImage.style.backgroundImage = `url(${imageSrc})`;

  // Add a link to the post dynamically with JS

  let link = document.createElement('a');
  link.href = `/?/post/${postId}`;
  link.textContent = title;
  link.classList.add('post-title');

  postItem.appendChild(link);

  // Add click event listener to fetch post details
  postItem.addEventListener('click', () => {
    getPost(postId);
  });

  return postItem;
}

// Function to display posts
function displayPosts(posts) {
  const gridContainer = document.querySelector('.grid-container');

  // Clear existing content
  gridContainer.innerHTML = '';


  // Iterate over posts and create post items
  posts.forEach((post) => {
    const postItem = createPostItem(post.title, post.image, post.id);
    gridContainer.appendChild(postItem);
  });
}

// Function to show tag title
function showTagTitle(tag) {
  const tagTitle = document.querySelector('.tag-title');
  tagTitle.textContent = `Showing posts with tag "${tag}"`;
}

// Function to show no posts found message
function showNoPostsFound() {
  const postsContainer = document.querySelector('.posts-container');
  postsContainer.innerHTML = '<h2>No posts found with the specified tag.</h2>';
}

// Function to handle posts with the specified tag
function handlePostsByTag(tag) {
  // Retrieve posts from Firestore based on the tag
  const postsRef = db.collection('posts');

  // Fetch all posts and filter based on the tag
  postsRef.get()
    .then((querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        const tags = post.tags;
        post.id = doc.id;

        if (tags.includes(tag)) {
          posts.push(post);
        }
      });

      // Show tag title
      showTagTitle(tag);

      // Display posts or show no posts found message
      if (posts.length > 0) {
        displayPosts(posts);
        document.getElementById("tagsC").classList.remove("hidden");
      } else {
        showNoPostsFound();
      }
    })
    .catch((error) => {
      console.log('Error getting posts:', error);
    });
}

// Function to handle URL parameters and fetch posts by tag
function handleUrlParameters() {
  // Get the tag parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const tag = urlParams.get('tag');

  if (!tag) {
    // console.log('No tag parameter found in the URL');
    return;
  }

  // console.log('Tag parameter found in the URL:', tag);

  // Handle posts with the specified tag
  handlePostsByTag(tag);
}


function addPageView() {
  let blogRef = firebase.firestore().collection("stats").doc("1");

  // Use Firestore's FieldValue.increment() to atomically increment the value
  blogRef.update({
    visits: firebase.firestore.FieldValue.increment(1)
  })
    .then(function () {
      // console.log("View count incremented successfully!");
    })
    .catch(function (error) {
      console.error("Error incrementing view count: ", error);
    });
}

function openShareMenu(postKey) {
  const currentUrl = window.location.href;

  if (navigator.share) {

    let blogRef = firebase.firestore().collection("stats").doc("1");

    // Use Firestore's FieldValue.increment() with a negative value to decrement the view count
    blogRef.update({
      shares: firebase.firestore.FieldValue.increment(1)
    })
      .then(function () {
      })
      .catch(function (error) {
      });


    const postRef = db.collection('posts').doc(postKey);

    // Use Firestore's FieldValue.increment() to atomically increment the value
    postRef.update({
      shares: firebase.firestore.FieldValue.increment(1)
    })

      .then(function () {
        // console.log("Like count incremented successfully!");
      })
      .catch(function (error) {
        // console.error("Error incrementing like count: ", error);
      });

    navigator.share({
      url: currentUrl
    })
      .catch(error => {
        console.error('Error sharing:', error);
      });
  } else {
    console.log('Sharing not supported on this browser.');
    // Fallback behavior for browsers that do not support the Web Share API.
    // You can implement your own custom share functionality here.
  }
}







function likePost(postId) {

  // Check the localstorange if the user has alerdy liked or disliked this post

  if (localStorage.getItem(postId) === null) {
    localStorage.setItem(postId, "liked");
    document.getElementById("like-" + postId).innerHTML = '<i class="fas fa-heart"></i>';
  } else {
    if (localStorage.getItem(postId) === "liked") {
      localStorage.removeItem(postId);
      dislikePost(postId);
      document.getElementById("like-" + postId).innerHTML = '<i class="far fa-heart"></i>';
      return;
    } else {
      localStorage.removeItem(postId);
      likePost(postId);
      document.getElementById("like-" + postId).innerHTML = '<i class="fas fa-heart"></i>';
      return;
    }
  }

  const postRef = db.collection('posts').doc(postId);

  // Use Firestore's FieldValue.increment() to atomically increment the value
  postRef.update({
    likes: firebase.firestore.FieldValue.increment(1)
  })

    .then(function () {
      // console.log("Like count incremented successfully!");
    })
    .catch(function (error) {
      console.error("Error incrementing like count: ", error);
    });
}

function dislikePost(postId) {

  // Check the localstorange if the user has alerdy liked or disliked this post

  if (localStorage.getItem(postId) === null) {
    localStorage.setItem(postId, "disliked");
  } else {
    if (localStorage.getItem(postId) === "disliked") {
      localStorage.removeItem(postId);
      likePost(postId);
      return;
    } else {
      localStorage.removeItem(postId);
      dislikePost(postId);
      return;
    }
  }

  const postRef = db.collection('posts').doc(postId);

  // Use Firestore's FieldValue.increment() with a negative value to decrement the value
  postRef.update({
    likes: firebase.firestore.FieldValue.increment(-1)
  })
    .then(function () {
      // console.log("Like count decremented successfully!");
    })
    .catch(function (error) {
      console.error("Error decrementing like count: ", error);
    });
}

document.getElementById("footer").addEventListener("click", function () {

  let a = confirm("Are you sure you want to clear the page cache?");

  if (a === false) {
    return;
  }

  toast("Clearing page cache...");
  localStorage.removeItem("settings");
  localStorage.removeItem("settingData");
  location.reload();
}
);

document.addEventListener('keydown', function (event) {
  if (event.keyCode === 9 && !event.shiftKey) { // Check if the Tab key is pressed without Shift key
    var skipLink = document.querySelector('.skip-link');
    var mainContent = document.getElementById('main-content');
    if (document.activeElement !== mainContent) {
      skipLink.style.display = 'block';
      skipLink.focus(); // Set focus on the link
    } else {
      skipLink.style.display = 'none';
    }
  }
});

document.addEventListener('click', function (event) {
  var skipLink = document.querySelector('.skip-link');
  if (event.target === skipLink) {
    skipLink.style.display = 'none';
  }
});



// Call the function to handle URL parameters and fetch posts
handleUrlParameters();
addPageView();