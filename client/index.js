

// ************************************* HOME PAGE *************************************
// DOM Manipulation
const userInputElement = document.getElementById("userInput");
const SignUpButton = document.getElementById("SignUpButton");
const SignInButton = document.getElementById("SignInButton");

// DOM Event Handlers
const handleInputChange = (event) => {
    userInput = event.target.value;
    console.log(userInput);
}


const handleSignUp = () => {
    DwitterContract.methods.signUP(userInput).send({
        from: currentAccount,
        gas: "6000000",
        gasPrice: "1000000"
    }).on("error",
            function (error, receipt) {
                alert(error, receipt);
                if(!error){
                    window.location.href = "UserDashBoard.html";
                }
            }
    )
    .on("receipt", (receipt)=>{
        window.location.href = "UserDashBoard.html";
    })
}

const handleSignIn = () => {
    DwitterContract.methods.makeSignIn().send({
        from: currentAccount,
        gas: "6000000",
        gasPrice: "1000000"
    })
    .on("error",
            function (error, receipt) {
                alert(error, receipt);
            }
    )
    .on("receipt", (receipt)=>{
        window.location.href = "UserDashBoard.html";
    })
    
}

userInputElement.addEventListener("change", handleInputChange);
SignUpButton.addEventListener("click", handleSignUp);
SignInButton.addEventListener("click", handleSignIn);
