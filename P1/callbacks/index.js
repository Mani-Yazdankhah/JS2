const request = require('request');

let getMostFollowedPosts = function (userId) {
    let postIdToCommentCount = new Map();
    let postIdtoPost = new Map();
    request('https://jsonplaceholder.typicode.com/posts', { json: true }, (err, res, body) => {
        body.forEach(post => {
            // Find the posts belonging to the provided user ID
            if (post["userId"] === userId) {
                // Set the comment count to zero for each post and keep a reference to it using a map
                // (using a map to store the posts will prevent the need for a third request to convert
                // post IDs to posts later on)
                postIdToCommentCount.set(post["id"], 0);
                postIdtoPost.set(post["id"], post);
            };
        });
        request('https://jsonplaceholder.typicode.com/comments', { json: true }, (err, res, body) => {
            // Count the number of comments relating to posts which were written by the provided user
            body.forEach(comment => {
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
            console.log(`Posts from user ID ${userId} with the most comments:`);
            console.log(posts);
        });
    });
};

let getMostActiveUsers = function () {
    let userIdtoPostCount = new Map();
    request('https://jsonplaceholder.typicode.com/posts', { json: true }, (err, res, body) => {
        let mostActiveUserIds = new Set();
        // Go through all the posts and count how many posts each user has
        body.forEach(post => {
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
        request('https://jsonplaceholder.typicode.com/users', { json: true }, (err, res, body) => {
            console.log("Users with most posts:");
            // Filter out the users whose IDs match the users with maximum number of posts
            console.log(body.filter(user => {
                return mostActiveUserIds.has(user["id"]);
            }));
        });
    });
};

let getUsersWithOpenTasks = function () {
    let userIds = new Set();
    request('https://jsonplaceholder.typicode.com/todos', { json: true }, (err, res, body) => {
        // Go through the to do list and keep track of user IDs with open tasks
        body.forEach(todo => {
            userIds.add(todo["userId"]);
        });
        request('https://jsonplaceholder.typicode.com/users', { json: true }, (err, res, body) => {
            console.log("Users with open tasks:");
            // Filter out the users whose IDs match the users with open tasks
            console.log(body.filter(user => {
                return userIds.has(user["id"]);
            }));
        });
    });
};

getMostFollowedPosts(1);
getMostActiveUsers();
getUsersWithOpenTasks();