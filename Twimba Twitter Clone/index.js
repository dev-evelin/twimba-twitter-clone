import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

 

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }

    else if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }

    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    } 
    else if(e.target.dataset.replybtn){
        handleReplyBtnClick(e.target.dataset.replybtn)
    }
    else if(e.target.id === "dark-mode"){
        handleDarkModeClick()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')


    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@dev_evelin_`,
            profilePic: `images/evelin.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            isFromUser: true,

            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }


}




function handleReplyBtnClick(tweetId){
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(replyInput.value){
        targetTweetObj.replies.push({
            handle: `@Scrimba`,
            profilePic: `images/evelin.png`,
            tweetText: replyInput.value,
        })
        
    render()
    handleReplyClick(tweetId)
    replyInput.value = ''
    }
}

function handleDarkModeClick(){
    document.body.classList.toggle("dark-mode");
        document.getElementById('tweet-input').classList.toggle('dark-mode')
        document.getElementById("reply-input").classList.toggle('dark-mode')

}

function handleDeleteClick(tweetId){
    tweetsData.filter(function(tweet, index){
        if(tweet.uuid === tweetId){
            tweetsData.splice(index, 1)
        }
    })
    render()
}


function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let trashHiddenClass = 'hidden'

        if(tweet.isFromUser){
            trashHiddenClass = ''
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">

        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail ${trashHiddenClass}">
                <i class="fa-solid fa-trash"
                data-delete="${tweet.uuid}"></i>
            </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}

        <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="images/evelin.png" class="profile-pic">
                            <div>
                                <textarea class="reply-text-area" placeholder="Tweet your reply" id="reply-input-${tweet.uuid}"></textarea>
                            </div>
                    </div>
                    <button id="reply-btn-${tweet.uuid}" class="reply-btn" data-replybtn="${tweet.uuid}">Reply</button>
                    </div>        


    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

