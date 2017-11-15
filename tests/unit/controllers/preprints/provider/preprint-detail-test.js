import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import config from 'ember-get-config';

moduleFor('controller:preprints/provider/preprint-detail', 'Unit | Controller | preprints/provider/preprint-detail', {
    needs: [
        'model:action',
        'model:file',
        'model:file-version',
        'model:comment',
        'model:node',
        'model:preprint',
        'model:preprint-provider',
        'model:institution',
        'model:contributor',
        'model:file-provider',
        'model:registration',
        'model:draft-registration',
        'model:log',
        'model:user',
        'model:citation',
        'model:license',
        'model:wiki',
        'service:metrics',
        'service:theme',
        'service:currentUser',
        'service:i18n',
        'service:toast'
    ]
});

test('Initial properties', function (assert) {
    const ctrl = this.subject();

    const expected = {
        fullScreenMFR: false,
        savingAction: false,
        showLicense: false,
        _activeFile: null,
        chosenFile: null,
    };

    const propKeys = Object.keys(expected);
    const actual = ctrl.getProperties(propKeys);

    assert.ok(propKeys.every(key => expected[key] === actual[key]));
});
