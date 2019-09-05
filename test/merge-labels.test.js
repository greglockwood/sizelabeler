const mergeLabels = require('../src/merge-labels');

describe('mergeLabels()', () => {
  let logLines = [];

  const defaultParams = () => {
    // reset logLines array
    logLines = [];
    return {
      robot: {
        log(...args) {
          logLines.push(args);
        }
      },
      existingLabels: new Set(),
      labelsToAdd: [],
      labelsToRemove: [],
    };
  };

  test('should not remove existing labels not in the remove list', () => {
    const { finalLabelsList } = mergeLabels({
      ...defaultParams(),
      existingLabels: new Set(['foo', 'baz']),
      labelsToAdd: ['bar'],
      labelsToRemove: ['baz'],
    });

    expect(Array.from(finalLabelsList)).toEqual(['foo', 'bar']);
  });

  test('should return hasChanges: false if nothing changed', () => {
    const { hasChanges } = mergeLabels({
      ...defaultParams(),
      existingLabels: new Set(['foo', 'bar']),
    });
    expect(hasChanges).toBe(false);
  });

  test('should return hasChanges: true if a label was added', () => {
    const { hasChanges } = mergeLabels({
      ...defaultParams(),
      existingLabels: new Set(['foo', 'bar']),
      labelsToAdd: ['baz'],
    });
    expect(hasChanges).toBe(true);
  });

  test('should return hasChanges: true if a label was removed', () => {
    const { hasChanges } = mergeLabels({
      ...defaultParams(),
      existingLabels: new Set(['foo', 'bar']),
      labelsToRemove: ['bar'],
    });
    expect(hasChanges).toBe(true);
  });
  
});
