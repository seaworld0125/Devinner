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