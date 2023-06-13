const paginationState = {
    currentPage: 0,
    totalPages: 0,
    visiblePages: 5,
};

function createPaginationLink(pageNumber) {
    const { currentPage, totalPages, visiblePages } = paginationState;
    const pagination = document.getElementById("pagination");

    if (pageNumber === currentPage) {
        const activeLink = document.createElement("span");
        activeLink.classList.add("page-link", "active");
        activeLink.textContent = pageNumber;
        pagination.appendChild(activeLink);
    } else {
        const link = document.createElement("a");
        link.href = "javascript:void(0);";
        link.classList.add("page-link");
        link.textContent = pageNumber;
        link.addEventListener("click", () => {
            if (pageNumber !== currentPage) {
                loadPosts(pageNumber);
                updateActiveLink(pageNumber);
            }
        });
        pagination.appendChild(link);
    }

    if (pageNumber === visiblePages && currentPage < totalPages) {
        const ellipsis = document.createElement("span");
        ellipsis.classList.add("ellipsis");
        ellipsis.textContent = "...";
        pagination.appendChild(ellipsis);
    }
}

function initializePagination(totalPages) {
    const { visiblePages } = paginationState;
    paginationState.totalPages = totalPages;
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const startPage = Math.max(1, paginationState.currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (startPage > 1) {
        createFirstPageLink();
    }

    for (let i = startPage; i <= endPage; i++) {
        createPaginationLink(i);
    }

    if (endPage < totalPages) {
        createNextPageLink();
    }
}

function createFirstPageLink() {
    const { currentPage } = paginationState;
    const pagination = document.getElementById("pagination");
    const firstLink = document.createElement("a");
    firstLink.href = "javascript:void(0);";
    firstLink.classList.add("page-link");
    firstLink.textContent = "1";
    firstLink.addEventListener("click", () => {
        if (currentPage !== 1) {
            loadPosts(1);
            updateActiveLink(1);
        }
    });
    pagination.appendChild(firstLink);

    const ellipsis = document.createElement("span");
    ellipsis.classList.add("ellipsis");
    ellipsis.textContent = "...";
    pagination.appendChild(ellipsis);
}

function createNextPageLink() {
    const { currentPage, totalPages } = paginationState;
    const pagination = document.getElementById("pagination");
    const nextPage = currentPage + 1;

    const ellipsis = document.createElement("span");
    ellipsis.classList.add("ellipsis");
    ellipsis.textContent = "...";
    pagination.appendChild(ellipsis);

    const nextLink = document.createElement("a");
    nextLink.href = "javascript:void(0);";
    nextLink.classList.add("page-link");
    nextLink.textContent = "Next";
    nextLink.addEventListener("click", () => {
        if (currentPage < totalPages) {
            loadPosts(nextPage);
            updateActiveLink(nextPage);
        }
    });
    pagination.appendChild(nextLink);
}

function updateActiveLink(activePage) {
    const links = document.querySelectorAll("#pagination .page-link");
    links.forEach((link) => {
        link.classList.remove("active");
        if (parseInt(link.textContent) === activePage) {
            link.classList.add("active");
        }
    });
    paginationState.currentPage = activePage;
}

// Get the total number of posts from Firestore and calculate the total number of pages
db.collection("posts")
    .get()
    .then((querySnapshot) => {
        const totalPosts = querySnapshot.size;
        const totalPages = Math.ceil(totalPosts / postsPerPage);

        initializePagination(totalPages);
        updateActiveLink(1); // Set the first page as active

        // Call loadPosts after the pagination links have been created
        Promise.resolve().then(() => {
            loadPosts(1); // Load the first page initially
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });


function clearPostsContainer() {
    const postsContainer = document.getElementById("container");
    postsContainer.innerHTML = "";
}


// function loadPosts(page) {
//   // Clear the posts container
//   clearPostsContainer();

//   // Calculate the starting point for the current page
//   let query = db.collection("posts").orderBy("date", "desc");

//   if (page > 1) {
//     // Retrieve the lastVisibleDoc for the previous page
//     const previousPage = page - 1;
//     if (paginationState[previousPage] && paginationState[previousPage].lastVisibleDoc) {
//       query = query.startAfter(paginationState[previousPage].lastVisibleDoc);
//     } else {
//       // Last visible doc not available, fetch the previous page and populate paginationState
//       if (previousPage === 1) {
//         // If previous page is the first page, simply load it without startAfter
//         loadPosts(previousPage);
//         return;
//       } else {
//         console.log("Fetching previous page:", previousPage);
//         toast("Loading page " + previousPage + "...");
//         loadPosts(previousPage).then(() => {
//           // Retry loading current page once previous page is loaded
//           loadPosts(page);
//         })
//           .catch((error) => {
//             console.error("Error loading previous page:", previousPage, error);
//           });
//         return;
//       }
//     }
//   }

//   // Query Firestore to fetch posts for the current page
//   return query
//     .limit(postsPerPage)
//     .get()
//     .then((querySnapshot) => {
//       let lastVisibleDoc = null;
//       querySnapshot.forEach((doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         let key = doc.id;

//         let title = doc.data().title ?? "Untitled Post";
//         let description = doc.data().description ?? "No description yet.";
//         let tags = doc.data().tags ?? "No tags";
//         let date = doc.data().date ?? "Date error";
//         let dateF = doc.data().dateF ?? "Date error";
//         let image =
//           doc.data().image ||
//           "https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg";

//         let mini =
//           doc.data().titleMINI || description.split(" ").slice(0, 40).join(" ") + "...";
//         // Remove all formatting from mini
//         mini = removeTags(mini);

//         let views = doc.data().views ?? 0;

//         createPost(key, title, description, tags, date, dateF, image, mini, views);

//         let t = description;
//         if (String(t).length > 5000) {
//           t = cutTextTo500Words(t);
//         }

//         searchIndex.push({
//           title: title,
//           description: t,
//           tags: tags,
//           date: date,
//           views: views,
//           key: key,
//           image: image,
//         });

//         lastVisibleDoc = doc; // Update lastVisibleDoc
//       });

//       // Store the lastVisibleDoc for the current page
//       paginationState[page] = {
//         lastVisibleDoc: lastVisibleDoc,
//       };

//       document.getElementById("loading").classList.add("hidden");
//     })
//     .catch((error) => {
//       console.log("Error getting documents: ", error);
//       throw error; // Propagate the error to the caller
//     });
// }

function loadPosts(page) {
    // Clear the posts container
    clearPostsContainer();

    let time = new Date().getTime();

    // Calculate the starting point for the current page
    let query = db.collection("posts").orderBy("date", "desc");

    if (page > 1) {
        // Retrieve the lastVisibleDoc for the previous page
        const previousPage = page - 1;
        if (paginationState[previousPage] && paginationState[previousPage].lastVisibleDoc) {
            query = query.startAfter(paginationState[previousPage].lastVisibleDoc);
        } else {
            // Last visible doc not available, fetch the previous page and populate paginationState
            if (previousPage === 1) {
                // If previous page is the first page, simply load it without startAfter
                toast("Loading page " + previousPage + "...");
                return loadPosts(previousPage).then(() => {
                    return loadPosts(page);
                });
            } else {
                toast("Loading page " + previousPage + "...");
                console.log("Fetching previous page:", previousPage);


                return loadPosts(previousPage).then(() => {
                    // Retry loading current page once previous page is loaded
                    return loadPosts(page);
                });
            }
        }
    }

    // Query Firestore to fetch posts for the current page
    return query
        .limit(postsPerPage)
        .get()
        .then((querySnapshot) => {
            let lastVisibleDoc = null;
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                let key = doc.id;

                let title = doc.data().title ?? "Untitled Post";
                let description = doc.data().description ?? "No description yet.";
                let tags = doc.data().tags ?? "No tags";
                let date = doc.data().date ?? "Date error";
                let dateF = doc.data().dateF ?? "Date error";
                let image =
                    doc.data().image ||
                    "https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg";

                let mini =
                    doc.data().titleMINI || description.split(" ").slice(0, 40).join(" ") + "...";
                // Remove all formatting from mini
                mini = removeTags(mini);

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
                    image: image,
                });


                lastVisibleDoc = doc; // Update lastVisibleDoc
            });

            // Store the lastVisibleDoc for the current page
            paginationState[page] = {
                lastVisibleDoc: lastVisibleDoc,
            };

            toast("Page " + page + " loaded in " + (new Date().getTime() - time) + "ms");

            document.getElementById("loading").classList.add("hidden");
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
            throw error; // Propagate the error to the caller
        });
}



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