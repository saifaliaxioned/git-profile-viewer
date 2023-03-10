const userForm = document.querySelector('.user-form'),
  userInput = document.querySelector('.user-input'),
  inputGroup = document.querySelector('.input-group'),
  stringPattern = /^[a-zA-Z0-9]+$/,
  userContainer = document.querySelector('.user-container');

let lastUpdated = null,result,newRepos = [],isValid;
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
  }).catch((error) => {
    const span = document.createElement('span');
    span.classList.add('user-error');
    span.innerText = error;
    userContainer.appendChild(span);
    const errorSpan = document.querySelector('.user-error');
    result = errorSpan;
  });
}

const userDetails = (repoData, data) => {
  const gitItems = document.createElement('ul');
  gitItems.classList.add('git-items');
  for (let i = 0; i < repoData.length; i++) {
    if (i < 5) {
      const li = document.createElement('li');
      li.innerHTML = `<a href=${repoData[i].html_url} title=${repoData[i].name} target="_blank" rel="noopener noreferrer">${repoData[i].name}</a>`;
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

const createError = (input, err) => {
  const inputGroup = input.parentElement;
  const error = document.createElement('span');
  error.classList.add('input-error');
  error.innerText = err;
  inputGroup.appendChild(error);
  const userContent = document.querySelector('.user-content');
  if (userContent) {
    userContent.remove();
  }
  if (result) {
    result.remove();
  }
}

const validateInput = (input, pattern) => {
  isValid = true;
  const errorActive = document.querySelector('.input-error');
  if (errorActive) {
    errorActive.remove();
  }
  if (!input.value) {
    createError(input, '*Field is required');
    isValid = false;
  } else if (!pattern.test(input.value)) {
    createError(input, '*Space and Numbers are not allowed');
    isValid = false;
  }
  return isValid;
}

userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  validateInput(userInput, stringPattern);
});

userInput.addEventListener('keyup', (e) => {
  const errorActive = document.querySelector('.input-error');
  if (e.key == 'Enter' && userInput.value && isValid && !errorActive) {
    const user = userInput.value;
    const userContent = document.querySelector('.user-content');
    if (userContent) {
      userContent.remove();
    }
    if (result) {
      result.remove();
    }
    getData(user);
  }
});



























