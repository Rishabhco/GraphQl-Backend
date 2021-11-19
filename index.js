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
    repositoryOwner(login: "STCVIT") {
      avatarUrl(size: 10)
      id
      login
    }
    repository(name: "${repoName}", owner: "STCVIT", followRenames: false) {
      description
      createdAt
      databaseId
      deleteBranchOnMerge
      forkCount
      forkingAllowed
      isFork
      isInOrganization
      isPrivate
      isMirror
      isLocked
      id
      homepageUrl
      hasWikiEnabled
      hasProjectsEnabled
      hasIssuesEnabled
      name
      projectsUrl
      projectsResourcePath
      pushedAt
      collaborators {
        nodes {
          avatarUrl(size: 10)
          createdAt
          databaseId
          email
          name
          updatedAt
          login
          location
          isSiteAdmin
          isEmployee
          company
          bio
          viewerCanCreateProjects
          viewerCanChangePinnedItems
          url
        }
        edges {
          permission
        }
        totalCount
      }
      autoMergeAllowed
      codeOfConduct {
        body
        id
        key
        name
        resourcePath
        url
      }
      viewerPermission
      viewerHasStarred
      viewerCanAdminister
      url
      updatedAt
      nameWithOwner
      owner {
        avatarUrl(size: 10)
        id
        login
      }
      descriptionHTML
      isEmpty
      isBlankIssuesEnabled
      isDisabled
      isArchived
      languages(first: 10) {
        nodes {
          color
          id
          name
        }
        totalCount
        totalSize
      }
      mergeCommitAllowed
      releases(first: 10) {
        totalCount
      }
      commitComments(first: 10) {
        totalCount
        nodes {
          id
          author {
            login
            avatarUrl(size: 10)
          }
          authorAssociation
          bodyHTML
          body
          bodyText
          createdAt
          lastEditedAt
          publishedAt
        }
      }
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