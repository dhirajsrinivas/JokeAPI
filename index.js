import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

const API = "https://v2.jokeapi.dev/joke/";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index", { joke: null }); // Initial render with no joke
});

app.post("/", async (req, res) => {
    const category = req.body.category;
    const minId = req.body.minId;
    const maxId = req.body.maxId;

    try {
        // Construct the API URL dynamically
        const apiUrl = `${API}${category}?idRange=${minId}-${maxId}`;
        console.log("API URL:", apiUrl); // Log the constructed URL for debugging
        const response = await axios.get(apiUrl);

        console.log("API Response:", response.data); // Log the API response for debugging

        // Extract the joke from the response
        const joke = (response.data.joke )|| "No joke found with this ID range.";

        res.render("index", { joke });
    } catch (error) {
        console.error("API Error:", error); // Log the error
        res.render("index", { joke: "Error fetching joke. Please try again." });
    }
});

app.listen(port, () => {
    console.log("Listening on server " + port);
});
