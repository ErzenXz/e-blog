

const db = firebase.firestore();


db.collection("posts").orderBy("date", "desc").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());

        let key = doc.id;

        let title = doc.data().title ?? "Untitled Post";
        let description = doc.data().description ?? "No description yet.";
        let tags = doc.data().tags ?? "No tags";
        let date = doc.data().date ?? "Date error";
        let dateF = doc.data().dateF ?? "Date error";
        let image = doc.data().image ?? "https://media.istockphoto.com/vectors/picture-icon-vector-id931643150?k=20&m=931643150&s=612x612&w=0&h=j0OTu0faJVhzOkH4xXFnzXGNBKtsj0agu7cHMbCEIEk=";
        createPost(key, title, description, tags, date, dateF, image);
    });
});


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


function createPost(key, title, description, tags, date, dateF, image){

    let ul = document.getElementById("list");

    let li = document.createElement("li");

    let att1 = document.createAttribute("id");
    let att2 = document.createAttribute("class");
    
    let titleA = String(title);
    let descriptionA = String(description);
    let tagsA = String(tags);
    att1.value = `post-${key}`;
    att2.value = `post`;
    li.setAttributeNode(att1);
    li.setAttributeNode(att2);

    li.innerHTML = `
    <div id="post-div-${key}" class="postDiv">
        <a href="${image}" data-lightbox="image-1" data-title="${title}">
        <img src="${image}" width="125px" height="100%">
        </a>
        <p class="title">${title}</p>
        <p class="time">${time_ago(date)}</p>
        <button class="btn" onclick='viewPost("${key}", "${titleA.replace(/["']/g, "")}", "${descriptionA.replace(/["']/g, "")}", "${tagsA.replace(/["']/g, "")}", "${date}", "${dateF}", "${image}")'>Read</button>
    </div>
    `
    ul.appendChild(li);

}
