import dotenv from 'dotenv';
dotenv.config();
import express from 'express';;
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from "cors";
import fetch from 'node-fetch';
const app=express()
const port=process.env.PORT||3000

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

app.listen(port,()=>{
    console.log('Server is up on the port '+port+" !")
})

app.get('/', (req, res) => {
  res.send("Heloo to server for STCVIT");
})
app.post('/show', (req, res) => {
  const repoName=req.body.name;
  const accessToken = process.env.GIT_HUB_OAUTH_TOKEN;
  const query = `
  query {
    repository(name: "${repoName}", owner: "STCVIT", followRenames: false) {
      description
      createdAt
      forkCount
      isFork
      isInOrganization
      isPrivate
      id
      hasProjectsEnabled
      hasIssuesEnabled
      name
      pushedAt
      collaborators {
        nodes {
          createdAt
          email
          name
          location
          url
        }
        edges {
          permission
        }
        totalCount
      }
      url
      updatedAt
      nameWithOwner
      languages(first: 10) {
        nodes {
          color
          id
          name
        }
        totalCount
        totalSize
      }
      releases(first: 10) {
        totalCount
      }
      commitComments(first: 10) {
        totalCount
      }
      primaryLanguage {
        color
        id
        name
      }
      stargazerCount
    }
  }
  `;

  fetch('https://api.github.com/graphql', {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }).then(res => res.text())
    .then(body => {
      console.log(body);
      res.send(body)
    })
    .catch(error => console.error(error));
})