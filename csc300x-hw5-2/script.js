document.getElementById('randomJokeButton').addEventListener('click', getRandomJoke);

function getRandomJoke() {
    fetch('http://localhost:8000/jokebook/categories')
        .then(response => response.json())
        .then(categories => {
            const fetchPromises = categories.map(category =>
                fetch(`http://localhost:8000/jokebook/joke/${category}`).then(response => response.json())
            );
            return Promise.all(fetchPromises);
        })
        .then(results => {
            const allJokes = results.flat();
            const joke = allJokes[Math.floor(Math.random() * allJokes.length)];
            document.getElementById('jokeText').innerText = joke.joke;
            document.getElementById('responseText').innerText = joke.response;
        })
        .catch(e => {
            console.log('There was a problem with your fetch operation: ' + e.message);
        });
}
getRandomJoke();

document.getElementById('addJokeForm').style.display = 'none';
document.getElementById('addJokeButton').addEventListener('click', function () {
    var form = document.getElementById('addJokeForm');
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('jokeCategories').addEventListener('click', function () {
    const categoryList = document.getElementById('categoryList');
    if (categoryList.style.display === 'block') {
        categoryList.style.display = 'none';
    } else {
        categoryList.style.display = 'block';
        categoryList.innerHTML = '';
        fetch('http://localhost:8000/jokebook/categories')
            .then(response => response.json())
            .then(categories => {
                const list = document.createElement('div');
                const header = document.createElement('h2');
                header.innerText = 'Categories:';
                list.appendChild(header);
                categories.forEach(category => {
                    const item = document.createElement('h3');
                    item.innerText = category;
                    item.style.cursor = 'pointer';
                    item.addEventListener('click', () => fetchJokesByCategory(category));
                    list.appendChild(item);
                });
                categoryList.appendChild(list);
            })
            .catch(e => {
                console.log('error: ' + e.message);
            });
    }
});

function fetchJokesByCategory(category) {
    fetch(`http://localhost:8000/jokebook/joke/${category}`)
        .then(response => response.json())
        .then(jokes => {
            const jokesList = document.getElementById('jokesList');
            jokesList.innerHTML = '';

            const categoryHeader = document.createElement('h2');
            categoryHeader.innerText = `Category: ${category}`;
            jokesList.appendChild(categoryHeader);

            let blankLine = document.createElement('br');
            jokesList.appendChild(blankLine);

            jokes.forEach(joke => {
                const item = document.createElement('div');
                item.className = 'jokeTile';

                const jokeText = document.createElement('p');
                jokeText.className = 'jokeText';
                jokeText.innerText = joke.joke;

                const responseText = document.createElement('p');
                responseText.className = 'responseText';
                responseText.innerText = joke.response;

                item.appendChild(jokeText);
                item.appendChild(responseText);
                jokesList.appendChild(item);
            });
        })
        .catch(e => {
            console.log('error: ' + e.message);
        });
}

document.getElementById('searchCategoryButton').addEventListener('click', function () {
    const category = document.getElementById('categorySearchInput').value;
    fetchJokesByCategory(category);
});

document.getElementById('addJokeForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const category = document.getElementById('jokeCategory').value;
    const joke = document.getElementById('jokeInput').value;
    const response = document.getElementById('responseInput').value;

    const newJoke = { category, joke, response };

    fetch('http://localhost:8000/jokebook/joke/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJoke),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Joke added successfully!');
            document.getElementById('addJokeForm').reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to add joke.');
        });

    setTimeout(() => {
        fetchJokesByCategory(category);
    }, 1000);
});