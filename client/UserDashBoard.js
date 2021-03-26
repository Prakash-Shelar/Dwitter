
// ************************************* Use Dash-Board *************************************
// User Profile
const username = document.getElementById("username");
const UserFollowers = document.getElementById("UserFollowers");
const UserFollowing = document.getElementById("UserFollowing");
const UserCreatedON = document.getElementById("UserCreatedON");

// Searched User
const Searchedusername = document.getElementById("Searchedusername");
const SearchedFollowers = document.getElementById("SearchedFollowers");
const SearchedFollowing = document.getElementById("SearchedFollowing");
const SearchedCreatedON = document.getElementById("SearchedCreatedON");
const SearchedStatus = document.getElementById("SearchedStatus");

const searchUserInput = document.getElementById("searchUserInput");
const SearchButton = document.getElementById("SearchButton");
// Follow Seaarched User
const FollowButton = document.getElementById("FollowButton");
const SearchedUserDiv = document.getElementById("SearchedUserDiv");


const logoutButton = document.getElementById("logoutButton");
var ul = document.querySelector("ul");

// Tweet Input
const tweetInput = document.getElementById("tweetInput");
const tagInput = document.getElementById("tagInput");
const DweetButton = document.getElementById("DweetButton");

// Tweet Update
const DweetId = document.getElementById("DweetId");
const postTime = document.getElementById("postTime");
const userOfPost = document.getElementById("userOfPost");
const postContent = document.getElementById("postContent");

const LikeButton = document.getElementById("LikeButton");
const ReTweetButton = document.getElementById("ReTweetButton");

// Search Tag
const searchTagInput = document.getElementById("searchTagInput");
const TagSearchButton = document.getElementById("TagSearchButton");
const postTag = document.getElementById("postTag");
const searchList = document.getElementById("searchList");


// Show User Profile Details 
const fetchUserByAddress = () => {
    console.log(currentAccount);
    DwitterContract.methods.getUserByAddress().call({
        from: currentAccount,
        gas: "6000000",
        gasPrice: "1000000"
    }).then(
        (data)=>{
            console.log(data);
            username.innerHTML = data[0];
            UserFollowers.innerHTML = data[1];
            UserFollowing.innerHTML = data[2];
    
            var ts = new Date(data[3]*1000);
                    
                    var t = ts.getDate()+
                    "/"+(ts.getMonth()+1)+
                    "/"+ts.getFullYear()+
                    " "+ts.getHours()+
                    ":"+ts.getMinutes()+
                    ":"+ts.getSeconds();
    
            UserCreatedON.innerHTML = t;
        }
    )
}

setTimeout(
    ()=> {
        fetchUserByAddress();
    }, 1000
)
// newTweet(postCount, users[msg.sender].userName, _content, _tag);

DwitterContract.events.newTweet().on("data", (event)=>{
    let newTweet = event.returnValues;
    console.log(newTweet);

    DweetId.innerHTML = newTweet[0];
    // postTime.innerHTML = newTweet[0];
    userOfPost.innerHTML = newTweet[1];
    postContent.innerHTML = newTweet[2];
    postTag.innerHTML = newTweet[3];



})

// Contract Event Subscribe
DwitterContract.events.userSignIN().on("data", (event)=>{
    let UserDetails = event.returnValues;
    console.log(UserDetails);
}
)

// DOM EVENT LISTENERS
const handleSearchInputChange = (event) => {
    userSearchInput = event.target.value;
    console.log(userSearchInput);
}

var searchedUser;
const handleSearch = () => {
    DwitterContract.methods.searchUser(userSearchInput).call({
        from: currentAccount,
        gas: "6000000",
        gasPrice: "1000000"
    })
    .then(
        (data)=>{
            SearchedUserDiv.style.visibility = "visible";
            searchedUser = data[0];
            Searchedusername.innerHTML = data[0];
            SearchedFollowers.innerHTML = data[1];
            SearchedFollowing.innerHTML = data[2];

            var ts = new Date(data[3]*1000);
                    
                    var t = ts.getDate()+
                    "/"+(ts.getMonth()+1)+
                    "/"+ts.getFullYear()+
                    " "+ts.getHours()+
                    ":"+ts.getMinutes()+
                    ":"+ts.getSeconds();

            SearchedCreatedON.innerHTML = t;
            SearchedStatus.innerHTML = data[4];
            
            if(DwitterContract.methods.alreadyFollowed(searchedUser)){
                // FollowButton.textContent = "Unfollow";
                FollowButton.style.visibility = "visible";
            }
            else{
                FollowButton.style.visibility = "visible";
            }
        }
    )
}

const handleFollowButton = () => {
    DwitterContract.methods.followUser(searchedUser).send({
        from: currentAccount,
        gas: "3000000",
        gasPrice: "1000000"
    })
    .on("error",
            function (error, receipt) {
                alert(error, receipt);
            }
    )
    FollowButton.textContent = "Unfollow";
}
const handleLogout = () => {
    DwitterContract.methods.makeSignOut().send({
        from: currentAccount,
        gas: "3000000",
        gasPrice: "1000000"
    })
    .on("error",
            function (error, receipt) {
                console.log({error, receipt});
            }
    )
    .on(
        window.location.replace("home.html")
    )
}

// Post
let _tweetInput;
const handletweetInput = (event)=>{
    _tweetInput = event.target.value;
}

let _tagInput;
const handletagInput = (event) =>{
    _tagInput = event.target.value;
}

const handleDweetButton = () =>{
    DwitterContract.methods.tweet(_tweetInput, _tagInput).send({
        from:currentAccount,
        gas: "3000000",
        gasPrice: "1000000"
    })
    .on("error",
        function (error, receipt) {
            console.log({error, receipt});
        }
    )
}

// Search Tag Post
let TagInput;
const handlesearchTagInput = (event) =>{
    TagInput = event.target.value;
}

const handleTagSearchButton = () =>{
    DwitterContract.methods.getTagPost(TagInput).call({
        from: currentAccount
    })
    .then(
        (data)=>{
            searchList.style.visibility = "visible";
            
            for (var i = 0; i<data.length; i++){
                var li = document.createElement('li');

                const searchedid = data[i][0];
                const searchedcontent = data[i][1];
                const searchResult = searchedid + "  " + "|" + " " + searchedcontent;

                li.appendChild(document.createTextNode(searchResult));
                ul.appendChild(li);
            }
        }
    )
}



// Create Event Listeners
// Search User
searchUserInput.addEventListener("change", handleSearchInputChange);
SearchButton.addEventListener("click", handleSearch);
// Follow Button
FollowButton.addEventListener("click", handleFollowButton);
// Logout Button
logoutButton.addEventListener("click", handleLogout);
// Tweet Input
tweetInput.addEventListener("change", handletweetInput);
tagInput.addEventListener("change", handletagInput);
DweetButton.addEventListener("click", handleDweetButton);

// LikeButton.addEventListener("click", handleLikeButton);
// ReTweetButton.addEventListener("click", handleReTweetButton);

searchTagInput.addEventListener("change", handlesearchTagInput);
TagSearchButton.addEventListener("click", handleTagSearchButton);