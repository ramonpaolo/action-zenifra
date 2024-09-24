const core = require('@actions/core');
const github = require('@actions/github');

try {
  const PROJECT_ID = core.getInput('project_id');
  const NEW_IMAGE = core.getInput('image');

  core.info(`updating deployment to use image ${NEW_IMAGE}`);

  fetch(`https://zenifra-core-a81f320089a23a97e4.zenifra.com/v1/user/project/${PROJECT_ID}/image`, {
    method: 'PATCH',
    body: JSON.stringify({
      image: NEW_IMAGE,
    }),
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then((v) => {
      const receivedStatusCode = v.status;

      if (receivedStatusCode === 200) {
        core.info('update deployment with new image was a success!')
        return;
      }

      core.error(`Failed to update image; Code ${receivedStatusCode}`)

      throw new Error(`Failed to update image; Code ${receivedStatusCode}`);
    })
    .catch((e) => {
      throw e;
    })
} catch (error) {
  core.setFailed(error.message);
}