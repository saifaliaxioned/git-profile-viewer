const userForm = document.querySelector('.user-form'),
  userInput = document.querySelector('.user-input'),
  userContainer = document.querySelector('.user-container'),
  wrapper = document.querySelector('.wrapper');

let lastUpdated = null,
  newRepos = [];
const getData = (user) => {
  fetch(`https://api.github.com/users/${user}`)
  .then((response) => {
    if (response.status === 404) {
      throw `No profile with this username`;
    } else {
      const errorSpan = document.querySelector('.user-error');
      if (errorSpan) {
        errorSpan.remove();
      }
      return response.json();
    }
  }).then((data) => {
    let repo = `${data.repos_url}?sort=created`;
    repoData(repo, data);
  }).catch((error) => {
    const span = document.createElement('span');
    span.classList.add('user-error');
    span.innerText = error;
    userContainer.appendChild(span);
  });
}

const repoData = (repo, data) => {
  fetch(repo)
    .then((response) => { 
      if (response.status === 404) {
        throw `No profile with this username`;
      } else {
        return response.json();
      }
    })
    .then((repoData) => {
      userDetails(repoData, data)
    })
    .catch((error) => {
      console.log(error);
    });
}

const userDetails = (repoData, data) => {
  const gitItems = document.createElement('ul');
  gitItems.classList.add('git-items');
  for (let i = 0; i < repoData.length; i++) {
    if (i < 5) {
      const li = document.createElement('li');
      li.innerHTML = `${repoData[i].name}`;
      gitItems.appendChild(li);
    }
  };

  const userContent = document.createElement('div');
  userContent.classList.add('user-content');
  userContent.innerHTML = `
  <figure >
  <img src="${data.avatar_url}" alt="">
  </figure>

  <div class="repo-content">
    <h2 class="author-name">${data.name}</h2>
    <p>${data.bio}</p>
    <ul class="follow-items">
      <li>${data.followers} <span>Followers</span></li>
      <li>${data.following} <span>Following</span></li>
      <li>${data.public_repos} <span>Repos</span></li>
    </ul>
  </div>`;
  userContainer.appendChild(userContent);
  const repoContent = document.querySelector('.repo-content');
  repoContent.appendChild(gitItems);
};

userForm.addEventListener('submit', (e) => {
  e.preventDefault();
});

userInput.addEventListener('keyup', (e) => {
  if (e.key == 'Enter' && userInput.value) {
    const user = userInput.value;
    const userContent = document.querySelector('.user-content');
    if (userContent) {
      userContent.remove();
    }
    getData(user);
  }
});



























