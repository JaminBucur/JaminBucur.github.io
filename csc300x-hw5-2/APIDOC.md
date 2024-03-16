# *Jokebook* API Documentation
## Endpoint 1 - GET: Categories
**Request Format:** URL <br>
**Request Type:** GET <br>
**Returned Data Format:** JSON <br>
**Description:** Retrieves a list of possible categories in the jokebook.<br>
**Example Request:** GET localhost:8000/jokebook/categories <br>
**Example Response:** 
```
["funnyJoke", "lameJoke"]
```
**Error Handling:** 
- Returns a status code 500 with an error message if an error occurs.

## Endpoint 2 - GET: Jokes by Category
**Request Format:** URL <br>
**Request Type:** GET <br>
**Returned Data Format:** JSON <br>
**Description:** Retrieves all jokes from the specified category. An optional limit parameter can be added to limit how many jokes you recieve. <br>
**Example Request:** GET: localhost:8000/jokebook/joke/lameJoke?limit=2 <br>
**Example Response:** 
```
[
  {
    "joke": "Which bear is the most condescending?",
    "response": "Pan-DUH"
  },
  {
    "joke": "What would the Terminator be called in his retirement?",
    "response": "The Exterminator"
  }
]
```
**Error Handling:** 
- Returns a status code 400 with an error message if the specified category is not found.

## Endpoint 3 - POST: Add Joke
**Request Format:** JSON {category, joke, response} <br>
**Request Type:** POST <br>
**Returned Data Format:** JSON <br>
**Description:** Adds a new joke to the specified category. <br>
**Example Request:** 
```
{
"category": "funnyJoke",
"joke": "Why don't scientists trust atoms?",
"response": "Because they make up everything!"
}
```
**Error Handling:** 
- Returns a status code 400 with an error message if the user input is invalid or insufficient.