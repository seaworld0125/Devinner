    // get ip adress
    let ip_address = "";
    function getIp(){
      return new Promise((resolve, reject) => {
        $.getJSON('https://ipapi.co/json/', (data) => {
          resolve(data.ip);
        });
      });
    };
    getIp().then((result) => {
        console.log(result);
        socket.emit(CHECK_BAN_LIST, (result))
    });
    
    (function (){
      socket.emit(GET_NEWS, (news) => {
        console.log(news);
        for (let i = 0; i < news.length; i++) {
          let title = news[i].title;
          let link = news[i].link;
          let description = news[i].description;
          let item = document.createElement("li");
          item.innerHTML = 
            `<article class="uk-article">
                <h1 class="uk-article-title">오늘 KOSPI 뉴스</h1>
                <p class="uk-article-meta">${title}</p>
                <p class="uk-text-lead" style="color: rgba(255, 255, 255, 0.61);">${description}</p>
                <div class="uk-grid-small uk-child-width-auto" uk-grid>
                    <div>
                        <a class="uk-button uk-button-text" href="${link}" target="_blank" style="font-weight: 900;">더 읽기</a>
                    </div>
                </div>
            </article>`
          articleForm.appendChild(item);
        }
      });
    })();

    let setNickname = (nick_name) => {
      document.getElementById('nick_name').textContent = nick_name;
      titleBox.innerHTML = `안녕하세요 <b>${nick_name}</b> 님`;      
    };

    let getUsername = () => {
      var exp = /개미/;
      let nick_name = prompt('사용할 별명을 입력해주세요. (개미는 사용 불가합니다) (8자리)');
      if(nick_name) {
        if(!exp.test(nick_name)){
          socket.emit(CHECK_NICKNAME, nick_name, (unique) => {
            if(unique){
              console.log("입력한 별명 :", nick_name);
              socket.emit(SET_NICKNAME, nick_name);
              alert(nick_name + ' 으로 설정되었습니다.');
              setNickname(nick_name);
            }
            else{
              alert(nick_name + '은 이미 존재하는 별명입니다.');
              changeButton.click();
            }
          });
        }
        else{
          alert('개미는 변경할 수 없는 별명입니다.');
        }
      }
      else{
        alert('별명을 입력하세요.');
      }
    };

    let appendMsg = (msg, align) => {
      let item = document.createElement('li');
      if(align == 'right')
      {
        item.style.textAlign="right";
      }
      item.textContent = msg;
      messages.appendChild(item);
      msgBox.scrollTo(0, msgBox.scrollHeight);
    };

    msgForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if(inputMsg.value){
        socket.emit(CHAT_MSG, inputMsg.value);
        appendMsg(inputMsg.value, 'right');
        inputMsg.value = ''; //input value reset
      }
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if(inputId.value && inputPassword.value){
        let account = {id : inputId.value, password : inputPassword.value};
        socket.emit(CHECK_ACCOUNT, account, (nick_name) => {
            if(nick_name){
              alert(nick_name + ' 님 환영합니다.');
              setNickname(nick_name);
              socket.emit(SET_NICKNAME, nick_name);
              loginForm.style.display='none';
              logoutForm.style.display='block';
            }
            else{
              alert('로그인 실패');
            }
          });
        inputId.value = '';
        inputPassword.value = '';
      }
    });
    
    changeButton.addEventListener('click', (e) => {
      e.preventDefault();
      // getUserName();
      var exp = /개미/;
      let nick_name = prompt('사용할 별명을 입력해주세요. (개미는 사용할 수 없는 단어입니다) (8자리)');
      if(nick_name) {
        if(!exp.test(nick_name)){
          socket.emit(CHECK_NICKNAME, nick_name, (unique) => {
            if(unique){
              console.log("입력한 별명 :", nick_name);
              socket.emit(SET_NICKNAME, nick_name);
              alert(nick_name + ' 으로 설정되었습니다.');
              setNickname(nick_name);
            }
            else{
              alert(nick_name + '은 이미 존재하는 별명입니다.');
              changeButton.click();
            }
          });
        }
        else{
          alert('개미는 사용할 수 없는 단어입니다');
        }
      }
      else{
        alert('별명을 입력하세요.');
      }
    });
    
    accountPage.addEventListener('click', (e) =>{
      e.preventDefault();
      location.href = '/account';
    });
    
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      location.href = '/';
    });

    socket.on(CONNECTED, (count) => {
      countBox.textContent = "접속자 수 : " + count;
    });
    
    socket.on(UPDATE_CLIENTNUM, (count) => {
      countBox.textContent = "접속자 수 : " + count;
    });
    
    socket.on(CHAT_MSG, (msg) => {
      appendMsg(msg, 'left');
    });

    socket.on(GET_ALERT, (msg) => {
      alert(msg);
    });