module.exports = mergeLabels;

function mergeLabels({ existingLabels, labelsToAdd, labelsToRemove, robot}) {
  const finalLabelsList = new Set(existingLabels);
  let hasChanges = false;

  if (labelsToRemove.length > 0) {
    robot.log('Removing labels', labelsToRemove);
    hasChanges = true;
    for (let label of labelsToRemove) {
      finalLabelsList.delete(label);
    }
  }
  if (labelsToAdd.length > 0) {
    robot.log('Adding labels', labelsToAdd);
    hasChanges = true;
    for (let label of labelsToAdd) {
      finalLabelsList.add(label);
    }
  }
  return { hasChanges, finalLabelsList };
}
