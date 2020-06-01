const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRequest( request, response, next ) {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  request.body = {
    title,
    url,
    techs
  };

  return next();
};

function validateId( request, response, next ) {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex( repository => repository.id === id );
  
  if ( repositoryIndex === -1 ) {
    return response.status(400).json({ error: `ID ${id} not found`});
  };

  request.body.repositoryIndex = repositoryIndex;
  return next();
};

app.use('/repositories/:id', validateId);

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", validateRequest, (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  response.status(201).json(repository);
});

app.put("/repositories/:id", validateRequest, (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id );
  
  const updatedRepository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };

  repositories.splice(repositoryIndex, 1);
  repositories.push(updatedRepository);

  response.status(200).json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  repositories.splice(repositoryIndex, 1);
  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);
  const likedRepo = repositories[repositoryIndex]
  
  likedRepo.likes = likedRepo.likes + 1;
  
  response.status(200).json(likedRepo);
});

module.exports = app;
