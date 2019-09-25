const yaml = require('js-yaml');
const determineLabels = require('./src/determine-labels');
const mergeLabels = require('./src/merge-labels');

module.exports = robot => {
  robot.on('pull_request.opened', sizelabel);
  robot.on('pull_request.reopened', sizelabel);
  robot.on('pull_request.synchronize', sizelabel);

  async function sizelabel (context) {
    const content = await context.github.repos.getContents(context.repo({
      path: '.github/sizelabeler.yml'
    }));
    const config = yaml.safeLoad(
      Buffer.from(content.data.content, 'base64').toString()
    );

    const { action, pull_request } = context.payload;
    const {
      additions,
      deletions,
      number: issue_number,
      labels: prLabels,
    } = pull_request;

    const existingLabels = new Set(prLabels.map(({ name }) => name));

    const { labelsToAdd, labelsToRemove } = determineLabels({
      config,
      action,
      additions,
      deletions,
      existingLabels,
      logger: (...args) => robot.log(...args),
    });

    const { hasChanges, finalLabelsList } = mergeLabels({
      existingLabels,
      labelsToAdd,
      labelsToRemove,
      robot,
    });

    if (hasChanges) {
      // only send the request if we need to
      await context.github.issues.replaceLabels(context.repo({
        issue_number,
        labels: Array.from(finalLabelsList),
      }));
    }
  }
}
