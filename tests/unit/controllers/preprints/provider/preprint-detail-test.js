import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

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
        'service:toast',
    ],
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

test('isAdmin computed property', function (assert) {
    this.inject.service('store');

    const { store } = this.store;
    const ctrl = this.subject();

    Ember.run(() => {
        const node = store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const model = store.createRecord('preprint', { node });

        ctrl.setProperties({ model });
        ctrl.set('node.currentUserPermissions', ['admin']);

        assert.strictEqual(ctrl.get('isAdmin'), true);
    });
});


test('actionDateLabel computed property', function (assert) {
    this.inject.service('store');

    const { store } = this.store;
    const ctrl = this.subject();

    Ember.run(() => {
        const node = store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const provider = store.createRecord('preprint-provider', {
            reviewsWorkflow: 'pre-moderation',
        });

        const model = store.createRecord('preprint', { node, provider });

        ctrl.setProperties({ model });

        assert.strictEqual(ctrl.get('actionDateLabel'), 'content.dateLabel.submittedOn');

        ctrl.set('model.provider.reviewsWorkflow', 'post-moderation');

        assert.strictEqual(ctrl.get('actionDateLabel'), 'content.dateLabel.createdOn');
    });
});

