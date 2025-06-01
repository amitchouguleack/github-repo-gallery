const overview = document.querySelector(".overview");
const username = "amitchouguleack";
const repoList = document.querySelector(".repo-list");
const allRepoContainer = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");
const viewReposButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const gitUserInfo = async function () {
    try {
        const userInfoResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userInfoResponse.ok) {
            throw new Error(`GitHub API error: ${userInfoResponse.status}`);
        }
        const userData = await userInfoResponse.json();
        displayUserInfo(userData);
    } catch (error) {
        console.error("Error fetching user info:", error);
        overview.innerHTML = `<p>Failed to load user information. Please check your username or network connection.</p>`;
    }
};

const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
        <figure>
            <img alt="user avatar" src="${data.avatar_url}" />
        </figure>
        <div>
            <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
            <p><strong>Bio:</strong> ${data.bio || 'No bio available'}</p>
            <p><strong>Location:</strong> ${data.location || 'Not specified'}</p>
            <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div>
    `;
    overview.append(div);
    gitRepos();
};

const gitRepos = async function () {
    try {
        const fetchReposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=created`);
        if (!fetchReposResponse.ok) {
            throw new Error(`GitHub API error: ${fetchReposResponse.status}`);
        }
        const repos = await fetchReposResponse.json();
        displayRepos(repos);
    } catch (error) {
        console.error("Error fetching repositories:", error);
        repoList.innerHTML = `<p>Failed to load repositories. Please try again later.</p>`;
    }
};

const displayRepos = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

repoList.addEventListener("click", function (e) {
    const clickedElement = e.target.closest("h3");
    if (clickedElement) {
        const repoName = clickedElement.innerText;
        getRepoInfo(repoName);
    }
});

const getRepoInfo = async function (repoName) {
    try {
        const fetchInfoResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        if (!fetchInfoResponse.ok) {
            throw new Error(`GitHub API error: ${fetchInfoResponse.status}`);
        }
        const repoInfo = await fetchInfoResponse.json();

        const fetchLanguagesResponse = await fetch(repoInfo.languages_url);
        if (!fetchLanguagesResponse.ok) {
            throw new Error(`GitHub API error: ${fetchLanguagesResponse.status}`);
        }
        const languageData = await fetchLanguagesResponse.json();

        const languages = Object.keys(languageData);
        displayRepoInfo(repoInfo, languages);
    } catch (error) {
        console.error("Error fetching repository details:", error);
        repoData.innerHTML = `<p>Failed to load repository details. Please try again.</p>`;
        viewReposButton.classList.remove("hide");
    }
};

const displayRepoInfo = function (repoInfo, languages) {
    repoData.innerHTML = "";
    repoData.classList.remove("hide");
    allRepoContainer.classList.add("hide");
    filterInput.classList.add("hide");
    viewReposButton.classList.remove("hide");

    const div = document.createElement("div");
    div.classList.add("repo-details-card");
    div.innerHTML = `
        <h3>${repoInfo.name}</h3>
        <p><strong>Description:</strong> ${repoInfo.description || 'No description available'}</p>
        <p><strong>Default Branch:</strong> ${repoInfo.default_branch}</p>
        <p><strong>Languages:</strong> ${languages.length > 0 ? languages.join(", ") : 'No languages specified'}</p>
        <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoData.append(div);
};

viewReposButton.addEventListener("click", function () {
    allRepoContainer.classList.remove("hide");
    filterInput.classList.remove("hide");
    repoData.classList.add("hide");
    viewReposButton.classList.add("hide");
});

filterInput.addEventListener("input", function (e) {
    const searchText = e.target.value.toLowerCase();
    const repos = document.querySelectorAll(".repo");

    for (const repo of repos) {
        const repoLowerText = repo.innerText.toLowerCase();
        if (repoLowerText.includes(searchText)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});

gitUserInfo();