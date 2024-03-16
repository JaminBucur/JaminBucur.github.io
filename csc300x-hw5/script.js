'use strict';
(function () {
    function id(idName) {
        return document.getElementById(idName);
    }
    function checkStatus(response) {
        if (!response.ok) {
            throw Error('Error in request: ' + response.statusText);
        }
        return response.json();
    }
    const GITHUB_API_BASEURL = 'https://api.github.com/users/';
    window.addEventListener('load', init);
    function getUserRepos(username) {
        let gitHubUsername = username;
        let url = GITHUB_API_BASEURL + gitHubUsername + '/repos?sort=created$';

        let userDiv = document.getElementById('user');
        let existingUser = userDiv.querySelector('h2');

        if (existingUser) {
            userDiv.removeChild(existingUser);
        }

        let displayUser = document.createElement('h2');
        displayUser.textContent = gitHubUsername + "'s Repositories";
        userDiv.appendChild(displayUser);

        fetch(url)
            .then(checkStatus)
            .then((repoData) => {
                console.log(repoData);
                let div = document.getElementById('container');

                while (div.firstChild) {
                    div.removeChild(div.firstChild);
                }

                for (const item of repoData) {
                    let repoDiv = document.createElement('div');
                    repoDiv.className = 'repo';

                    let repoHeader = document.createElement('div');
                    repoHeader.className = 'repo-header';

                    let githubIcon = document.createElement('i');
                    githubIcon.className = 'fab fa-github fa-4x';

                    let repoName = document.createElement('p');
                    const name = item['name'];
                    const url = item['html_url'];

                    let repoLink = document.createElement('a');
                    repoLink.href = url;
                    repoLink.textContent = name;

                    repoName.appendChild(githubIcon);
                    repoName.appendChild(repoLink);
                    repoHeader.appendChild(repoName);

                    let watcherIcon = document.createElement('i');
                    watcherIcon.className = 'fas fa-eye';

                    let repoWatchers = document.createElement('span');
                    const watchers = item['watchers_count'];
                    repoWatchers.textContent = ' ' + watchers;
                    watcherIcon.appendChild(repoWatchers);

                    repoHeader.appendChild(watcherIcon);
                    repoDiv.appendChild(repoHeader);

                    let repoDescription = document.createElement('p');
                    const description = item['description'];
                    repoDescription.innerHTML = description;
                    repoDiv.appendChild(repoDescription);

                    let blankLine = document.createElement('br');
                    repoDiv.appendChild(blankLine);

                    let repoDate = document.createElement('p');
                    const date = new Date(item['created_at']);
                    repoDate.innerHTML = 'Created: <strong>' + date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + '</strong>';
                    repoDiv.appendChild(repoDate);

                    let updateDate = document.createElement('p');
                    const updated = new Date(item['updated_at']);
                    updateDate.innerHTML = 'Updated: <strong>' + updated.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) + '</strong>';
                    repoDiv.appendChild(updateDate);

                    fetch(item['commits_url'].replace('{/sha}', ''))
                        .then(checkStatus)
                        .then((commitData) => {
                            let commitCount = commitData.length;
                            let commits = document.createElement('p');
                            commits.innerHTML = 'Commits: <strong>' + commitCount + '</strong>';
                            repoDiv.appendChild(commits);
                        })

                    fetch(item['languages_url'])
                        .then(checkStatus)
                        .then((languageData) => {
                            let languages = document.createElement('p');
                            languages.innerHTML = 'Languages: <strong>' + Object.keys(languageData).join(', ') + '</strong>';
                            repoDiv.appendChild(languages);
                        });

                    let rule = document.createElement('hr');
                    repoDiv.appendChild(rule);

                    div.appendChild(repoDiv);
                }
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
    }
    function init() {
        getUserRepos("JaminBucur");
        id('submit').addEventListener('click', function (e) {
            e.preventDefault();
            getUserRepos(id('search').value);
        });
    }
})();