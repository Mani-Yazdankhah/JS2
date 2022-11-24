import fetch from "node-fetch"

let getMostFollowedPosts = function (userId) {
    return new Promise(function (resolve) {
        let postIdToCommentCount = new Map();
        let postIdtoPost = new Map();
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(json => {
                json.forEach(post => {
                    // Find the posts belonging to the provided user ID
                    if (post["userId"] === userId) {
                        // Set the comment count to zero for each post and keep a reference to it using a map
                        // (using a map to store the posts will prevent the need for a third request to convert
                        // post IDs to posts later on)
                        postIdToCommentCount.set(post["id"], 0);
                        postIdtoPost.set(post["id"], post);
                    };
                });
                fetch('https://jsonplaceholder.typicode.com/comments')
                    .then(res => res.json())
                    .then(json => {
                        // Count the number of comments relating to posts which were written by the provided user
                        json.forEach(comment => {
                            let postId = comment["postId"];
                            if (postIdToCommentCount.has(postId)) {
                                postIdToCommentCount.set(postId, postIdToCommentCount.get(postId) + 1);
                            };
                        });
                        // Find the maximum number of comments
                        let maxCommentCount = Math.max(...postIdToCommentCount.values());
                        // Go through all the posts written by the provided user and find all the posts which have
                        // the maximum number of comments
                        let posts = [];
                        for (const [id, count] of postIdToCommentCount) {
                            if (count == maxCommentCount) {
                                // Convert a post ID to an actual post using the map we made earlier (saves us from
                                // using a third request)
                                posts.push(postIdtoPost.get(id));
                            };
                        };
                        resolve(posts);
                    });
            });
    });

};

let getMostActiveUsers = function () {
    return new Promise(function (resolve) {
        let userIdtoPostCount = new Map();
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(json => {
                let mostActiveUserIds = new Set();
                // Go through all the posts and count how many posts each user has
                json.forEach(post => {
                    let userId = post["userId"];
                    if (userIdtoPostCount.has(userId)) {
                        userIdtoPostCount.set(userId, userIdtoPostCount.get(userId) + 1);
                    } else {
                        userIdtoPostCount.set(userId, 0);
                    };
                    // Find the maximum number of posts
                    let maxPostCount = Math.max(...userIdtoPostCount.values());
                    // Find all the users which have the maximum number of posts and store their IDs in a set
                    for (const [id, count] of userIdtoPostCount) {
                        if (count == maxPostCount) {
                            mostActiveUserIds.add(id);
                        };
                    };
                });
                fetch('https://jsonplaceholder.typicode.com/users')
                    .then(res => res.json())
                    .then(json => {
                        resolve(json.filter(user => {
                            return mostActiveUserIds.has(user["id"]);
                        }));
                    });
            });
    });
};

let getUsersWithOpenTasks = function () {
    return new Promise(function (resolve) {
        let userIds = new Set();
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(res => res.json())
            .then(json => {
                // Go through the to do list and keep track of user IDs with open tasks
                json.forEach(todo => {
                    userIds.add(todo["userId"]);
                });
                fetch('https://jsonplaceholder.typicode.com/users')
                    .then(res => res.json())
                    .then(json => {
                        // Filter out the users whose IDs match the users with open tasks
                        resolve(json.filter(user => {
                            return userIds.has(user["id"]);
                        }));
                    });
            });
    });
};

getMostFollowedPosts(1).then(posts => {
    console.log("Posts from user with the the specified ID, which have the most comments:");
    console.log(posts);
});

getMostActiveUsers().then(users => {
    console.log("Users with most posts:");
    console.log(users);
});

getUsersWithOpenTasks().then(users => {
    console.log("Users with open tasks:");
    console.log(users);
});