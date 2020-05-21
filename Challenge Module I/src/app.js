const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateRequest( request, response, next ) {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  request.body = {
    title,
    url,
    techs
  };

  const errors = [];
  
  const repositoryIndex = repositories.findIndex( repository => repository.url === url);
  if ( repositoryIndex >= 0 || (repositoryIndex >= 0 && repository.id !== id)) {
    errors.push('Já existe um repositório com está URL no Banco de Dados');
  };

  if ( !Array.isArray(techs)) {
    errors.push('O campo techs deve ser um Array.');
  } else if (techs.findIndex( tech => typeof(tech) !== 'string' ) >= 0) {
    errors.push('O campo techs deve ser um Array exclusivamente de Strings.');
  };

  if ( typeof(title) !== 'string' ) {
    errors.push('O campo title deve ser uma String');
  };

  if ( typeof(url) !== 'string' || ( !url.includes('http://github.com/')) ) {
    errors.push('O campo url não é um repositório GitHub');
  };

  if ( errors.length ) {
    return response.status(400).json({ error: errors });
  };

  return next();
};

function validateId( request, response, next ) {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex( repository => repository.id === id );
  console.log(repositoryIndex);
  if ( repositoryIndex === -1 ) {
    return response.status(404).json({ error: `ID ${id} not found`});
  };

  return next();
};

app.use('/repositories/:id', validateId);

const repositories = [];

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

  const repositoryIndex = repositories.findIndex( repository => repository.id = id);
  console.log(repositoryIndex);
  console.log(repositories[repositoryIndex]);
  const updatedRepository = {
    ...repositories[repositoryIndex],
    title,
    url,techs,
  };

  // console.log(updatedRepository);
  repositories.splice(repositoryIndex, 1);
  repositories.push(updatedRepository);

  response.status(200).json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
