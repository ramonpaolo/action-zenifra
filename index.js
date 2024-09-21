const core = require('@actions/core');
const github = require('@actions/github');

try {
  const API_KEY = core.getInput('api_key');
  const NEW_IMAGE = core.getInput('image');

  core.info(`updating deployment to use image ${NEW_IMAGE}`);

  const infoProject = new Promise((resolve, reject) => fetch({
    url: 'https://zenifra-core-a55edb3e932113d742.zenifra.com/v1/user/project',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    },
  })
    .then(async (v) => {
      core.info('get info about the project with success!');

      resolve(await v.json());
    })
    .catch((e) => {
      core.error('error to get info about the project');

      reject(e);
    })
  )

  fetch({
    url: `https://zenifra-core-a55edb3e932113d742.zenifra.com/v1/user/project/${infoProject.data.id}/image`,
    method: 'PATCH',
    body: JSON.stringify({
      image: NEW_IMAGE,
    }),
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    },
  })
    .then(() => {
      core.info('update deployment with new image was a success!')
    })
} catch (error) {
  core.setFailed(error.message);
}