var commentList = document.getElementById("comment-list");

commentList.addEventListener("click", function(e) {
    let replyForm = document.getElementById("reply-form-" + e.target.value);
    
    if(replyForm.style.display === "none") {
        closeAllReplyForm();
        replyForm.style.display = "block";
    }
    else
        closeAllReplyForm();
});

function closeAllReplyForm() {
    let allReplyForm = document.getElementsByClassName("reply-form");

    for(let i = 0; i < allReplyForm.length; i++) {
        let tmpForm = document.getElementById(allReplyForm[i].id);

        if(tmpForm.style.display === "block")
            tmpForm.style.display = "none";
    }
}