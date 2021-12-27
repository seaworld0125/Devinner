// article
const createButton = document.getElementById('create-button');
const status_ = "toolbar=no,scrollbars=yes,resizable=yes,status=no,menubar=no,width=800,height=800,top=0,left=0"; 
const mypageButton = document.getElementById('button-mypage');

mypageButton.addEventListener('click', (e) => {
  e.preventDefault();
  window.name = "parentPage";
  child_window = window.open("/users/mypage", "마이페이지", status_);
});
createButton.addEventListener('click', (e) => {
  e.preventDefault();
  window.name = "parentPage";
  child_window = window.open("/article", "글 쓰기", status_);
});

$(document).on("click", "#article_id", (e) => {
  e.preventDefault();
  window.name = "parentPage";
  child_window = window.open(e.target.href, e.target.innerText, status_);
});

const userTab = document.getElementById('user-tab');
const profileImg    = document.getElementById('profile-img');
const profileName   = document.getElementById('profile-name');
const profileBlog   = document.getElementById('profile-blog');
const profileBio    = document.getElementById('profile-bio');
const profileGithub = document.getElementById('profile-github');
const project_list_ment  = document.getElementById('project-list-ment');
const project_list = document.getElementById('project-list');

function getProjects(url_) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: url_,
      success: (result) => {
        if(!result) reject();
        resolve(result);
      }
    });
  });
};
function getGithubInfo(url_) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: url_,
      success: (result) => {
        resolve(result);
      }
    });
  });
};
function getGithubId(nickname) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "/users/github/" + nickname,
      success: (result) => {
          if(result.error) {
            reject(result.error);
          }
          else if(result.github_id) {
            getGithubInfo("https://api.github.com/users/" + result.github_id)
            .then((result) => {
              resolve(result);
            });
          }
          else {
            resolve(undefined);
          }
      }
    });
  });
};

$(document).on("click", "#article_author", (e) => {
  e.preventDefault();
  console.log(e.target.innerText);

  let nickname = e.target.innerText;
  getGithubId(nickname)
  .then( async (result) => {
    if(result) {
      profileImg.src = result.avatar_url;
      profileName.innerText = result.name;

      if(result.blog) {
        profileBlog.innerText = 'Blog';
        profileBlog.href = result.blog;
      }
      else {
        profileBlog.innerText = '';
        profileBlog.href = '';
      }
      if(result.html_url) {
        profileGithub.innerText = 'Github';
        profileGithub.href = result.html_url;
      }
      profileBio.innerText = result.bio;
    }
    else {
      profileImg.src = "/img/unknown_profile.png";
      profileName.innerText = '';
      profileBlog.innerText = '';
      profileGithub.innerText = '';
      profileBio.innerText = '';
    }
    project_list_ment.innerText = '프로젝트 목록';

    // 프로젝트 등록..
    try {
      while (project_list.hasChildNodes()) {
        project_list.removeChild(project_list.firstChild);
      }

      let projects = await getProjects('/project/' + nickname);
      projects.forEach(project => {
        let anchor = document.createElement('a');
        anchor.id = 'project-link';
        anchor.target = '_blank';
        anchor.href = 'https://github.com/' + project.github_id + '/' + project.repository;
        let div = document.createElement('div');
        div.id = 'project';
        let img = document.createElement('img');
        img.src = project.img;
        let title = document.createElement('div');
        title.id = 'project-title';
        title.innerText = project.title;
        let desc = document.createElement('div');
        desc.id = 'project-desc';
        desc.innerText = project.description;

        div.appendChild(img);
        div.appendChild(title);
        div.appendChild(desc);
        anchor.appendChild(div);
        project_list.appendChild(anchor);
      });
    }
    catch(error) {
      throw error;
    }
  })
  .catch((error) => {
    console.log(error);
    profileImg.src = "/img/error_profile.png";
    project_list_ment.innerText = '에러 수정 중입니다';
  })
  .finally(() => {
    userTab.style.display = 'block';
  });
}); 

$(document).on("click", (e) => {
  if(userTab.style.display === 'block' && e.target.id !== 'article_author' && e.clientX > 400) {
    userTab.style.display = 'none';
  }
}); 