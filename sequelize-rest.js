const Sequelize = require("sequelize");
const express = require("express");
const app = express();
const bodyParser = express.json();
const port = 4000;

app.use(bodyParser);

const dbUrl = "postgres://postgres:whatever@localhost:5432/postgres";
const db = new Sequelize(dbUrl);

const Movie = db.define("movie", {
  title: Sequelize.STRING,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.STRING
});

startUpDd = async () => {
  try {
    await db.sync({ force: false });
    await Movie.bulkCreate([
      {
        title: "Lord of the Rings",
        yearOfRelease: 2001,
        synopsis: "Group spends 9 hours returning jewelery"
      },
      {
        title: "Harry Potter",
        yearOfRelease: 2001,
        synopsis: "Dude without a nose is strangely obcessed with teenage boy"
      },
      {
        title: "Avatar",
        yearOfRelease: 2009,
        synopsis: "Pocahontas with blue people"
      }
    ]);
  } catch (err) {
    console.error(err);
  }
};

app.post("/movie", async (req, res, next) => {
  try {
    res.json(await Movie.create(req.body));
  } catch (err) {
    next(err);
  }
});

app.get("/movie", async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const movies = await Movie.findAndCountAll({ limit, offset });

    movies.rows.length
      ? res.json({ movies: movies.rows, total: movies.count })
      : res.status(404).send("No movies found for that query");
  } catch (err) {
    next(err);
  }
});

app.get("/movie/:id", async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    movie ? res.json(movie) : res.status(404).send("Movie not found");
  } catch (err) {
    next(err);
  }
});

app.put("/movie/:id", async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    movie
      ? res.json(await movie.update(req.body))
      : res.status(404).send("Movie not found, can't update");
  } catch (err) {
    next(err);
  }
});

app.delete("/movie/:id", async (req, res, next) => {
  try {
    const num = await Movie.destroy({ where: { id: req.params.id } });
    num
      ? res.send(`Movie with id ${req.params.id} deleted.`)
      : res.status(404).send("Movie not found, can't delete");
  } catch (err) {
    next(err);
  }
});

startUpDd();
app.listen(port);
