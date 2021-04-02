
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
const TagTweets = document.getElementById("TagTweets");

const DeactiveButton = document.getElementById("DeactiveButton");


// Array to store Dweets
let dweets = [];
let LikeCount;
let LikedBy;
let ReTweetCount;
let ReTweetCountBy;


// Show User Profile Details 
const fetchUserByAddress = () => {
    // console.log(currentAccount);
    DwitterContract.methods.getUserByAddress().call({
        from: currentAccount,
        gas: "6000000",
        gasPrice: "1000000"
    }).then(
        (data)=>{
            // console.log(data);
            username.innerHTML = data[0];
            UserFollowers.innerHTML = data[1];
            UserFollowing.innerHTML = data[2];
            fetchDweets();
    
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

// Get all tweets
const fetchDweets = () => {
    // console.log("Fetch Dweet Function called");
    DwitterContract.methods.getAllPosts()
    .call(
        {
            from: currentAccount
        }
    ).then(
        data=>{
            // DwitterContract.methods.getUserByPostId()
            dweets = [...dweets, ...data];   //  a =  [1,2,3] , b = [4,5,6]  [ ...a , ...b ]   equivalent to  [1,2,3 ,4 , 5, 6 ] ;
            // console.log({dweets});
            // console.log(dweets.length);
            renderDweets(dweets);            
        }
    ).catch(console.log);
}


DwitterContract.events.newTweet().on("data", (event)=>{
    let newTweet = event.returnValues;
    // console.log(newTweet);

    // DweetId.innerHTML = newTweet[0];
    // // postTime.innerHTML = newTweet[0];
    // userOfPost.innerHTML = newTweet[1];
    // postContent.innerHTML = newTweet[2];
    // postTag.innerHTML = newTweet[3];

    const newDweet = {
        postId: newTweet[0],
        postTimeStamp: newTweet[1],
        userName: newTweet[2],
        content: newTweet[3],
        tag: newTweet[4],
    }

    custome_dweets = [...custome_dweets, newDweet];
    
    renderDweet(newDweet);

    dweets = [newDweet, ...dweets];
    
    // console.log({dweets});
})

// Contract Event Subscribe
DwitterContract.events.userSignIN().on("data", (event)=>{
    let UserDetails = event.returnValues;
    // console.log(UserDetails);
}
)

// DOM EVENT LISTENERS
const handleSearchInputChange = (event) => {
    userSearchInput = event.target.value;
    // console.log(userSearchInput);
}

var searchedUser;
const handleSearch = () => {
    DwitterContract.methods.searchUser(userSearchInput).call({
        from: currentAccount,
        gas: "6000000",
        gasPrice: "1000000"
    }).then("error",
    function (error, receipt) {
        alert(error, receipt);
    }
)
    .then(
        (data)=>{

            if(data != undefined) {

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
        alert(error, receipt);
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
            alert(error, receipt);
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
            // console.log(data);
            if(data.length<1){
                alert("No Tweet's found for this Tag");
            }
            else{
                searchList.style.visibility = "visible";
            
            for (var i = 0; i<data.length; i++){
                var li = document.createElement('li');

                const searchedid = data[i][0];
                const searchedPostTime = data[i][1];

                var ts = new Date(searchedPostTime *1000);
                    var t = ts.getDate()+
                    "/"+(ts.getMonth()+1)+
                    "/"+ts.getFullYear()+
                    " "+ts.getHours()+
                    ":"+ts.getMinutes()+
                    ":"+ts.getSeconds();

                const searchedcontent = data[i][3];
                const searchResult = searchedid + "  " + "|" + " " + searchedcontent + " " + t;

                li.appendChild(document.createTextNode(searchResult));
                TagTweets.appendChild(li);
            }
            }
            
        }
    )
}

const handleLikeButton = (postid) => {
    DwitterContract.methods.likePost(postid).send({
        from: currentAccount,
        gas: "3000000",
        gasPrice: "1000000"
    }).on("error",
    function (error, receipt) {
        alert(error, receipt);
    }
)
}

const handleReTweetButton = (postid) => {
    DwitterContract.methods.reTweet(postid).send(
        {
            from: currentAccount,
            gas: "3000000",
            gasPrice: "1000000"
        }
    ).on("error",
    function (error, receipt) {
        alert(error, receipt);
    }
)
}

let custome_dweets = [
    {
        postId: 1,
        postTimeStamp: 0,
        content: "First Dweet",
        tag: 'testing',
        userName: '0x00000000000000000000'
    },
    {
        postId: 2,
        postTimeStamp: 0,
        content: "second Dweet",
        tag: 'testing',
        userName: '0x00000000000000000000'
    },
    {
        postId: 3,
        postTimeStamp: 0,
        content: "third Dweet",
        tag: 'testing',
        userName: '0x00000000000000000000'
    }
];

const dweetsList = document.getElementById('dweetsList');

const renderDweets = (dweets) => dweets.map(renderDweet);

console.log("Test");
const renderDweet = (dweet) => {

    // console.log(dweet.length);
    
    DwitterContract.methods.getLikesByPostID(dweet.postId).call({
        from: currentAccount
    }).then(
        (data)=>{
            LikeCount = data.length;
            LikedBy = data;
            console.log(data, LikeCount);
        }
    )
    

    DwitterContract.methods.getReTweetByPostID(dweet.postId).call({
        from: currentAccount
    }).then(
        (data) => {
            ReTweetCount = data.length;
            ReTweetCountBy = data;
            console.log("Retweeted By:-"+ReTweetCountBy);
        }
    )
    

    const li = document.createElement('li');
    li.id = dweet.id;
    console.log(li.id);

    var ts = new Date(dweet.postTimeStamp *1000);
        var t = ts.getDate()+
        "/"+(ts.getMonth()+1)+
        "/"+ts.getFullYear()+
        " "+ts.getHours()+
        ":"+ts.getMinutes()+
        ":"+ts.getSeconds();

    li.innerHTML = `
    <div class="w3-container w3-card w3-white w3-round w3-margin"><br>
      <img src="./images/avatar.png" alt="Avatar" class="w3-left w3-circle w3-margin-right" style="width:60px">
      <p id="postTime" class="w3-right w3-opacity">${t}</p>
      <p id="userOfPost">${dweet.userName}</p><br>
      <hr class="w3-clear">
      <p id="DweetId">${dweet.postId}</p>
      <p id="postContent">
        ${dweet.content}
      </p>
      <hr>
      <p><label>Tag: </label><label id ="postTag">${dweet.tag}</label></p>
      <p><label>Likes: </label>${LikeCount}     <label>| Re-Tweets: </label>${ReTweetCount}</p>
      <hr>
      <button onclick="handleLikeButton(${dweet.postId})" id="LikeButton" type="button" class="w3-button w3-theme-d1 w3-margin-bottom"><i class="fa fa-thumbs-up"></i> Like</button> 
      <button onclick="handleReTweetButton(${dweet.postId})" id="ReTweetButton" type="button" class="w3-button w3-theme-d2 w3-margin-bottom"><i class="fa fa-comment"></i> Re-Tweet</button> 
    </div>`;
    dweetsList.appendChild(li);
}


const handleDeactiveButton = () =>{
    DwitterContract.methods.accountDeactive().send({
        from: currentAccount,
        gas: "3000000",
        gasPrice: "1000000"
    }).on("error",
    function (error, receipt) {
        alert(error, receipt);
        if(!error){
            window.location.href = "home.html";
        }
    }
    )
    .on("receipt", (receipt)=>{
    window.location.href = "home.html";
    })
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

searchTagInput.addEventListener("change", handlesearchTagInput);
TagSearchButton.addEventListener("click", handleTagSearchButton);

DeactiveButton.addEventListener("click", handleDeactiveButton);